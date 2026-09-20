// Downloads real hotel image files from the live site into this local
// checkout's public/uploads/hotels/ folder, for any file a hotel_images row
// references but that doesn't exist on disk locally.
//
// This does NOT touch the database — it only fills in local files so the
// admin panel can actually render images that already exist in production.
// Production itself is untouched and was never missing anything.
//
// Usage (from backend/):
//   node src/scripts/sync-hotel-images-from-live.js

const fs = require('fs');
const path = require('path');
const https = require('https');
const mysql = require('mysql2/promise');
require('dotenv').config({ path: path.resolve(__dirname, '../../.env') });

const LIVE_BASE = 'https://mandarinworldwidevacations.com';
const UPLOAD_DIR = path.resolve(__dirname, '../../public/uploads/hotels');
const CONCURRENCY = 8;

function download(url, destPath) {
  return new Promise((resolve, reject) => {
    https.get(url, (res) => {
      if (res.statusCode !== 200) {
        res.resume();
        return resolve({ ok: false, status: res.statusCode });
      }
      const file = fs.createWriteStream(destPath);
      res.pipe(file);
      file.on('finish', () => file.close(() => resolve({ ok: true })));
      file.on('error', (err) => reject(err));
    }).on('error', reject);
  });
}

async function main() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: parseInt(process.env.DB_PORT || '3306', 10),
  });
  console.log('Connected to database');

  const [rows] = await connection.execute(
    "SELECT DISTINCT image_path FROM hotel_images WHERE image_path LIKE '/uploads/hotels/%'"
  );
  await connection.end();

  fs.mkdirSync(UPLOAD_DIR, { recursive: true });

  const toFetch = rows
    .map((r) => r.image_path)
    .filter((p) => !fs.existsSync(path.join(UPLOAD_DIR, path.basename(p))));

  console.log(`Total distinct local-path images referenced: ${rows.length}`);
  console.log(`Missing locally, will attempt download: ${toFetch.length}`);

  let done = 0;
  let ok = 0;
  const failures = [];

  async function worker(queue) {
    while (queue.length) {
      const imagePath = queue.pop();
      const filename = path.basename(imagePath);
      const destPath = path.join(UPLOAD_DIR, filename);
      const url = LIVE_BASE + imagePath;
      try {
        const result = await download(url, destPath);
        if (result.ok) {
          ok += 1;
        } else {
          failures.push({ imagePath, status: result.status });
          fs.existsSync(destPath) && fs.unlinkSync(destPath);
        }
      } catch (err) {
        failures.push({ imagePath, error: err.message });
      }
      done += 1;
      if (done % 100 === 0 || done === toFetch.length) {
        console.log(`Progress: ${done}/${toFetch.length}`);
      }
    }
  }

  const queue = [...toFetch];
  await Promise.all(Array.from({ length: CONCURRENCY }, () => worker(queue)));

  console.log('\n--- Summary ---');
  console.log(`Downloaded successfully: ${ok}`);
  console.log(`Failed: ${failures.length}`);
  if (failures.length > 0) {
    console.log('First 20 failures:', JSON.stringify(failures.slice(0, 20), null, 2));
  }
}

main().catch((err) => {
  console.error('Sync failed:', err);
  process.exit(1);
});
