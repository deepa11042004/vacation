import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { BookingService, UpdateBookingInput } from '@/modules/bookings/services/booking.service';
import { BookingStatus } from '@/modules/bookings/interfaces/booking.interface';
import { ResponseUtil } from '@/shared/utils/response.util';
import { errorHandler } from '@/shared/middlewares/error.middleware';
import { authenticateRequest, requireRoles } from '@/shared/middlewares/auth.middleware';
import { UserRole } from '@/modules/users/types/user.types';
import { connectDB } from '@/shared/database/sequelize';

const service = new BookingService();

const UpdateBookingSchema = z.object({
  assist_by:             z.string().max(100).optional().nullable(),
  contact_number:        z.string().max(20).optional().nullable(),
  check_in:              z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
  check_out:             z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
  nights:                z.number().int().positive().optional(),
  no_of_rooms:           z.number().int().positive().optional(),
  no_of_adults:          z.number().int().positive().optional(),
  children:              z.number().int().min(0).optional(),
  booking_type:          z.string().max(200).optional().nullable(),
  hotel_name:            z.string().min(1).max(200).optional(),
  hotel_address:         z.string().optional().nullable(),
  hotel_contact:         z.string().max(30).optional().nullable(),
  confirmation_number:   z.string().max(100).optional().nullable(),
  booking_amount:        z.number().min(0).optional().nullable(),
  room_category:         z.string().max(100).optional().nullable(),
  remark:                z.string().optional().nullable(),
  amount_paid_by_client: z.number().min(0).optional(),
  note:                  z.string().optional().nullable(),
  status:                z.nativeEnum(BookingStatus).optional(),
});

/**
 * @swagger
 * /api/clients/{id}/bookings/{booking_id}:
 *   put:
 *     summary: Update a booking
 *     tags: [Clients]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *       - in: path
 *         name: booking_id
 *         required: true
 *         schema: { type: integer }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               hotel_name:            { type: string }
 *               check_in:              { type: string, format: date }
 *               check_out:             { type: string, format: date }
 *               nights:                { type: integer }
 *               no_of_rooms:           { type: integer }
 *               no_of_adults:          { type: integer }
 *               booking_amount:        { type: number }
 *               amount_paid_by_client: { type: number }
 *               status:                { type: string, enum: [PENDING, CONFIRMED, CANCELLED, COMPLETED] }
 *               remark:                { type: string }
 *     responses:
 *       200:
 *         description: Booking updated successfully
 *   delete:
 *     summary: Cancel a booking (restores membership nights)
 *     tags: [Clients]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *       - in: path
 *         name: booking_id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: Booking cancelled and nights restored
 *       404:
 *         description: Booking not found
 */
// PUT /api/clients/:id/bookings/:booking_id — update details
export async function PUT(
  request: NextRequest,
  props: { params: Promise<{ id: string; booking_id: string }> },
) {
  try {
    await connectDB();
    const currentUser = await authenticateRequest(request);
    requireRoles(currentUser, [UserRole.ADMIN, UserRole.MANAGER]);

    const { booking_id } = await props.params;
    const bookingIdNum = parseInt(booking_id, 10);
    if (isNaN(bookingIdNum)) return NextResponse.json(ResponseUtil.failure('Invalid booking id'), { status: 400 });

    const body = await request.json();
    const validated = UpdateBookingSchema.parse(body);
    await service.updateBooking(bookingIdNum, validated as UpdateBookingInput);
    return NextResponse.json(ResponseUtil.success('Booking updated', null));
  } catch (error) {
    return errorHandler(error);
  }
}

// DELETE /api/clients/:id/bookings/:booking_id — cancel booking + restore nights
export async function DELETE(
  request: NextRequest,
  props: { params: Promise<{ id: string; booking_id: string }> },
) {
  try {
    await connectDB();
    const currentUser = await authenticateRequest(request);
    requireRoles(currentUser, [UserRole.ADMIN, UserRole.MANAGER]);

    const { booking_id } = await props.params;
    const bookingIdNum = parseInt(booking_id, 10);
    if (isNaN(bookingIdNum)) return NextResponse.json(ResponseUtil.failure('Invalid booking id'), { status: 400 });

    await service.cancelBooking(bookingIdNum);
    return NextResponse.json(ResponseUtil.success('Booking cancelled', null));
  } catch (error) {
    return errorHandler(error);
  }
}
