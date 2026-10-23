const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
require('dotenv').config({ path: path.resolve(__dirname, '../../.env') });

function sanitizeFilename(name) {
  if (!name) return 'Unknown';
  return name.replace(/[<>:"/\\|?*\x00-\x1F]/g, '_').trim();
}

async function main() {
  const stagingDir = path.resolve('c:/Projects/vacation/scratch/all_hotels_images_staging');
  const zipFile = path.resolve('c:/Projects/vacation/all_hotels_images.zip');
  const feUploads = path.resolve('c:/Projects/vacation/frontend/public/uploads/hotels');
  const beUploads = path.resolve('c:/Projects/vacation/backend/public/uploads/hotels');
  const unsplashCache = path.resolve('c:/Projects/vacation/scratch/unsplash_cache');

  // Clean staging directory
  if (fs.existsSync(stagingDir)) {
    console.log('Cleaning previous staging directory...');
    fs.rmSync(stagingDir, { recursive: true, force: true });
  }
  fs.mkdirSync(stagingDir, { recursive: true });

  const connection = await mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: parseInt(process.env.DB_PORT || '3306', 10),
  });

  console.log('Connected to DB');

  const [hotels] = await connection.query(`
    SELECT h.hotel_id, h.hotel_code, h.hotel_name, l.location_name
    FROM hotels h
    LEFT JOIN locations l ON h.location_id = l.location_id
    ORDER BY h.hotel_id ASC
  `);

  console.log(`Found ${hotels.length} hotels in database.`);

  const [images] = await connection.query(`
    SELECT image_id, hotel_id, image_path, sort_order
    FROM hotel_images
    ORDER BY hotel_id ASC, sort_order ASC, image_id ASC
  `);

  const imagesByHotel = new Map();
  for (const img of images) {
    if (!imagesByHotel.has(img.hotel_id)) {
      imagesByHotel.set(img.hotel_id, []);
    }
    imagesByHotel.get(img.hotel_id).push(img);
  }

  let totalCopied = 0;
  let totalMissing = 0;
  let hotelsWithImages = 0;

  for (const h of hotels) {
    const hotelImages = imagesByHotel.get(h.hotel_id) || [];
    if (hotelImages.length === 0) continue;
    hotelsWithImages++;

    const safeCode = sanitizeFilename(h.hotel_code || `H${h.hotel_id}`);
    const safeName = sanitizeFilename(h.hotel_name || 'Hotel');
    const safeLoc = sanitizeFilename(h.location_name || '');
    const folderName = safeLoc ? `${safeCode} - ${safeName} (${safeLoc})` : `${safeCode} - ${safeName}`;
    const hotelDir = path.join(stagingDir, folderName);
    fs.mkdirSync(hotelDir, { recursive: true });

    hotelImages.forEach((img, idx) => {
      let sourcePath = null;
      let targetName = null;

      if (img.image_path.startsWith('/uploads/hotels/')) {
        const fname = path.basename(img.image_path);
        const feCandidate = path.join(feUploads, fname);
        const beCandidate = path.join(beUploads, fname);
        if (fs.existsSync(feCandidate)) {
          sourcePath = feCandidate;
        } else if (fs.existsSync(beCandidate)) {
          sourcePath = beCandidate;
        }
        targetName = `${idx + 1}_${fname}`;
      } else if (img.image_path.startsWith('http')) {
        const match = img.image_path.match(/photo-([a-zA-Z0-9-]+)/);
        const base = match ? match[1] + '.jpg' : `external_${img.image_id}.jpg`;
        const cachePath = path.join(unsplashCache, base);
        if (fs.existsSync(cachePath)) {
          sourcePath = cachePath;
          targetName = `${idx + 1}_${base}`;
        }
      }

      if (sourcePath && fs.existsSync(sourcePath)) {
        const dest = path.join(hotelDir, targetName);
        fs.copyFileSync(sourcePath, dest);
        totalCopied++;
      } else {
        totalMissing++;
        console.warn(`Missing image for hotel ${h.hotel_id} (${h.hotel_code}): ${img.image_path}`);
      }
    });
  }

  console.log(`Copied ${totalCopied} images across ${hotelsWithImages} hotels. Missing: ${totalMissing}`);
  await connection.end();

  // Create zip file using Windows tar.exe (fast and standard)
  if (fs.existsSync(zipFile)) {
    fs.unlinkSync(zipFile);
  }

  console.log(`Creating zip file at ${zipFile}...`);
  execSync(`tar -a -c -f "${zipFile}" *`, { cwd: stagingDir, stdio: 'inherit' });

  const stats = fs.statSync(zipFile);
  console.log(`Zip file created successfully! Size: ${(stats.size / (1024 * 1024)).toFixed(2)} MB`);
}

main().catch(err => {
  console.error('Packaging failed:', err);
  process.exit(1);
});
