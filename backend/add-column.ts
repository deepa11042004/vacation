require('dotenv').config({ path: __dirname + '/.env' });
import { connectDB, sequelize } from './src/shared/database/sequelize';

async function run() {
  await connectDB();
  try {
    await sequelize.query('ALTER TABLE clients ADD COLUMN is_welcome_mail_sent BOOLEAN DEFAULT FALSE;');
    console.log('Column added successfully.');
  } catch (e: any) {
    if (e.message.includes('Duplicate column name')) {
      console.log('Column already exists.');
    } else {
      console.error(e);
    }
  }
  process.exit(0);
}

run();
