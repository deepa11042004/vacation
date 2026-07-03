import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { connectDB } from '@/shared/database/sequelize';
import { authenticateRequest, requireRoles } from '@/shared/middlewares/auth.middleware';
import { errorHandler, AppError } from '@/shared/middlewares/error.middleware';
import { ResponseUtil } from '@/shared/utils/response.util';
import { ClientService } from '@/modules/clients/services/client.service';
import { UserRole } from '@/modules/users/types/user.types';
import { sendInvoiceEmail } from '@/shared/utils/email.service';

const clientService = new ClientService();

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
});

/**
 * @swagger
 * /api/clients/{id}/invoice:
 *   post:
 *     summary: Send an invoice PDF to a client by email
 *     description: |
 *       Generates a professional A4 invoice PDF and emails it to the specified address using
 *       the configured invoice email template. Variables in the template (`{{invoice_no}}`,
 *       `{{client_name}}`, `{{amount}}`, `{{issue_date}}`) are interpolated automatically.
 *     tags: [Clients]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *         description: Client ID (used to verify the client exists)
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [invoice_no, issue_date, client_name, email, amount]
 *             properties:
 *               invoice_no:     { type: string, example: "2627/001" }
 *               issue_date:     { type: string, format: date, example: "2026-07-03" }
 *               client_name:    { type: string, example: "Rahul Sharma" }
 *               card_number:    { type: string, example: "MEM-000001" }
 *               email:          { type: string, format: email, example: "rahul@example.com" }
 *               phone:          { type: string, example: "+91 9876543210" }
 *               address:        { type: string, example: "123 Main St, Delhi" }
 *               payment_mode:   { type: string, enum: [CASH, CHEQUE, ONLINE, BANK_TRANSFER, CARD], example: "ONLINE" }
 *               payment_type:   { type: string, example: "Debit Card" }
 *               transaction_id: { type: string, example: "TXN123456" }
 *               bank:           { type: string, example: "HDFC Bank" }
 *               card_cheque_no: { type: string, example: "XXXX1234" }
 *               amount:         { type: string, example: "50000" }
 *               description:    { type: string, example: "Holiday Package (Sheet Attached For Details)" }
 *               state:          { type: string, example: "Delhi" }
 *     responses:
 *       200:
 *         description: Invoice emailed successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean, example: true }
 *                 message: { type: string, example: "Invoice 2627/001 sent to rahul@example.com" }
 *       400:
 *         description: Validation error or invalid client ID
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden — Admin or Manager only
 *       404:
 *         description: Client not found
 *       500:
 *         description: Email delivery failed (SMTP error)
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

    return NextResponse.json(
      ResponseUtil.success(`Invoice ${data.invoice_no} sent to ${data.email}`, null),
      { status: 200 },
    );
  } catch (error) {
    return errorHandler(error);
  }
}
