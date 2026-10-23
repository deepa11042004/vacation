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

  try {
    const [lCols] = await connection.execute('SHOW COLUMNS FROM locations');
    const locNameCol = lCols.some(c => c.Field === 'location_name') ? 'location_name' : (lCols.some(c => c.Field === 'name') ? 'name' : 'location_id');

    const query = `
      SELECT l.${locNameCol} as location_name, l.country 
      FROM locations l 
      LEFT JOIN hotels h ON l.location_id = h.location_id 
      WHERE h.location_id IS NULL
      ORDER BY l.country, l.${locNameCol}
    `;

    const [results] = await connection.execute(query);

    const national = [];
    const international = [];

    results.forEach(row => {
      if (row.country && row.country.toLowerCase() === 'india') {
        national.push(row.location_name);
      } else {
        international.push(`${row.location_name} (${row.country})`);
      }
    });

    console.log(`=== Locations with NO HOTELS (${results.length} total) ===`);
    
    if (national.length > 0) {
      console.log(`\nNational (India):`);
      national.forEach(n => console.log(`- ${n}`));
    }

    if (international.length > 0) {
      console.log(`\nInternational:`);
      international.forEach(i => console.log(`- ${i}`));
    }
    
    if (results.length === 0) {
      console.log('\nAll locations have at least one hotel associated with them!');
    }

  } catch (err) {
    console.error('Error:', err);
  } finally {
    await connection.end();
  }
}

main().catch(console.error);
