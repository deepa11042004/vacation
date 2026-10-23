const mysql = require('../backend/node_modules/mysql2/promise');
const fs = require('fs');
const path = require('path');
require('../backend/node_modules/dotenv').config({ path: path.resolve(__dirname, '../backend/.env') });

async function inspect() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: parseInt(process.env.DB_PORT || '3306', 10),
  });

  const [hotels] = await connection.query('SELECT * FROM hotels');
  console.log(`Total hotels in DB: ${hotels.length}`);

  const [images] = await connection.query('SELECT * FROM hotel_images');
  console.log(`Total images in DB: ${images.length}`);

  const feUploads = path.resolve(__dirname, '../frontend/public/uploads/hotels');
  const beUploads = path.resolve(__dirname, '../backend/public/uploads/hotels');
  const unsplashCache = path.resolve(__dirname, 'unsplash_cache');
  const hotelImagesDir = path.resolve(__dirname, '../hotel_images');

  let feCount = 0;
  let beCount = 0;
  let cacheCount = 0;
  let notFound = 0;
  const missingUrls = [];

  for (const img of images) {
    let found = false;
    if (img.image_path.startsWith('/uploads/hotels/')) {
      const fname = path.basename(img.image_path);
      if (fs.existsSync(path.join(feUploads, fname))) {
        feCount++;
        found = true;
      } else if (fs.existsSync(path.join(beUploads, fname))) {
        beCount++;
        found = true;
      }
    } else if (img.image_path.startsWith('http')) {
      const match = img.image_path.match(/photo-([a-zA-Z0-9-]+)/);
      const base = match ? match[1] + '.jpg' : `external_${img.image_id}.jpg`;
      if (fs.existsSync(path.join(unsplashCache, base))) {
        cacheCount++;
        found = true;
      }
    }

    if (!found) {
      notFound++;
      missingUrls.push({ id: img.image_id, hotel_id: img.hotel_id, path: img.image_path });
    }
  }

  console.log(`Found in frontend/public: ${feCount}`);
  console.log(`Found in backend/public: ${beCount}`);
  console.log(`Found in unsplashCache: ${cacheCount}`);
  console.log(`Not found locally: ${notFound}`);
  if (missingUrls.length > 0) {
    console.log('Sample missing (up to 10):', missingUrls.slice(0, 10));
  }

  // Check how many files in frontend/public/uploads/hotels
  if (fs.existsSync(feUploads)) {
    const files = fs.readdirSync(feUploads);
    console.log(`Files in frontend/public/uploads/hotels: ${files.length}`);
  }
  // Check backend uploads
  if (fs.existsSync(beUploads)) {
    const files = fs.readdirSync(beUploads);
    console.log(`Files in backend/public/uploads/hotels: ${files.length}`);
  }

  // Also check hotel columns
  const [columns] = await connection.query('DESCRIBE hotels');
  console.log('Hotels columns:', columns.map(c => c.Field).join(', '));

  await connection.end();
}

inspect().catch(console.error);
