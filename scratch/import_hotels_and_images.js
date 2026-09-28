const fs = require('fs');
const path = require('path');
const mysql = require(require('path').resolve(__dirname, '../backend/node_modules/mysql2/promise'));
require(path.resolve(__dirname, '../backend/node_modules/dotenv')).config({ path: path.resolve(__dirname, '../backend/.env') });

const EXTRACTED_DIR = path.resolve(__dirname, '../extracted_hotel_images');
const UPLOAD_DIR = path.resolve(__dirname, '../backend/public/uploads/hotels');
const CSV_PATH = path.resolve(__dirname, '../New_Hotels_Import.csv');

async function main() {
  const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: parseInt(process.env.DB_PORT || '3306', 10),
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
  });

  console.log('Connected to MySQL database pool.');

  if (!fs.existsSync(UPLOAD_DIR)) {
    fs.mkdirSync(UPLOAD_DIR, { recursive: true });
    console.log(`Created uploads directory: ${UPLOAD_DIR}`);
  }

  // 1. Read New_Hotels_Import.csv and insert missing hotels
  const csvContent = fs.readFileSync(CSV_PATH, 'utf8');
  const lines = csvContent.trim().split('\n');

  let hotelsInserted = 0;
  let hotelsExisting = 0;
  const hotelIdByName = {};

  for (let i = 1; i < lines.length; i++) {
    if (!lines[i].trim()) continue;

    const regex = /(?:^|,)(?:"([^"]*)"|([^,]*))/g;
    const matches = [];
    let match;
    while ((match = regex.exec(lines[i])) !== null) {
      matches.push(match[1] !== undefined ? match[1] : match[2]);
    }

    const [
      hotel_name,
      location_name,
      hotel_code,
      location_id,
      property_type,
      hotel_type,
      address,
      map_link,
      description,
      status,
      remarks
    ] = matches.map(m => (m ? m.trim() : ''));

    if (!hotel_name || !location_id) continue;

    const [existing] = await pool.execute(
      'SELECT hotel_id FROM hotels WHERE hotel_name = ? AND location_id = ?',
      [hotel_name, location_id]
    );

    let hotelId;
    if (existing.length > 0) {
      hotelId = existing[0].hotel_id;
      hotelsExisting++;
    } else {
      const [insertRes] = await pool.execute(
        `INSERT INTO hotels 
        (hotel_code, location_id, hotel_name, property_type, hotel_type, address, map_link, description, status, remarks, created_at, updated_at) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())`,
        [
          hotel_code,
          parseInt(location_id, 10),
          hotel_name,
          property_type || 'INTERNAL_PROPERTY',
          hotel_type || 'HOTEL',
          address,
          map_link,
          description,
          status || 'ACTIVE',
          remarks
        ]
      );
      hotelId = insertRes.insertId;
      hotelsInserted++;
      console.log(`Inserted Hotel [ID: ${hotelId}]: ${hotel_name} (${location_name})`);
    }

    hotelIdByName[hotel_name.toLowerCase()] = hotelId;
    hotelIdByName[`${hotel_name} - ${location_name}`.toLowerCase()] = hotelId;
  }

  console.log(`\nHotel Summary: ${hotelsInserted} newly inserted, ${hotelsExisting} already in DB.`);

  // 2. Process extracted image folders
  let baseImagesFolder = EXTRACTED_DIR;
  if (fs.existsSync(path.join(EXTRACTED_DIR, 'hotel_images'))) {
    baseImagesFolder = path.join(EXTRACTED_DIR, 'hotel_images');
  }

  const folderEntries = fs.readdirSync(baseImagesFolder, { withFileTypes: true });

  let imagesImportedTotal = 0;
  let foldersProcessed = 0;

  for (const entry of folderEntries) {
    if (!entry.isDirectory()) continue;

    const folderName = entry.name;
    const folderPath = path.join(baseImagesFolder, folderName);

    let hotelNameCandidate = folderName;
    if (folderName.includes(' - ')) {
      hotelNameCandidate = folderName.split(' - ')[0].trim();
    }

    let hotelId = hotelIdByName[folderName.toLowerCase()] || hotelIdByName[hotelNameCandidate.toLowerCase()];

    if (!hotelId) {
      const [dbMatch] = await pool.execute(
        'SELECT hotel_id FROM hotels WHERE LOWER(hotel_name) = ? OR LOWER(hotel_name) = ?',
        [folderName.toLowerCase(), hotelNameCandidate.toLowerCase()]
      );
      if (dbMatch.length > 0) {
        hotelId = dbMatch[0].hotel_id;
      }
    }

    if (!hotelId) {
      console.warn(`Could not match folder "${folderName}" to any hotel in database. Skipping.`);
      continue;
    }

    // Check if images already attached for this hotel
    const [existingImgs] = await pool.execute(
      'SELECT COUNT(*) as count FROM hotel_images WHERE hotel_id = ?',
      [hotelId]
    );

    if (existingImgs[0].count > 0) {
      console.log(`Skipping "${hotelNameCandidate}" (Hotel ID: ${hotelId}) - already has ${existingImgs[0].count} images.`);
      continue;
    }

    const files = fs.readdirSync(folderPath).filter(f => {
      const ext = path.extname(f).toLowerCase();
      return ['.jpg', '.jpeg', '.png', '.webp'].includes(ext);
    }).sort();

    if (files.length === 0) continue;

    let sortOrder = 0;
    let imagesForThisHotel = 0;

    for (const file of files) {
      const ext = path.extname(file).toLowerCase();
      const destFilename = `${Date.now()}_${Math.random().toString(36).slice(2, 8)}${ext}`;
      const srcPath = path.join(folderPath, file);
      const destPath = path.join(UPLOAD_DIR, destFilename);
      const dbImagePath = `/uploads/hotels/${destFilename}`;

      fs.copyFileSync(srcPath, destPath);

      await pool.execute(
        'INSERT INTO hotel_images (hotel_id, image_path, sort_order, created_at, updated_at) VALUES (?, ?, ?, NOW(), NOW())',
        [hotelId, dbImagePath, sortOrder]
      );

      sortOrder++;
      imagesForThisHotel++;
      imagesImportedTotal++;
    }

    foldersProcessed++;
    console.log(`Attached ${imagesForThisHotel} images for "${hotelNameCandidate}" (Hotel ID: ${hotelId})`);
  }

  console.log(`\n========================================`);
  console.log(`Import Finished Successfully!`);
  console.log(`New Folders Processed: ${foldersProcessed}`);
  console.log(`New Images Imported: ${imagesImportedTotal}`);
  console.log(`========================================\n`);

  await pool.end();
}

main().catch(err => {
  console.error('Import Error:', err);
  process.exit(1);
});
