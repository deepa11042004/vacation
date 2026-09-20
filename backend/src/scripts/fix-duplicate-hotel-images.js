// Fixes hotels where the same image_path appears more than once (caused by
// running the placeholder top-up script multiple times against the same
// hotel with a small "need" count each time). Replaces each duplicate row's
// image_path with an unused image from the same placeholder pool, so every
// image a hotel has is distinct. Real (non-placeholder) images are never
// affected since duplicates only ever occurred among placeholder URLs.
//
// Usage (from backend/):
//   node src/scripts/fix-duplicate-hotel-images.js          (dry run)
//   node src/scripts/fix-duplicate-hotel-images.js --apply  (writes to DB)

const path = require('path');
const mysql = require('mysql2/promise');
require('dotenv').config({ path: path.resolve(__dirname, '../../.env') });

const PLACEHOLDER_POOL = [
  'https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1541971875076-8f970d573be6?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1576013551627-0cc20b96c2a7?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1571536802807-30451e3955d8?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1499793983690-e29da59ef1c2?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1533692328991-08159ff19fca?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1552465011-b4e21bf6e79a?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=1200&q=80',
  'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?auto=format&fit=crop&w=1200&q=80',
];

async function main() {
  const apply = process.argv.includes('--apply');

  const connection = await mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: parseInt(process.env.DB_PORT || '3306', 10),
  });
  console.log(`Connected to database${apply ? '' : ' (DRY RUN — no rows will be changed)'}`);

  const [dupHotels] = await connection.query(`
    SELECT DISTINCT hotel_id FROM (
      SELECT hotel_id, image_path, COUNT(*) as cnt
      FROM hotel_images GROUP BY hotel_id, image_path HAVING cnt > 1
    ) t
  `);
  console.log(`Hotels with duplicated images: ${dupHotels.length}`);

  let rowsFixed = 0;

  for (const { hotel_id } of dupHotels) {
    const [images] = await connection.execute(
      'SELECT image_id, image_path, sort_order FROM hotel_images WHERE hotel_id = ? ORDER BY sort_order ASC, image_id ASC',
      [hotel_id]
    );

    const seen = new Set();
    for (const img of images) {
      if (!seen.has(img.image_path)) {
        seen.add(img.image_path);
        continue;
      }
      // duplicate — pick an unused pool image for this hotel
      const replacement = PLACEHOLDER_POOL.find((url) => !seen.has(url));
      if (!replacement) {
        console.warn(`  hotel ${hotel_id}: ran out of unused pool images, skipping image_id ${img.image_id}`);
        continue;
      }
      seen.add(replacement);
      console.log(`${apply ? 'Fixing' : '[dry-run] Would fix'}: hotel ${hotel_id}, image_id ${img.image_id} -> ${replacement}`);
      if (apply) {
        await connection.execute('UPDATE hotel_images SET image_path = ?, updated_at = NOW() WHERE image_id = ?', [
          replacement,
          img.image_id,
        ]);
      }
      rowsFixed += 1;
    }
  }

  await connection.end();

  console.log('\n--- Summary ---');
  console.log(`Rows ${apply ? 'fixed' : 'that would be fixed'}: ${rowsFixed}`);
  if (!apply) {
    console.log('\nThis was a dry run. Re-run with --apply to actually write these changes.');
  }
}

main().catch((err) => {
  console.error('Failed:', err);
  process.exit(1);
});
