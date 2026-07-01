import { Sequelize } from 'sequelize-typescript';
import { Client } from '../../modules/clients/models/Client.model';
import { User } from '../../modules/users/models/User.model';
import { Package } from '../../modules/packages/models/Package.model';

const env = process.env.NODE_ENV || 'development';

export const sequelize = new Sequelize({
  database: process.env.DB_NAME || 'travel_crm',
  username: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || 'password',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '3306', 10),
  dialect: 'mysql',
  logging: env === 'development' ? console.log : false,
  models: [
    Client,
    User,
    Package,
  ],
});

let dbConnected = false;

export const connectDB = async () => {
  if (dbConnected) return;
  try {
    await sequelize.authenticate();
    dbConnected = true;
    console.log('Database connection has been established successfully.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
    throw error;
  }
};
