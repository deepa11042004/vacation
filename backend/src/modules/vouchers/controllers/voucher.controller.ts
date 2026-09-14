import { NextRequest, NextResponse } from 'next/server';
import { VoucherService } from '../services/voucher.service';
import { CreateVoucherSchema, RedeemVoucherSchema, GetVouchersQuerySchema } from '../validators/voucher.validator';
import { ResponseUtil } from '../../../shared/utils/response.util';
import { errorHandler, AppError } from '../../../shared/middlewares/error.middleware';
import { connectDB } from '../../../shared/database/sequelize';
import { authenticateRequest, requireRoles } from '../../../shared/middlewares/auth.middleware';
import { UserRole } from '../../users/types/user.types';

const voucherService = new VoucherService();

export class VoucherController {
  private static parseId(idStr: string): number {
    const id = parseInt(idStr, 10);
    if (isNaN(id) || id <= 0) {
      throw new AppError('Invalid voucher ID', 400);
    }
    return id;
  }

  static async create(req: NextRequest) {
    try {
      await connectDB();
      const currentUser = await authenticateRequest(req);
      requireRoles(currentUser, [UserRole.ADMIN, UserRole.MANAGER]);

      const body = await req.json();
      const validatedData = CreateVoucherSchema.parse(body);

      const result = await voucherService.createVoucher(
        validatedData,
        currentUser.user_id
      );

      return NextResponse.json(
        ResponseUtil.success('Voucher created successfully', result),
        { status: 201 }
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

      const searchParams = req.nextUrl?.searchParams ?? new URL(req.url, 'http://localhost').searchParams;
      const queryObj: Record<string, any> = {};

      if (searchParams.get('search')) queryObj.search = searchParams.get('search');
      if (searchParams.get('voucher_type')) queryObj.voucher_type = searchParams.get('voucher_type');
      if (searchParams.get('status')) queryObj.status = searchParams.get('status');
      if (searchParams.get('from_date')) queryObj.from_date = searchParams.get('from_date');
      if (searchParams.get('to_date')) queryObj.to_date = searchParams.get('to_date');
      if (searchParams.get('page')) queryObj.page = searchParams.get('page');
      if (searchParams.get('limit')) queryObj.limit = searchParams.get('limit');

      const validatedQuery = GetVouchersQuerySchema.parse(queryObj);
      const result = await voucherService.getAllVouchers(validatedQuery);

      return NextResponse.json(
        ResponseUtil.success('Vouchers retrieved successfully', result),
        { status: 200 }
      );
    } catch (error) {
      return errorHandler(error);
    }
  }

  static async getById(req: NextRequest, idStr: string) {
    try {
      await connectDB();
      const currentUser = await authenticateRequest(req);
      requireRoles(currentUser, [UserRole.ADMIN, UserRole.MANAGER]);

      const id = this.parseId(idStr);
      const result = await voucherService.getVoucherById(id);

      return NextResponse.json(
        ResponseUtil.success('Voucher retrieved successfully', result),
        { status: 200 }
      );
    } catch (error) {
      return errorHandler(error);
    }
  }

  static async resendEmail(req: NextRequest, idStr: string) {
    try {
      await connectDB();
      const currentUser = await authenticateRequest(req);
      requireRoles(currentUser, [UserRole.ADMIN, UserRole.MANAGER]);

      const id = this.parseId(idStr);
      const result = await voucherService.resendEmail(id);

      return NextResponse.json(
        ResponseUtil.success('Voucher email sent successfully.', result),
        { status: 200 }
      );
    } catch (error) {
      return errorHandler(error);
    }
  }

  /**
   * Download voucher PDF by ID (Authenticated or direct request)
   */
  static async downloadPdf(req: NextRequest, idStr: string) {
    try {
      await connectDB();
      const id = this.parseId(idStr);
      const { buffer, voucher } = await voucherService.generatePdfById(id);

      return new NextResponse(new Uint8Array(buffer), {
        status: 200,
        headers: {
          'Content-Type': 'application/pdf',
          'Content-Disposition': `attachment; filename="Holiday-Gift-Voucher-${voucher.voucher_number}.pdf"`,
          'Content-Length': String(buffer.length),
        },
      });
    } catch (error) {
      return errorHandler(error);
    }
  }

  /**
   * Public download voucher PDF by voucher number
   */
  static async downloadPdfByNumber(req: NextRequest, voucherNumber: string) {
    try {
      await connectDB();
      if (!voucherNumber || !voucherNumber.trim()) {
        throw new AppError('Voucher number is required', 400);
      }
      const { buffer, voucher } = await voucherService.generatePdfByNumber(voucherNumber.trim());

      return new NextResponse(new Uint8Array(buffer), {
        status: 200,
        headers: {
          'Content-Type': 'application/pdf',
          'Content-Disposition': `attachment; filename="Holiday-Gift-Voucher-${voucher.voucher_number}.pdf"`,
          'Content-Length': String(buffer.length),
        },
      });
    } catch (error) {
      return errorHandler(error);
    }
  }

  /**
   * Public redemption endpoint - no authentication required
   */
  static async redeem(req: NextRequest) {
    try {
      await connectDB();
      const body = await req.json();
      const validatedData = RedeemVoucherSchema.parse(body);

      const result = await voucherService.redeemVoucher(validatedData.voucherNumber);

      return NextResponse.json(
        ResponseUtil.success('Your voucher has been redeemed successfully.', result),
        { status: 200 }
      );
    } catch (error) {
      return errorHandler(error);
    }
  }
}
