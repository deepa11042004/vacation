const mysql = require('mysql2/promise');
require('dotenv').config({ path: 'c:/Projects/vacation/backend/.env' });

async function main() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || 'password',
    database: process.env.DB_NAME || 'travel_crm',
    port: parseInt(process.env.DB_PORT || '3306', 10)
  });

  console.log('Connected to DB');

  // 1. Delete rows in hotel_images with invalid image paths (missing extension or invalid format)
  const [delRes] = await connection.execute(`
    DELETE FROM hotel_images 
    WHERE image_path NOT LIKE '%.jpg%' 
      AND image_path NOT LIKE '%.jpeg%' 
      AND image_path NOT LIKE '%.png%' 
      AND image_path NOT LIKE '%.webp%' 
      AND image_path NOT LIKE '%.avif%' 
      AND image_path NOT LIKE '%.gif%'
  `);
  console.log(`Deleted ${delRes.affectedRows} invalid hotel_images rows.`);

  // 2. Delete duplicate image_path for the same hotel_id
  const [dedupRes] = await connection.execute(`
    DELETE h1 FROM hotel_images h1
    INNER JOIN hotel_images h2 
    WHERE h1.image_id > h2.image_id 
      AND h1.hotel_id = h2.hotel_id 
      AND h1.image_path = h2.image_path
  `);
  console.log(`Deleted ${dedupRes.affectedRows} duplicate hotel_images rows.`);

  // Check hotel 2182 specifically
  const [h2182] = await connection.execute('SELECT * FROM hotel_images WHERE hotel_id = 2182');
  console.log('Hotel 2182 images remaining:', h2182);

  await connection.end();
  console.log('Finished DB cleanup.');
}

main().catch(console.error);
