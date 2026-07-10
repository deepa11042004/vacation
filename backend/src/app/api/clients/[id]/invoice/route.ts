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

/**
 * @swagger
 * /api/clients/{id}/invoice:
 *   post:
 *     summary: Generate and send an invoice to client
 *     description: Generates a PDF invoice, emails it to the client, and saves the invoice record. Admin / Manager only.
 *     tags: [Clients]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *         description: Client ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [invoice_no, issue_date, client_name, email]
 *             properties:
 *               invoice_no:     { type: string, example: "INV-000123" }
 *               issue_date:     { type: string, example: "2026-07-09" }
 *               client_name:    { type: string, example: "John Doe" }
 *               email:          { type: string, format: email }
 *               phone:          { type: string, example: "9876543210" }
 *               address:        { type: string }
 *               payment_mode:   { type: string, example: "CASH" }
 *               payment_type:   { type: string, example: "Cash" }
 *               amount:         { type: string, example: "50000" }
 *               description:    { type: string, example: "Holiday Package" }
 *               invoice_type:   { type: string, enum: [invoice, tax], default: invoice }
 *               card_number:    { type: string }
 *               transaction_id: { type: string }
 *               bank:           { type: string }
 *               card_cheque_no: { type: string }
 *               state:          { type: string }
 *               client_gst:     { type: string }
 *     responses:
 *       200:
 *         description: Invoice generated and sent successfully
 *       400:
 *         description: Validation error
 *       404:
 *         description: Client not found
 */
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
