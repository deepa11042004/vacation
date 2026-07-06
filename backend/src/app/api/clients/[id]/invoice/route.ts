import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { connectDB } from '@/shared/database/sequelize';
import { authenticateRequest, requireRoles } from '@/shared/middlewares/auth.middleware';
import { errorHandler, AppError } from '@/shared/middlewares/error.middleware';
import { ResponseUtil } from '@/shared/utils/response.util';
import { ClientService } from '@/modules/clients/services/client.service';
import { UserRole } from '@/modules/users/types/user.types';
import { sendInvoiceEmail } from '@/shared/utils/email.service';
import { InvoiceService } from '@/modules/invoices/services/invoice.service';

const clientService = new ClientService();
const invoiceService = new InvoiceService();

const InvoiceSchema = z.object({
  invoice_no:     z.string().min(1),
  issue_date:     z.string().min(1),
  client_name:    z.string().min(1),
  card_number:    z.string().default(''),
  email:          z.string().email(),
  phone:          z.string().default(''),
  address:        z.string().default(''),
  payment_mode:   z.string().default('CASH'),
  payment_type:   z.string().default('Cash'),
  transaction_id: z.string().default(''),
  bank:           z.string().default(''),
  card_cheque_no: z.string().default(''),
  amount:         z.string().default('0'),
  description:    z.string().default('Holiday Package (Sheet Attached For Details)'),
  state:          z.string().default(''),
  invoice_type:   z.enum(['invoice', 'tax']).default('invoice'),
  client_gst:     z.string().optional(),
});

export async function POST(request: NextRequest, props: { params: Promise<{ id: string }> }) {
  try {
    await connectDB();
    const currentUser = await authenticateRequest(request);
    requireRoles(currentUser, [UserRole.ADMIN, UserRole.MANAGER]);

    const { id } = await props.params;
    const client_id = parseInt(id, 10);
    if (isNaN(client_id) || client_id <= 0) throw new AppError('Invalid client ID', 400);

    await clientService.getClientById(client_id);

    const body = await request.json();
    const data = InvoiceSchema.parse(body);

    await sendInvoiceEmail(data.email, data);

    const invoice = await invoiceService.createInvoice({
      invoice_no:     data.invoice_no,
      invoice_type:   data.invoice_type,
      client_id,
      client_name:    data.client_name,
      card_number:    data.card_number,
      email:          data.email,
      phone:          data.phone,
      address:        data.address,
      state:          data.state,
      client_gst:     data.client_gst || null,
      payment_mode:   data.payment_mode,
      payment_type:   data.payment_type,
      transaction_id: data.transaction_id,
      bank:           data.bank,
      card_cheque_no: data.card_cheque_no,
      amount:         data.amount,
      description:    data.description,
      issue_date:     data.issue_date,
      created_by:     currentUser.user_id ?? null,
    });

    return NextResponse.json(
      ResponseUtil.success(`Invoice ${data.invoice_no} sent to ${data.email}`, { invoice_id: invoice.invoice_id }),
      { status: 200 },
    );
  } catch (error) {
    return errorHandler(error);
  }
}
