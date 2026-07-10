import { NextRequest, NextResponse } from 'next/server';
import { PaymentController } from '@/modules/payments/controllers/payment.controller';
import { PaymentService } from '@/modules/payments/services/payment.service';
import { CreatePaymentSchema } from '@/modules/payments/validators/payment.validator';
import { ResponseUtil } from '@/shared/utils/response.util';
import { errorHandler } from '@/shared/middlewares/error.middleware';
import { authenticateRequest, requireRoles } from '@/shared/middlewares/auth.middleware';
import { UserRole } from '@/modules/users/types/user.types';
import { connectDB } from '@/shared/database/sequelize';

const paymentService = new PaymentService();

/**
 * @swagger
 * /api/clients/{id}/payments:
 *   get:
 *     summary: List payments for a client
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
 *         description: Payments retrieved successfully
 *   post:
 *     summary: Record a payment for a client membership
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
 *             required: [membership_id, amount, payment_mode, payment_date]
 *             properties:
 *               membership_id:   { type: integer }
 *               amount:          { type: number, example: 50000 }
 *               payment_mode:    { type: string, enum: [CASH, CHEQUE, ONLINE, BANK_TRANSFER, CARD] }
 *               payment_date:    { type: string, format: date }
 *               transaction_ref: { type: string }
 *               bank_name:       { type: string }
 *               remarks:         { type: string }
 *     responses:
 *       201:
 *         description: Payment recorded successfully
 */
export async function GET(request: NextRequest, props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  return PaymentController.getByClientId(request, params.id);
}

export async function POST(request: NextRequest, props: { params: Promise<{ id: string }> }) {
  try {
    await connectDB();
    const currentUser = await authenticateRequest(request);
    requireRoles(currentUser, [UserRole.ADMIN, UserRole.MANAGER]);

    const { id } = await props.params;
    const clientId = parseInt(id, 10);
    if (isNaN(clientId)) return NextResponse.json(ResponseUtil.failure('Invalid client id'), { status: 400 });

    const body = await request.json();
    const validated = CreatePaymentSchema.parse({ ...body, client_id: clientId });
    const result = await paymentService.createPayment(validated);
    return NextResponse.json(ResponseUtil.success('Payment recorded successfully', result), { status: 201 });
  } catch (error) {
    return errorHandler(error);
  }
}
