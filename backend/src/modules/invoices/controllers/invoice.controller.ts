import { NextRequest, NextResponse } from 'next/server';
import { InvoiceService } from '../services/invoice.service';
import { sendInvoiceEmail } from '../../../shared/utils/email.service';
import { ResponseUtil } from '../../../shared/utils/response.util';
import { errorHandler, AppError } from '../../../shared/middlewares/error.middleware';
import { connectDB } from '../../../shared/database/sequelize';
import { authenticateRequest, requireRoles } from '../../../shared/middlewares/auth.middleware';
import { UserRole } from '../../users/types/user.types';

const invoiceService = new InvoiceService();

export class InvoiceController {
  private static parseId(idStr: string): number {
    const id = parseInt(idStr, 10);
    if (isNaN(id) || id <= 0) throw new AppError('Invalid invoice ID', 400);
    return id;
  }

  static async getAll(req: NextRequest) {
    try {
      await connectDB();
      const currentUser = await authenticateRequest(req);
      requireRoles(currentUser, [UserRole.ADMIN, UserRole.MANAGER]);

      const { searchParams } = new URL(req.url);
      const filters = {
        search: searchParams.get('search') || undefined,
        page:   parseInt(searchParams.get('page')  || '1',  10),
        limit:  parseInt(searchParams.get('limit') || '20', 10),
      };

      const result = await invoiceService.getAllInvoices(filters);
      return NextResponse.json(ResponseUtil.success('Invoices retrieved', result));
    } catch (error) {
      return errorHandler(error);
    }
  }

  static async getById(req: NextRequest, idStr: string) {
    try {
      await connectDB();
      const currentUser = await authenticateRequest(req);
      requireRoles(currentUser, [UserRole.ADMIN, UserRole.MANAGER]);

      const invoice_id = InvoiceController.parseId(idStr);
      const invoice = await invoiceService.getInvoiceById(invoice_id);
      return NextResponse.json(ResponseUtil.success('Invoice retrieved', invoice));
    } catch (error) {
      return errorHandler(error);
    }
  }

  static async delete(req: NextRequest, idStr: string) {
    try {
      await connectDB();
      const currentUser = await authenticateRequest(req);
      requireRoles(currentUser, [UserRole.ADMIN]);

      const invoice_id = InvoiceController.parseId(idStr);
      await invoiceService.deleteInvoice(invoice_id);
      return NextResponse.json(ResponseUtil.success('Invoice deleted', null));
    } catch (error) {
      return errorHandler(error);
    }
  }

  static async resendEmail(req: NextRequest, idStr: string) {
    try {
      await connectDB();
      const currentUser = await authenticateRequest(req);
      requireRoles(currentUser, [UserRole.ADMIN, UserRole.MANAGER]);

      const invoice_id = InvoiceController.parseId(idStr);
      const invoice = await invoiceService.getInvoiceById(invoice_id);
      
      if (!invoice.email) {
        throw new AppError('Invoice has no email associated with it', 400);
      }
      
      await sendInvoiceEmail(invoice.email, invoice as any);
      return NextResponse.json(ResponseUtil.success('Invoice email resent', null));
    } catch (error) {
      return errorHandler(error);
    }
  }
}
