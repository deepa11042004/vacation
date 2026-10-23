const mysql = require('../backend/node_modules/mysql2/promise');
const path = require('path');
require('../backend/node_modules/dotenv').config({ path: path.resolve(__dirname, '../backend/.env') });

async function checkHotelsImagesCoverage() {
  const conn = await mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: parseInt(process.env.DB_PORT || '3306', 10),
  });

  const [hotels] = await conn.query(`
    SELECT h.hotel_id, h.hotel_code, h.hotel_name, COUNT(i.image_id) as img_count
    FROM hotels h
    LEFT JOIN hotel_images i ON h.hotel_id = i.hotel_id
    GROUP BY h.hotel_id
    ORDER BY img_count ASC
  `);

  console.log('Total hotels:', hotels.length);
  const withoutImages = hotels.filter(h => h.img_count === 0);
  console.log('Hotels with 0 images:', withoutImages.length);
  if (withoutImages.length > 0) {
    console.log('Sample without images:', withoutImages.slice(0, 10));
  }

  const counts = {};
  for (const h of hotels) {
    counts[h.img_count] = (counts[h.img_count] || 0) + 1;
  }
  console.log('Image count distribution across hotels:', counts);

  await conn.end();
}

checkHotelsImagesCoverage().catch(console.error);
