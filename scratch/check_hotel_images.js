const mysql = require(require('path').resolve(__dirname, '../backend/node_modules/mysql2/promise'));
const fs = require('fs');
const path = require('path');
require(path.resolve(__dirname, '../backend/node_modules/dotenv')).config({ path: path.resolve(__dirname, '../backend/.env') });

async function run() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: parseInt(process.env.DB_PORT || '3306', 10),
  });

  const [imgCols] = await connection.execute('SHOW COLUMNS FROM hotel_images');
  console.log('HOTEL_IMAGES COLUMNS:', imgCols.map(c => ({ field: c.Field, type: c.Type })));

  const csvContent = fs.readFileSync('c:/Projects/vacation/New_Hotels_Import.csv', 'utf8');
  const lines = csvContent.trim().split('\n');
  const hotelNames = [];
  for (let i = 1; i < lines.length; i++) {
    if (!lines[i].trim()) continue;
    const parts = lines[i].split(',');
    let name = parts[0].trim();
    if (name.startsWith('"') && name.endsWith('"')) name = name.slice(1, -1);
    hotelNames.push(name);
  }

  const placeholders = hotelNames.map(() => '?').join(',');
  const [existingHotels] = await connection.execute(
    `SELECT hotel_id, hotel_name FROM hotels WHERE hotel_name IN (${placeholders})`,
    hotelNames
  );

  console.log(`Hotels found in DB: ${existingHotels.length} out of ${hotelNames.length}`);
  if (existingHotels.length > 0) {
    console.log('Existing hotel details:', existingHotels);
    const hotelIds = existingHotels.map(h => h.hotel_id);
    const idPlaceholders = hotelIds.map(() => '?').join(',');
    const [images] = await connection.execute(
      `SELECT * FROM hotel_images WHERE hotel_id IN (${idPlaceholders})`,
      hotelIds
    );
    console.log(`Images found for these matched hotels:`, images);
  }

  const [totalImages] = await connection.execute('SELECT COUNT(*) as cnt FROM hotel_images');
  console.log(`Total images in hotel_images table across entire DB: ${totalImages[0].cnt}`);

  await connection.end();
}

run().catch(console.error);
