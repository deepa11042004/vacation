import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { BookingService } from '@/modules/bookings/services/booking.service';
import { NightType } from '@/modules/bookings/interfaces/booking.interface';
import { ResponseUtil } from '@/shared/utils/response.util';
import { errorHandler } from '@/shared/middlewares/error.middleware';
import { authenticateRequest, requireRoles } from '@/shared/middlewares/auth.middleware';
import { UserRole } from '@/modules/users/types/user.types';
import { connectDB } from '@/shared/database/sequelize';

const service = new BookingService();

const CreateBookingSchema = z.object({
  membership_id:          z.number().int().positive(),
  assist_by:              z.string().max(100).optional().nullable(),
  contact_number:         z.string().max(20).optional().nullable(),
  check_in:               z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'check_in must be YYYY-MM-DD'),
  check_out:              z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'check_out must be YYYY-MM-DD'),
  nights:                 z.number().int().positive(),
  no_of_rooms:            z.number().int().positive().default(1),
  no_of_adults:           z.number().int().positive().default(1),
  children:               z.number().int().min(0).default(0),
  booking_type:           z.string().max(200).optional().nullable(),
  hotel_name:             z.string().min(1).max(200),
  hotel_address:          z.string().optional().nullable(),
  hotel_contact:          z.string().max(30).optional().nullable(),
  confirmation_number:    z.string().max(100).optional().nullable(),
  booking_amount:         z.number().min(0).optional().nullable(),
  room_category:          z.string().max(100).optional().nullable(),
  remark:                 z.string().optional().nullable(),
  night_type:             z.nativeEnum(NightType).default(NightType.MEMBERSHIP),
  redeemed_offer_ids:     z.array(z.number().int()).optional().nullable(),
  amount_paid_by_client:  z.number().min(0).default(0),
  note:                   z.string().optional().nullable(),
});

/**
 * @swagger
 * /api/clients/{id}/bookings:
 *   get:
 *     summary: List bookings for a client
 *     tags: [Clients]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: Bookings retrieved successfully
 *   post:
 *     summary: Create a booking for a client
 *     description: Records a hotel booking against a membership, deducting nights used.
 *     tags: [Clients]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [membership_id, check_in, check_out, nights, hotel_name]
 *             properties:
 *               membership_id:         { type: integer, example: 1 }
 *               hotel_name:            { type: string, example: "The Leela Goa" }
 *               check_in:              { type: string, format: date, example: "2026-12-01" }
 *               check_out:             { type: string, format: date, example: "2026-12-05" }
 *               nights:                { type: integer, example: 4 }
 *               no_of_rooms:           { type: integer, default: 1 }
 *               no_of_adults:          { type: integer, default: 1 }
 *               children:              { type: integer, default: 0 }
 *               room_category:         { type: string }
 *               booking_amount:        { type: number }
 *               amount_paid_by_client: { type: number, default: 0 }
 *               confirmation_number:   { type: string }
 *               night_type:            { type: string, enum: [MEMBERSHIP, AMC, EXTRA], default: MEMBERSHIP }
 *               remark:                { type: string }
 *     responses:
 *       201:
 *         description: Booking created successfully
 */
// GET /api/clients/:id/bookings
export async function GET(
  request: NextRequest,
  props: { params: Promise<{ id: string }> },
) {
  try {
    await connectDB();
    const currentUser = await authenticateRequest(request);
    const { id } = await props.params;
    const client_id = parseInt(id, 10);
    if (isNaN(client_id)) return NextResponse.json(ResponseUtil.failure('Invalid client id'), { status: 400 });

    if (currentUser.role === UserRole.CLIENT && currentUser.client_id !== client_id) {
      return NextResponse.json(ResponseUtil.failure('Forbidden: Access denied'), { status: 403 });
    }

    const bookings = await service.getByClientId(client_id);
    return NextResponse.json(ResponseUtil.success('Bookings fetched', { bookings }));
  } catch (error) {
    return errorHandler(error);
  }
}

// POST /api/clients/:id/bookings
export async function POST(
  request: NextRequest,
  props: { params: Promise<{ id: string }> },
) {
  try {
    await connectDB();
    const currentUser = await authenticateRequest(request);
    requireRoles(currentUser, [UserRole.ADMIN, UserRole.MANAGER]);

    const { id } = await props.params;
    const client_id = parseInt(id, 10);
    if (isNaN(client_id)) return NextResponse.json(ResponseUtil.failure('Invalid client id'), { status: 400 });

    const body = await request.json();
    const validated = CreateBookingSchema.parse(body);

    const booking = await service.createBooking(client_id, validated);
    return NextResponse.json(ResponseUtil.success('Booking created', { booking }), { status: 201 });
  } catch (error) {
    return errorHandler(error);
  }
}
