// Bulk-imports real hotel photos supplied by hotel partners.
//
// Usage:
//   1. Create a folder per hotel under backend/import-images/, named by hotel_code
//      (the code shown in the admin Hotels table, e.g. H800):
//        backend/import-images/H800/lobby.jpg
//        backend/import-images/H800/room.jpg
//        backend/import-images/H800/pool.jpg
//        backend/import-images/H799/...
//   2. From backend/, run:
//        node src/scripts/bulk-import-hotel-images.js          (dry run — no changes)
//        node src/scripts/bulk-import-hotel-images.js --apply  (actually imports)
//
// Each hotel is capped at 6 images total (existing + new), matching the
// admin panel's per-hotel image limit. Extra files beyond the cap are skipped.

const fs = require('fs');
const path = require('path');
const mysql = require('mysql2/promise');
require('dotenv').config({ path: path.resolve(__dirname, '../../.env') });

const IMPORT_DIR = path.resolve(__dirname, '../../import-images');
const UPLOAD_DIR = path.resolve(__dirname, '../../public/uploads/hotels');
const VALID_EXTENSIONS = new Set(['.jpg', '.jpeg', '.png', '.webp']);
const MAX_IMAGES_PER_HOTEL = 6;

async function main() {
  const apply = process.argv.includes('--apply');

  if (!fs.existsSync(IMPORT_DIR)) {
    console.error(`Import folder not found: ${IMPORT_DIR}`);
    console.error('Create it and add one subfolder per hotel_code, each containing image files.');
    process.exit(1);
  }

  const connection = await mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: parseInt(process.env.DB_PORT || '3306', 10),
  });
  console.log(`Connected to database${apply ? '' : ' (DRY RUN — no files or rows will be written)'}`);

  const hotelCodeFolders = fs
    .readdirSync(IMPORT_DIR, { withFileTypes: true })
    .filter((d) => d.isDirectory())
    .map((d) => d.name);

  let hotelsUpdated = 0;
  let imagesImported = 0;
  let imagesSkippedCap = 0;
  const notFound = [];

  for (const hotelCode of hotelCodeFolders) {
    const folderPath = path.join(IMPORT_DIR, hotelCode);
    const files = fs
      .readdirSync(folderPath)
      .filter((f) => VALID_EXTENSIONS.has(path.extname(f).toLowerCase()))
      .sort();

    if (files.length === 0) continue;

    const [hotelRows] = await connection.execute(
      'SELECT hotel_id FROM hotels WHERE hotel_code = ?',
      [hotelCode]
    );
    if (hotelRows.length === 0) {
      notFound.push(hotelCode);
      continue;
    }
    const hotelId = hotelRows[0].hotel_id;

    const [countRows] = await connection.execute(
      'SELECT COUNT(*) as cnt, COALESCE(MAX(sort_order), -1) as maxSort FROM hotel_images WHERE hotel_id = ?',
      [hotelId]
    );
    let currentCount = countRows[0].cnt;
    let nextSort = countRows[0].maxSort + 1;

    let addedForThisHotel = 0;
    for (const file of files) {
      if (currentCount >= MAX_IMAGES_PER_HOTEL) {
        imagesSkippedCap += files.length - addedForThisHotel;
        break;
      }

      const ext = path.extname(file);
      const destFilename = `${Date.now()}_${Math.random().toString(36).slice(2, 8)}${ext}`;
      const srcPath = path.join(folderPath, file);
      const destPath = path.join(UPLOAD_DIR, destFilename);
      const imagePath = `/uploads/hotels/${destFilename}`;

      if (apply) {
        fs.mkdirSync(UPLOAD_DIR, { recursive: true });
        fs.copyFileSync(srcPath, destPath);
        await connection.execute(
          'INSERT INTO hotel_images (hotel_id, image_path, sort_order, created_at, updated_at) VALUES (?, ?, ?, NOW(), NOW())',
          [hotelId, imagePath, nextSort]
        );
      }

      console.log(`${apply ? 'Imported' : '[dry-run] Would import'}: ${hotelCode}/${file} -> ${imagePath} (sort_order ${nextSort})`);
      nextSort += 1;
      currentCount += 1;
      addedForThisHotel += 1;
      imagesImported += 1;
    }

    if (addedForThisHotel > 0) hotelsUpdated += 1;
  }

  await connection.end();

  console.log('\n--- Summary ---');
  console.log(`Hotels updated: ${hotelsUpdated}`);
  console.log(`Images imported: ${imagesImported}`);
  if (imagesSkippedCap > 0) {
    console.log(`Images skipped (hotel already at ${MAX_IMAGES_PER_HOTEL}-image cap): ${imagesSkippedCap}`);
  }
  if (notFound.length > 0) {
    console.log(`Hotel codes with no matching hotel (${notFound.length}): ${notFound.join(', ')}`);
  }
  if (!apply) {
    console.log('\nThis was a dry run. Re-run with --apply to actually copy files and write to the database.');
  }
}

main().catch((err) => {
  console.error('Import failed:', err);
  process.exit(1);
});
