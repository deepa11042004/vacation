import { NextRequest, NextResponse } from 'next/server';
import { Op, WhereOptions } from 'sequelize';
import { Booking } from '@/modules/bookings/models/Booking.model';
import { Client } from '@/modules/clients/models/Client.model';
import { Membership } from '@/modules/memberships/models/Membership.model';
import { BookingStatus } from '@/modules/bookings/interfaces/booking.interface';
import { bookingNumberOf } from '@/modules/bookings/services/booking-number.util';
import { ResponseUtil } from '@/shared/utils/response.util';
import { errorHandler } from '@/shared/middlewares/error.middleware';
import { authenticateRequest, requireRoles } from '@/shared/middlewares/auth.middleware';
import { UserRole } from '@/modules/users/types/user.types';
import { connectDB } from '@/shared/database/sequelize';

export const dynamic = 'force-dynamic';

const DATE_RE = /^\d{4}-\d{2}-\d{2}$/;

/**
 * @swagger
 * /api/bookings:
 *   get:
 *     summary: Booking sheet - bookings across all clients
 *     description: Filter by status (ACTIVE = confirmed + completed, default), search, and check-in date range. Admin / Manager only.
 *     tags: [Bookings]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: query
 *         name: status
 *         schema: { type: string, enum: [ACTIVE, CONFIRMED, COMPLETED, CANCELLED, ALL] }
 *       - in: query
 *         name: search
 *         schema: { type: string }
 *       - in: query
 *         name: from
 *         schema: { type: string, format: date }
 *       - in: query
 *         name: to
 *         schema: { type: string, format: date }
 *       - in: query
 *         name: page
 *         schema: { type: integer }
 *       - in: query
 *         name: limit
 *         schema: { type: integer }
 */
export async function GET(request: NextRequest) {
  try {
    await connectDB();
    const currentUser = await authenticateRequest(request);
    requireRoles(currentUser, [UserRole.ADMIN, UserRole.MANAGER]);

    const sp = request.nextUrl.searchParams;
    const status = (sp.get('status') || 'ACTIVE').toUpperCase();
    const search = sp.get('search')?.trim();
    const from = sp.get('from');
    const to = sp.get('to');
    const page = Math.max(1, parseInt(sp.get('page') || '1', 10) || 1);
    const limit = Math.min(5000, Math.max(1, parseInt(sp.get('limit') || '20', 10) || 20));

    const and: WhereOptions[] = [];
    if (status === 'ACTIVE') and.push({ status: { [Op.in]: [BookingStatus.CONFIRMED, BookingStatus.COMPLETED] } });
    else if (status !== 'ALL' && (Object.values(BookingStatus) as string[]).includes(status)) and.push({ status });

    if (from && DATE_RE.test(from)) and.push({ check_in: { [Op.gte]: from } });
    if (to && DATE_RE.test(to)) and.push({ check_in: { [Op.lte]: to } });

    if (search) {
      const like = { [Op.like]: `%${search}%` };
      const idMatch = search.replace(/^bk-?/i, '');
      const or: WhereOptions[] = [
        { hotel_name: like },
        { booking_number: like },
        { confirmation_number: like },
        { '$client.first_name$': like },
        { '$client.last_name$': like },
        { '$client.email$': like },
        { '$membership.membership_number$': like },
      ];
      if (/^\d+$/.test(idMatch)) or.push({ booking_id: parseInt(idMatch, 10) });
      and.push({ [Op.or]: or });
    }

    const { rows, count } = await Booking.findAndCountAll({
      where: and.length ? { [Op.and]: and } : {},
      include: [
        { model: Client, as: 'client', attributes: ['client_id', 'first_name', 'last_name', 'email'], required: false, paranoid: false },
        { model: Membership, as: 'membership', attributes: ['membership_id', 'membership_number'], required: false },
      ],
      order: [['check_in', 'DESC'], ['booking_id', 'DESC']],
      limit,
      offset: (page - 1) * limit,
    });

    const bookings = rows.map(b => {
      const j = b.toJSON() as unknown as Record<string, any>;
      return {
        booking_id: j.booking_id,
        booking_ref: bookingNumberOf(j as { booking_id: number; booking_number?: string | null }),
        confirmation_number: j.confirmation_number,
        client_id: j.client_id,
        client_name: [j.client?.first_name, j.client?.last_name].filter(Boolean).join(' '),
        client_email: j.client?.email ?? null,
        membership_number: j.membership?.membership_number ?? null,
        hotel_name: j.hotel_name,
        hotel_address: j.hotel_address,
        check_in: j.check_in,
        check_out: j.check_out,
        nights: j.nights,
        no_of_rooms: j.no_of_rooms,
        no_of_adults: j.no_of_adults,
        children: j.children,
        night_type: j.night_type,
        booking_amount: j.booking_amount,
        amount_paid_by_client: j.amount_paid_by_client,
        status: j.status,
        email_sent_at: j.email_sent_at,
        created_at: j.created_at,
      };
    });

    return NextResponse.json(ResponseUtil.success('Bookings retrieved', { bookings, total: count, page, limit }));
  } catch (error) {
    return errorHandler(error);
  }
}
