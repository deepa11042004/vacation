import { sequelize } from '../../../shared/database/sequelize';
import { BookingRepository } from '../repositories/booking.repository';
import { Booking } from '../models/Booking.model';
import { IBooking, NightType, BookingStatus } from '../interfaces/booking.interface';
import { Membership } from '../../memberships/models/Membership.model';
import { ClientOffer } from '../../client-offers/models/ClientOffer.model';
import { AppError } from '../../../shared/middlewares/error.middleware';

export interface CreateBookingInput {
  membership_id: number;
  assist_by?: string | null;
  contact_number?: string | null;
  check_in: string;
  check_out: string;
  nights: number;
  no_of_rooms: number;
  no_of_adults: number;
  children: number;
  booking_type?: string | null;
  hotel_name: string;
  hotel_address?: string | null;
  hotel_contact?: string | null;
  confirmation_number?: string | null;
  booking_amount?: number | null;
  room_category?: string | null;
  remark?: string | null;
  night_type: NightType;
  redeemed_offer_ids?: number[] | null;
  amount_paid_by_client: number;
  note?: string | null;
}

export interface UpdateBookingInput {
  assist_by?: string | null;
  contact_number?: string | null;
  check_in?: string;
  check_out?: string;
  nights?: number;
  no_of_rooms?: number;
  no_of_adults?: number;
  children?: number;
  booking_type?: string | null;
  hotel_name?: string;
  hotel_address?: string | null;
  hotel_contact?: string | null;
  confirmation_number?: string | null;
  booking_amount?: number | null;
  room_category?: string | null;
  remark?: string | null;
  amount_paid_by_client?: number;
  note?: string | null;
  status?: BookingStatus;
}

const repo = new BookingRepository();

export class BookingService {
  async getByClientId(client_id: number): Promise<Booking[]> {
    return repo.findByClientId(client_id);
  }

  async createBooking(client_id: number, input: CreateBookingInput): Promise<Booking> {
    const t = await sequelize.transaction();
    try {
      const membership = await Membership.findByPk(input.membership_id, { transaction: t });
      if (!membership) throw new AppError('Membership not found', 404);

      // Deduct nights only for MEMBERSHIP type
      if (input.night_type === NightType.MEMBERSHIP) {
        const remaining = membership.nights_remaining ?? 0;
        if (remaining < input.nights) {
          throw new AppError(
            `Not enough nights remaining. Available: ${remaining}, Requested: ${input.nights}`,
            400,
          );
        }
        await membership.decrement('nights_remaining', { by: input.nights, transaction: t });
      }

      // Mark redeemed offers
      const offerIds = input.redeemed_offer_ids?.filter(Boolean) ?? [];
      if (offerIds.length) {
        await ClientOffer.update({ is_redeemed: true }, { where: { offer_id: offerIds }, transaction: t });
      }

      const booking = await repo.create(
        { ...input, client_id, status: BookingStatus.CONFIRMED } as Partial<IBooking>,
        t,
      );

      await t.commit();
      return booking;
    } catch (err) {
      await t.rollback();
      throw err;
    }
  }

  async updateBooking(booking_id: number, input: UpdateBookingInput): Promise<void> {
    await repo.update(booking_id, input as Partial<IBooking>);
  }

  async cancelBooking(booking_id: number): Promise<void> {
    const t = await sequelize.transaction();
    try {
      const booking = await repo.findById(booking_id);
      if (!booking) throw new AppError('Booking not found', 404);
      if (booking.status === BookingStatus.CANCELLED) throw new AppError('Booking already cancelled', 400);

      // Restore nights if it was a MEMBERSHIP booking
      if (booking.night_type === NightType.MEMBERSHIP) {
        await Membership.increment('nights_remaining', {
          by: booking.nights,
          where: { membership_id: booking.membership_id },
          transaction: t,
        });
      }

      // Un-redeem offers
      const offerIds = booking.redeemed_offer_ids?.filter(Boolean) ?? [];
      if (offerIds.length) {
        await ClientOffer.update({ is_redeemed: false }, { where: { offer_id: offerIds }, transaction: t });
      }

      await repo.update(booking_id, { status: BookingStatus.CANCELLED }, t);
      await t.commit();
    } catch (err) {
      await t.rollback();
      throw err;
    }
  }
}
