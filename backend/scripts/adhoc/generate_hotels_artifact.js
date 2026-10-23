const fs = require('fs');
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
    // Detect column names safely
    const [hCols] = await connection.execute('SHOW COLUMNS FROM hotels');
    const hotelNameCol = hCols.some(c => c.Field === 'hotel_name') ? 'hotel_name' : (hCols.some(c => c.Field === 'name') ? 'name' : 'hotel_code');
    const hasLocationId = hCols.some(c => c.Field === 'location_id');

    const [lCols] = await connection.execute('SHOW COLUMNS FROM locations');
    const locNameCol = lCols.some(c => c.Field === 'location_name') ? 'location_name' : (lCols.some(c => c.Field === 'name') ? 'name' : 'location_id');

    let query = '';
    if (hasLocationId) {
      query = `
        SELECT h.${hotelNameCol} as hotel_name, h.hotel_code, l.${locNameCol} as location_name, l.country 
        FROM hotels h 
        LEFT JOIN locations l ON h.location_id = l.location_id
        ORDER BY l.country, l.${locNameCol}, h.${hotelNameCol}
      `;
    } else {
      console.log('Error: No location_id found in hotels table.');
      process.exit(1);
    }

    const [results] = await connection.execute(query);

    const national = [];
    const international = [];

    results.forEach(row => {
      const loc = row.location_name || 'Unknown Location';
      const c = row.country || 'Unknown Country';
      const name = row.hotel_name || row.hotel_code;
      
      const item = `- **${name}** (${loc})`;
      
      if (c.toLowerCase() === 'india') {
        national.push(item);
      } else {
        international.push(`${item} - *${c}*`);
      }
    });

    let md = '# Hotels and Locations\n\n';
    
    md += `## National Hotels (India) - Total: ${national.length}\n`;
    md += national.join('\n') + '\n\n';
    
    md += `## International Hotels - Total: ${international.length}\n`;
    md += international.join('\n') + '\n';

    fs.writeFileSync('C:/Users/ADMIN/.gemini/antigravity-ide/brain/b0b91eee-9d2c-4a8f-aa94-8b250c0fb634/hotels_by_location.md', md);
    console.log('Artifact created successfully.');
  } catch (err) {
    console.error('Error:', err);
  } finally {
    await connection.end();
  }
}

main().catch(console.error);
