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
