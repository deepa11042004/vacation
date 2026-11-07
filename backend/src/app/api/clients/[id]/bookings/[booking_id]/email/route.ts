import { NextRequest, NextResponse } from 'next/server';
import { BookingDocumentService } from '@/modules/bookings/services/booking-document.service';
import { ResponseUtil } from '@/shared/utils/response.util';
import { errorHandler, AppError } from '@/shared/middlewares/error.middleware';
import { authenticateRequest, requireRoles } from '@/shared/middlewares/auth.middleware';
import { UserRole } from '@/modules/users/types/user.types';
import { connectDB } from '@/shared/database/sequelize';

export const dynamic = 'force-dynamic';

const service = new BookingDocumentService();

function parseIds(id: string, booking_id: string) {
  const clientId = parseInt(id, 10);
  const bookingId = parseInt(booking_id, 10);
  if (isNaN(clientId) || isNaN(bookingId)) throw new AppError('Invalid id', 400);
  return { clientId, bookingId };
}

/**
 * @swagger
 * /api/clients/{id}/bookings/{booking_id}/email:
 *   post:
 *     summary: Email the booking confirmation PDF to the client
 *     description: Requires the hotel confirmation number to be set. Records the time it was sent. Admin / Manager only.
 *     tags: [Bookings]
 *     security:
 *       - BearerAuth: []
 */
export async function POST(
  request: NextRequest,
  props: { params: Promise<{ id: string; booking_id: string }> },
) {
  try {
    await connectDB();
    const currentUser = await authenticateRequest(request);
    requireRoles(currentUser, [UserRole.ADMIN, UserRole.MANAGER]);

    const { id, booking_id } = await props.params;
    const { clientId, bookingId } = parseIds(id, booking_id);
    const result = await service.emailToClient(bookingId, clientId);
    return NextResponse.json(ResponseUtil.success(`Booking emailed to ${result.sentTo}`, { email_sent_at: result.sentAt }));
  } catch (error) {
    return errorHandler(error);
  }
}
