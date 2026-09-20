// Trims every hotel down to exactly TARGET_COUNT images: for any hotel with
// more, keeps the lowest sort_order images and deletes the rest.
//
// This DELETES real hotel_images rows (often real photos, not placeholders).
// Before deleting anything, it writes a backup JSON of every row it removes
// to backend/trimmed-hotel-images-backup.json, so it can be restored if needed.
//
// Usage (from backend/):
//   node src/scripts/trim-hotel-images-to-4.js          (dry run)
//   node src/scripts/trim-hotel-images-to-4.js --apply  (writes to DB)

const fs = require('fs');
const path = require('path');
const mysql = require('mysql2/promise');
require('dotenv').config({ path: path.resolve(__dirname, '../../.env') });

const TARGET_COUNT = 4;
const BACKUP_PATH = path.resolve(__dirname, '../../trimmed-hotel-images-backup.json');

async function main() {
  const apply = process.argv.includes('--apply');

  const connection = await mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: parseInt(process.env.DB_PORT || '3306', 10),
  });
  console.log(`Connected to database${apply ? '' : ' (DRY RUN — no rows will be deleted)'}`);

  const [hotelIds] = await connection.query(`
    SELECT hotel_id FROM hotel_images GROUP BY hotel_id HAVING COUNT(*) > ?
  `, [TARGET_COUNT]);

  console.log(`Hotels with more than ${TARGET_COUNT} images: ${hotelIds.length}`);

  const toDelete = [];
  for (const { hotel_id } of hotelIds) {
    const [images] = await connection.execute(
      'SELECT image_id, hotel_id, image_path, sort_order FROM hotel_images WHERE hotel_id = ? ORDER BY sort_order ASC, image_id ASC',
      [hotel_id]
    );
    const excess = images.slice(TARGET_COUNT);
    toDelete.push(...excess);
  }

  console.log(`Total images to delete: ${toDelete.length}`);
  fs.writeFileSync(BACKUP_PATH, JSON.stringify(toDelete, null, 2));
  console.log(`Backup of rows to delete written to ${BACKUP_PATH}`);

  if (apply && toDelete.length > 0) {
    const ids = toDelete.map((r) => r.image_id);
    const placeholders = ids.map(() => '?').join(',');
    const [result] = await connection.execute(
      `DELETE FROM hotel_images WHERE image_id IN (${placeholders})`,
      ids
    );
    console.log(`Deleted rows: ${result.affectedRows}`);
  }

  await connection.end();

  if (!apply) {
    console.log('\nThis was a dry run. Re-run with --apply to actually delete these rows.');
  }
}

main().catch((err) => {
  console.error('Failed:', err);
  process.exit(1);
});
