const mysql = require(require('path').resolve(__dirname, '../backend/node_modules/mysql2/promise'));
require(require('path').resolve(__dirname, '../backend/node_modules/dotenv')).config({ path: require('path').resolve(__dirname, '../backend/.env') });

async function checkAll() {
  const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: parseInt(process.env.DB_PORT || '3306', 10),
  });

  const [locs] = await pool.query('SELECT COUNT(*) as cnt FROM locations WHERE deleted_at IS NULL');
  console.log('Total locations in DB:', locs[0].cnt);

  const [lowestLocs] = await pool.query(`
    SELECT l.location_id, l.location_code, l.location_name, l.country, COUNT(h.hotel_id) as hotel_count
    FROM locations l
    LEFT JOIN hotels h ON l.location_id = h.location_id AND h.deleted_at IS NULL
    WHERE l.deleted_at IS NULL
    GROUP BY l.location_id, l.location_code, l.location_name, l.country
    ORDER BY hotel_count ASC
    LIMIT 25
  `);

  console.log('\n--- Locations with Fewest Hotels ---');
  lowestLocs.forEach(l => {
    console.log(`[ID: ${l.location_id}] ${l.location_name} (${l.location_code}) - ${l.country}: ${l.hotel_count} hotel(s)`);
  });

  // Also check Ayodhya specifically
  const [ayodhya] = await pool.query(`
    SELECT l.location_id, l.location_name, COUNT(h.hotel_id) as hotel_count
    FROM locations l
    LEFT JOIN hotels h ON l.location_id = h.location_id AND h.deleted_at IS NULL
    WHERE l.location_name = 'Ayodhya'
    GROUP BY l.location_id, l.location_name
  `);
  console.log('Ayodhya status:', ayodhya);

  await pool.end();
}

checkAll().catch(console.error);
