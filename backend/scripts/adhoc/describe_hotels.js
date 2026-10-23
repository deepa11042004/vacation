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
    const [columns] = await connection.execute('DESCRIBE hotels');
    
    console.log('--- DETAILS REQUIRED TO ADD A NEW HOTEL ---');
    console.log('Columns:');
    columns.forEach(col => {
      console.log(`- ${col.Field}: Type: ${col.Type}, Nullable: ${col.Null}, Default: ${col.Default}, Extra: ${col.Extra}`);
    });
    
  } catch (err) {
    console.error('Error:', err);
  } finally {
    await connection.end();
  }
}

main().catch(console.error);
