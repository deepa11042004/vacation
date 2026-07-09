import { Sequelize } from 'sequelize-typescript';
import { Client } from '../../modules/clients/models/Client.model';
import { ClientAddress } from '../../modules/clients/models/ClientAddress.model';
import { User } from '../../modules/users/models/User.model';
import { Location } from '../../modules/locations/models/Location.model';
import { Hotel } from '../../modules/hotels/models/Hotel.model';
import { HotelImage } from '../../modules/hotels/models/HotelImage.model';
import { Membership } from '../../modules/memberships/models/Membership.model';
import { Payment } from '../../modules/payments/models/Payment.model';
import { Invoice } from '../../modules/invoices/models/Invoice.model';
import { ClientOffer } from '../../modules/client-offers/models/ClientOffer.model';
import { Booking } from '../../modules/bookings/models/Booking.model';
import { AmcPayment } from '../../modules/amc-payments/models/AmcPayment.model';
import { CallRecording } from '../../modules/call-recordings/models/CallRecording.model';
import { KycDocument } from '../../modules/kyc-documents/models/KycDocument.model';
import { Staff } from '../../modules/staff/models/Staff.model';

const env = process.env.NODE_ENV || 'development';

export const sequelize = new Sequelize({
  database: process.env.DB_NAME || 'travel_crm',
  username: process.env.DB_USER || 'root',
  password: process.env.DB_PASSWORD || 'password',
  host: process.env.DB_HOST || 'localhost',
  port: parseInt(process.env.DB_PORT || '3306', 10),
  dialect: 'mysql',
  logging: env === 'development' ? console.log : false,
  pool: {
    max: 10,
    min: 0,
    acquire: 30000,
    idle: 10000,
  },
  dialectOptions: {
    connectTimeout: 20000,
  },
  models: [
    Client,
    ClientAddress,
    User,
    Location,
    Hotel,
    HotelImage,
    Membership,
    Payment,
    Invoice,
    ClientOffer,
    Booking,
    AmcPayment,
    CallRecording,
    KycDocument,
    Staff,
  ],
});

let dbConnected = false;

export const connectDB = async () => {
  if (dbConnected) {
    try {
      await sequelize.authenticate();
      return;
    } catch {
      dbConnected = false;
    }
  }
  try {
    await sequelize.authenticate();
    dbConnected = true;
    console.log('Database connected successfully.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
    throw error;
  }
};
