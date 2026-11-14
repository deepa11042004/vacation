import { Op } from 'sequelize';
import { Booking } from '../models/Booking.model';
import { AppError } from '../../../shared/middlewares/error.middleware';

/** Default booking number generated from the system id, e.g. BK-000012. */
export const formatBookingId = (booking_id: number) => `BK-${String(booking_id).padStart(6, '0')}`;

/** The number to show for a booking: the stored (possibly edited) one, else the generated default. */
export const bookingNumberOf = (b: { booking_id: number; booking_number?: string | null }) =>
  b.booking_number?.trim() || formatBookingId(b.booking_id);

const NUMBER_RE = /^[A-Za-z0-9\-_/]+$/;

export function validateBookingNumber(raw: string): string {
  const value = raw.trim();
  if (!value) throw new AppError('Booking ID cannot be empty', 400);
  if (value.length > 40 || !NUMBER_RE.test(value)) {
    throw new AppError('Booking ID may only contain letters, numbers, - _ / (max 40 characters)', 400);
  }
  return value;
}

/** True if another booking (deleted or cancelled ones included) already uses this number. */
export async function isBookingNumberTaken(number: string, excludeBookingId?: number): Promise<boolean> {
  const found = await Booking.findOne({
    where: {
      booking_number: number,
      ...(excludeBookingId ? { booking_id: { [Op.ne]: excludeBookingId } } : {}),
    },
    paranoid: false,
    attributes: ['booking_id'],
  });
  return !!found;
}

/** First unused BK-###### number starting from the booking id (skips numbers an admin already set by hand). */
export async function nextFreeBookingNumber(fromId: number): Promise<string> {
  for (let n = fromId; ; n += 1) {
    const candidate = formatBookingId(n);
    if (!(await isBookingNumberTaken(candidate))) return candidate;
  }
}
