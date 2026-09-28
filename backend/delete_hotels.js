const mysql = require('mysql2/promise');
require('dotenv').config();

const codesToDelete = [
  'AYO01', 'BAN01', 'BAN02', 'BHU01', 'BIK01', 'COI01', 'COO01',
  'DAL01', 'GEO01', 'IND01', 'JMK01', 'KAN01', 'KNH01', 'KAS01',
  'KHA01', 'KOS01', 'KUF01', 'KUM01', 'LAN01', 'LON01', 'MAH01',
  'MOG01', 'MOH01', 'PAN01', 'PAN02', 'PAR01', 'THR01', 'USA01',
  'VAR01', 'VRI01', 'ZIR01'
];

async function main() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: parseInt(process.env.DB_PORT || '3306', 10),
  });

  try {
    // Delete related images first just in case there's no cascade
    const [hotels] = await connection.query(
      `SELECT hotel_id FROM hotels WHERE hotel_code IN (?)`,
      [codesToDelete]
    );
    
    if (hotels.length > 0) {
      const hotelIds = hotels.map(h => h.hotel_id);
      
      console.log(`Deleting related images for ${hotelIds.length} hotels...`);
      await connection.query(
        `DELETE FROM hotel_images WHERE hotel_id IN (?)`,
        [hotelIds]
      );
      
      console.log(`Deleting ${codesToDelete.length} hotels...`);
      const [result] = await connection.query(
        `DELETE FROM hotels WHERE hotel_code IN (?)`,
        [codesToDelete]
      );
      console.log(`Successfully deleted ${result.affectedRows} hotels.`);
    } else {
      console.log('No matching hotels found to delete.');
    }

  } catch (err) {
    console.error('Error during deletion:', err);
  } finally {
    await connection.end();
  }
}

main().catch(console.error);
