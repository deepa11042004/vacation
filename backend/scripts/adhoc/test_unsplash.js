const mysql = require('../backend/node_modules/mysql2/promise');
const fs = require('fs');
const path = require('path');
require('../backend/node_modules/dotenv').config({ path: path.resolve(__dirname, '../backend/.env') });

async function checkUnsplash() {
  const conn = await mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: parseInt(process.env.DB_PORT || '3306', 10),
  });

  const [images] = await conn.query('SELECT image_id, hotel_id, image_path FROM hotel_images WHERE image_path LIKE "http%"');
  console.log('Total HTTP images:', images.length);

  const distinctUrls = [...new Set(images.map(i => i.image_path))];
  console.log('Distinct HTTP URLs:', distinctUrls.length);
  distinctUrls.forEach((u, i) => console.log(`${i + 1}: ${u}`));

  await conn.end();
}

checkUnsplash().catch(console.error);
