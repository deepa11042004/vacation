import { Transaction } from 'sequelize';
import { Booking } from '../models/Booking.model';
import { IBooking } from '../interfaces/booking.interface';

export class BookingRepository {
  async findByClientId(client_id: number): Promise<Booking[]> {
    return Booking.findAll({
      where: { client_id },
      order: [['check_in', 'DESC']],
    });
  }

  async findById(booking_id: number): Promise<Booking | null> {
    return Booking.findByPk(booking_id);
  }

  async create(data: Partial<IBooking>, transaction?: Transaction): Promise<Booking> {
    return Booking.create(data, { transaction });
  }

  async update(booking_id: number, data: Partial<IBooking>, transaction?: Transaction): Promise<void> {
    await Booking.update(data, { where: { booking_id }, transaction });
  }

  async delete(booking_id: number): Promise<void> {
    await Booking.destroy({ where: { booking_id } });
  }
}
