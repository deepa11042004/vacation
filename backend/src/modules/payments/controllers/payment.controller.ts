import { NextRequest, NextResponse } from 'next/server';
import { PaymentService } from '../services/payment.service';
import { CreatePaymentSchema, UpdatePaymentSchema, CancelPaymentSchema } from '../validators/payment.validator';
import { ResponseUtil } from '../../../shared/utils/response.util';
import { errorHandler, AppError } from '../../../shared/middlewares/error.middleware';
import { PaymentFilterOptions, PaymentStatus, PaymentType } from '../types/payment.types';
import { connectDB } from '../../../shared/database/sequelize';
import { PAYMENT_CONSTANTS } from '../constants/payment.constants';
import { authenticateRequest, requireRoles } from '../../../shared/middlewares/auth.middleware';
import { UserRole } from '../../users/types/user.types';

const paymentService = new PaymentService();

export class PaymentController {

  private static parseId(idStr: string): number {
    const id = parseInt(idStr, 10);
    if (isNaN(id) || id <= 0) {
      throw new AppError(PAYMENT_CONSTANTS.ERRORS.INVALID_ID, 400);
    }
    return id;
  }

  static async create(req: NextRequest) {
    try {
      await connectDB();
      const currentUser = await authenticateRequest(req);
      requireRoles(currentUser, [UserRole.ADMIN, UserRole.MANAGER]);

      const body = await req.json();
      const validatedData = CreatePaymentSchema.parse(body);
      const result = await paymentService.createPayment(validatedData);

      return NextResponse.json(
        ResponseUtil.success('Payment recorded successfully', result),
        { status: 201 },
      );
    } catch (error) {
      return errorHandler(error);
    }
  }

  static async getAll(req: NextRequest) {
    try {
      await connectDB();
      const currentUser = await authenticateRequest(req);
      requireRoles(currentUser, [UserRole.ADMIN, UserRole.MANAGER]);

      const { searchParams } = new URL(req.url);
      const filters: PaymentFilterOptions = {
        membership_id: searchParams.get('membership_id') ? parseInt(searchParams.get('membership_id')!, 10) : undefined,
        client_id: searchParams.get('client_id') ? parseInt(searchParams.get('client_id')!, 10) : undefined,
        payment_type: searchParams.get('payment_type') as PaymentType | undefined,
        status: searchParams.get('status') as PaymentStatus | undefined,
        from_date: searchParams.get('from_date') || undefined,
        to_date: searchParams.get('to_date') || undefined,
        page: parseInt(searchParams.get('page') || '1', 10),
        limit: parseInt(searchParams.get('limit') || '10', 10),
      };

      const result = await paymentService.getAllPayments(filters);

      return NextResponse.json(
        ResponseUtil.success('Payments retrieved successfully', result),
        { status: 200 },
      );
    } catch (error) {
      return errorHandler(error);
    }
  }

  static async getById(req: NextRequest, idStr: string) {
    try {
      await connectDB();
      const currentUser = await authenticateRequest(req);
      requireRoles(currentUser, [UserRole.ADMIN, UserRole.MANAGER, UserRole.AGENT]);

      const id = this.parseId(idStr);
      const result = await paymentService.getPaymentById(id);

      return NextResponse.json(
        ResponseUtil.success('Payment retrieved successfully', result),
        { status: 200 },
      );
    } catch (error) {
      return errorHandler(error);
    }
  }

  static async getByMembershipId(req: NextRequest, membershipIdStr: string) {
    try {
      await connectDB();
      const currentUser = await authenticateRequest(req);
      requireRoles(currentUser, [UserRole.ADMIN, UserRole.MANAGER, UserRole.AGENT]);

      const membershipId = this.parseId(membershipIdStr);
      const result = await paymentService.getPaymentsByMembership(membershipId);

      return NextResponse.json(
        ResponseUtil.success('Payments retrieved successfully', result),
        { status: 200 },
      );
    } catch (error) {
      return errorHandler(error);
    }
  }

  static async getByClientId(req: NextRequest, clientIdStr: string) {
    try {
      await connectDB();
      const currentUser = await authenticateRequest(req);

      const clientId = this.parseId(clientIdStr);

      if (currentUser.role === UserRole.CLIENT && currentUser.client_id !== clientId) {
        throw new AppError('Forbidden: Access denied', 403);
      }

      requireRoles(currentUser, [UserRole.ADMIN, UserRole.MANAGER, UserRole.CLIENT]);
      const result = await paymentService.getPaymentsByClient(clientId);

      return NextResponse.json(
        ResponseUtil.success('Client payments retrieved successfully', result),
        { status: 200 },
      );
    } catch (error) {
      return errorHandler(error);
    }
  }

  static async update(req: NextRequest, idStr: string) {
    try {
      await connectDB();
      const currentUser = await authenticateRequest(req);
      requireRoles(currentUser, [UserRole.ADMIN]);

      const id = this.parseId(idStr);
      const body = await req.json();
      const validatedData = UpdatePaymentSchema.parse(body);
      const result = await paymentService.updatePayment(id, validatedData);

      return NextResponse.json(
        ResponseUtil.success('Payment updated successfully', result),
        { status: 200 },
      );
    } catch (error) {
      return errorHandler(error);
    }
  }

  static async cancel(req: NextRequest, idStr: string) {
    try {
      await connectDB();
      const currentUser = await authenticateRequest(req);
      requireRoles(currentUser, [UserRole.ADMIN]);

      const id = this.parseId(idStr);
      const result = await paymentService.cancelPayment(id);

      return NextResponse.json(
        ResponseUtil.success('Payment cancelled successfully', result),
        { status: 200 },
      );
    } catch (error) {
      return errorHandler(error);
    }
  }
}
