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
    const [locations] = await connection.query(`SELECT * FROM locations`);
    
    // Categorize by country
    // Let's assume national means 'India'
    const national = [];
    const international = [];

    locations.forEach(loc => {
      if (loc.country && loc.country.toLowerCase() === 'india') {
        national.push(loc);
      } else {
        international.push(loc);
      }
    });

    console.log('=== NATIONAL LOCATIONS (India) ===');
    national.forEach(loc => console.log(`- ${loc.name || loc.location_name} (ID: ${loc.location_id})`));
    
    console.log('\n=== INTERNATIONAL LOCATIONS ===');
    international.forEach(loc => console.log(`- ${loc.name || loc.location_name} (ID: ${loc.location_id}) [${loc.country}]`));

  } catch (err) {
    console.error('Error querying locations:', err);
  } finally {
    await connection.end();
  }
}

main().catch(console.error);
