const mysql = require('mysql2/promise');
require('dotenv').config();

async function main() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: parseInt(process.env.DB_PORT || '3306', 10),
  });

  const [columns] = await connection.execute('SHOW COLUMNS FROM hotels');
  const hasHotelName = columns.some(c => c.Field === 'hotel_name');
  const hasName = columns.some(c => c.Field === 'name');
  
  const nameColumn = hasHotelName ? 'hotel_name' : (hasName ? 'name' : 'hotel_code');

  const [hotels] = await connection.execute(`SELECT hotel_code, ${nameColumn} as hotel_name FROM hotels`);
  
  console.log('--- Hotels in Database ---');
  hotels.forEach(h => {
    console.log(`${h.hotel_code}: ${h.hotel_name}`);
  });

  await connection.end();
}

main().catch(console.error);
