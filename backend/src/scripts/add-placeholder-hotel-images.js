// Fills hotels that have fewer than IMAGES_PER_HOTEL_TARGET images with generic, properly-licensed
// placeholder photos (Unsplash License — free for commercial use), reusing
// the exact same photo pool already live elsewhere in this app (hotel/location
// fallbacks in frontend/lib/imageUrl.ts and the itinerary gallery seed), so
// every URL here is already verified working in production.
//
// This is a stopgap until real photos are supplied per hotel by the partner
// property (see bulk-import-hotel-images.js for that workflow) — these are
// NOT actual photos of the hotels, just placeholders so the gallery UI has
// something to show.
//
// Usage (from backend/):
//   node src/scripts/add-placeholder-hotel-images.js          (dry run)
//   node src/scripts/add-placeholder-hotel-images.js --apply  (writes to DB)

const path = require('path');
const mysql = require('mysql2/promise');
require('dotenv').config({ path: path.resolve(__dirname, '../../.env') });

const MAX_IMAGES_PER_HOTEL = 6;
const IMAGES_PER_HOTEL_TARGET = 4;

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

// Deterministic pick so re-running (e.g. after adding more hotels) is stable.
function pickDistinct(seed, count) {
  let hash = 0;
  const key = String(seed);
  for (let i = 0; i < key.length; i++) hash = (hash * 31 + key.charCodeAt(i)) >>> 0;
  const start = hash % PLACEHOLDER_POOL.length;
  const picked = [];
  for (let i = 0; i < count; i++) {
    picked.push(PLACEHOLDER_POOL[(start + i) % PLACEHOLDER_POOL.length]);
  }
  return picked;
}

async function main() {
  const apply = process.argv.includes('--apply');

  const connection = await mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: parseInt(process.env.DB_PORT || '3306', 10),
  });
  console.log(`Connected to database${apply ? '' : ' (DRY RUN — no rows will be written)'}`);

  const [hotels] = await connection.execute('SELECT hotel_id, hotel_code FROM hotels');

  let hotelsUpdated = 0;
  let imagesAdded = 0;
  let hotelsAlreadyFull = 0;
  let hotelsAlreadyHadEnough = 0;

  for (const hotel of hotels) {
    const [countRows] = await connection.execute(
      'SELECT COUNT(*) as cnt, COALESCE(MAX(sort_order), -1) as maxSort FROM hotel_images WHERE hotel_id = ?',
      [hotel.hotel_id]
    );
    const currentCount = countRows[0].cnt;
    let nextSort = countRows[0].maxSort + 1;

    if (currentCount >= IMAGES_PER_HOTEL_TARGET) {
      hotelsAlreadyHadEnough += 1;
      continue;
    }
    if (currentCount >= MAX_IMAGES_PER_HOTEL) {
      hotelsAlreadyFull += 1;
      continue;
    }

    const need = Math.min(IMAGES_PER_HOTEL_TARGET - currentCount, MAX_IMAGES_PER_HOTEL - currentCount);
    const urls = pickDistinct(hotel.hotel_id, need);

    for (const url of urls) {
      if (apply) {
        await connection.execute(
          'INSERT INTO hotel_images (hotel_id, image_path, sort_order, created_at, updated_at) VALUES (?, ?, ?, NOW(), NOW())',
          [hotel.hotel_id, url, nextSort]
        );
      }
      nextSort += 1;
      imagesAdded += 1;
    }
    hotelsUpdated += 1;
  }

  await connection.end();

  console.log('\n--- Summary ---');
  console.log(`Hotels updated: ${hotelsUpdated}`);
  console.log(`Placeholder images ${apply ? 'added' : 'that would be added'}: ${imagesAdded}`);
  console.log(`Hotels already had ${IMAGES_PER_HOTEL_TARGET}+ images (untouched): ${hotelsAlreadyHadEnough}`);
  if (hotelsAlreadyFull > 0) {
    console.log(`Hotels already at the ${MAX_IMAGES_PER_HOTEL}-image cap (untouched): ${hotelsAlreadyFull}`);
  }
  if (!apply) {
    console.log('\nThis was a dry run. Re-run with --apply to actually write these rows.');
  }
}

main().catch((err) => {
  console.error('Failed:', err);
  process.exit(1);
});
