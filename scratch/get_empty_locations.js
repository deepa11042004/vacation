const mysql = require(require('path').resolve(__dirname, '../backend/node_modules/mysql2/promise'));
require(require('path').resolve(__dirname, '../backend/node_modules/dotenv')).config({ path: require('path').resolve(__dirname, '../backend/.env') });

async function getEmptyLocations() {
  const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: parseInt(process.env.DB_PORT || '3306', 10),
  });

  const query = `
    SELECT l.location_id, l.location_code, l.location_name, l.country, l.type
    FROM locations l
    LEFT JOIN hotels h ON l.location_id = h.location_id AND h.deleted_at IS NULL
    WHERE h.hotel_id IS NULL AND l.deleted_at IS NULL
    ORDER BY l.country, l.location_name;
  `;

  const [rows] = await pool.query(query);

  console.log(`Found ${rows.length} locations without any hotel.\n`);

  const domestic = rows.filter(r => r.country.toLowerCase() === 'india' || r.type === 'DOMESTIC');
  const international = rows.filter(r => r.country.toLowerCase() !== 'india' && r.type !== 'DOMESTIC');

  console.log(`--- Domestic / National Locations (${domestic.length}) ---`);
  domestic.forEach(d => console.log(`[ID: ${d.location_id}] ${d.location_name} (${d.location_code}) - ${d.country}`));

  console.log(`\n--- International Locations (${international.length}) ---`);
  international.forEach(i => console.log(`[ID: ${i.location_id}] ${i.location_name} (${i.location_code}) - ${i.country}`));

  await pool.end();
}

getEmptyLocations().catch(console.error);
