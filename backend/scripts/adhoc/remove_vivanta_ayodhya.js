const mysql = require(require('path').resolve(__dirname, '../backend/node_modules/mysql2/promise'));
require(require('path').resolve(__dirname, '../backend/node_modules/dotenv')).config({ path: require('path').resolve(__dirname, '../backend/.env') });

async function removeHotel() {
  const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: parseInt(process.env.DB_PORT || '3306', 10),
  });

  const [matching] = await pool.execute(
    'SELECT hotel_id, hotel_code, hotel_name, location_id FROM hotels WHERE LOWER(hotel_name) LIKE ?',
    ['%vivanta ayodhya%']
  );

  console.log('Matching hotels found:', matching);

  if (matching.length > 0) {
    const hotelIds = matching.map(h => h.hotel_id);
    const placeholders = hotelIds.map(() => '?').join(',');

    const [imgRes] = await pool.query(
      `DELETE FROM hotel_images WHERE hotel_id IN (${placeholders})`,
      hotelIds
    );
    console.log(`Deleted ${imgRes.affectedRows} image records from hotel_images.`);

    const [hotelRes] = await pool.query(
      `DELETE FROM hotels WHERE hotel_id IN (${placeholders})`,
      hotelIds
    );
    console.log(`Successfully deleted ${hotelRes.affectedRows} hotel(s) from hotels table.`);
  } else {
    console.log('No hotel named Vivanta Ayodhya found in database.');
  }

  await pool.end();
}

removeHotel().catch(console.error);
