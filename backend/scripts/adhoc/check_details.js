const mysql = require('../backend/node_modules/mysql2/promise');
const path = require('path');
require('../backend/node_modules/dotenv').config({ path: path.resolve(__dirname, '../backend/.env') });

async function checkDetails() {
  const conn = await mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: parseInt(process.env.DB_PORT || '3306', 10),
  });

  const [hotels] = await conn.query(`
    SELECT h.hotel_id, h.hotel_code, h.hotel_name, l.location_name, COUNT(i.image_id) as img_count
    FROM hotels h
    LEFT JOIN locations l ON h.location_id = l.location_id
    LEFT JOIN hotel_images i ON h.hotel_id = i.hotel_id
    GROUP BY h.hotel_id
    HAVING img_count = 0
  `);

  console.log('Hotels with 0 images in DB:', hotels);

  // Check if Hyatt Regency Thrissur exists elsewhere
  const [hyatt] = await conn.query("SELECT hotel_id, hotel_code, hotel_name FROM hotels WHERE hotel_name LIKE '%Hyatt%' OR hotel_name LIKE '%Thrissur%'");
  console.log('Hyatt/Thrissur hotels:', hyatt);

  await conn.end();
}

checkDetails().catch(console.error);
