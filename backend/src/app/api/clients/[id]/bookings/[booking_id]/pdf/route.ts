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
 * /api/clients/{id}/bookings/{booking_id}/pdf:
 *   get:
 *     summary: Download the booking confirmation PDF
 *     description: Includes the system-generated Booking ID and the hotel confirmation number. Admin / Manager only.
 *     tags: [Bookings]
 *     security:
 *       - BearerAuth: []
 */
export async function GET(
  request: NextRequest,
  props: { params: Promise<{ id: string; booking_id: string }> },
) {
  try {
    await connectDB();
    const currentUser = await authenticateRequest(request);
    requireRoles(currentUser, [UserRole.ADMIN, UserRole.MANAGER]);

    const { id, booking_id } = await props.params;
    const { clientId, bookingId } = parseIds(id, booking_id);
    const { buffer, fileName } = await service.generatePdf(bookingId, clientId);

    return new NextResponse(new Uint8Array(buffer), {
      status: 200,
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${fileName}"`,
        'Content-Length': String(buffer.length),
      },
    });
  } catch (error) {
    return errorHandler(error);
  }
}
