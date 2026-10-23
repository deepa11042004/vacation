const mysql = require(require('path').resolve(__dirname, '../backend/node_modules/mysql2/promise'));
const fs = require('fs');
const path = require('path');
require(path.resolve(__dirname, '../backend/node_modules/dotenv')).config({ path: path.resolve(__dirname, '../backend/.env') });

async function run() {
  const connection = await mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    port: parseInt(process.env.DB_PORT || '3306', 10),
  });

  const csvContent = fs.readFileSync('c:/Projects/vacation/New_Hotels_Import.csv', 'utf8');
  const lines = csvContent.trim().split('\n');
  
  const matches = [];

  for (let i = 1; i < lines.length; i++) {
    if (!lines[i].trim()) continue;
    const parts = lines[i].split(',');
    let name = parts[0].trim();
    if (name.startsWith('"') && name.endsWith('"')) name = name.slice(1, -1);
    
    // Extract key search term (e.g. first 2 words)
    const keywords = name.split(' ').filter(w => w.length > 3).slice(0, 2);
    if (keywords.length > 0) {
      const pattern = `%${keywords.join('%')}%`;
      const [rows] = await connection.execute(
        'SELECT hotel_id, hotel_name FROM hotels WHERE hotel_name LIKE ?',
        [pattern]
      );
      if (rows.length > 0) {
        matches.push({ csvName: name, dbMatches: rows });
      }
    }
  }

  console.log(`Fuzzy matched hotels count: ${matches.length}`);
  matches.forEach(m => {
    console.log(`CSV: "${m.csvName}" -> DB:`, m.dbMatches);
  });

  await connection.end();
}

run().catch(console.error);
