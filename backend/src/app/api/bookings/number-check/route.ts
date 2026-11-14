import { NextRequest, NextResponse } from 'next/server';
import { isBookingNumberTaken } from '@/modules/bookings/services/booking-number.util';
import { ResponseUtil } from '@/shared/utils/response.util';
import { errorHandler } from '@/shared/middlewares/error.middleware';
import { authenticateRequest, requireRoles } from '@/shared/middlewares/auth.middleware';
import { UserRole } from '@/modules/users/types/user.types';
import { connectDB } from '@/shared/database/sequelize';

export const dynamic = 'force-dynamic';

/**
 * @swagger
 * /api/bookings/number-check:
 *   get:
 *     summary: Check whether a booking number is already used
 *     tags: [Bookings]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: query
 *         name: number
 *         required: true
 *         schema: { type: string }
 *       - in: query
 *         name: exclude
 *         description: booking_id to ignore (the booking being edited)
 *         schema: { type: integer }
 */
export async function GET(request: NextRequest) {
  try {
    await connectDB();
    const currentUser = await authenticateRequest(request);
    requireRoles(currentUser, [UserRole.ADMIN, UserRole.MANAGER]);

    const number = request.nextUrl.searchParams.get('number')?.trim() ?? '';
    const exclude = parseInt(request.nextUrl.searchParams.get('exclude') ?? '', 10);
    const taken = number ? await isBookingNumberTaken(number, isNaN(exclude) ? undefined : exclude) : false;
    return NextResponse.json(ResponseUtil.success('Checked', { taken }));
  } catch (error) {
    return errorHandler(error);
  }
}
