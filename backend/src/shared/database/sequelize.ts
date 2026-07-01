import { Sequelize } from 'sequelize-typescript';
import { Client } from '../../modules/clients/models/Client.model';
import { User } from '../../modules/users/models/User.model';

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
    User
  ], // Register models here
});

export const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log('Database connection has been established successfully.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
};
