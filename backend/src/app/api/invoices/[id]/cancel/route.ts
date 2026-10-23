import { NextRequest } from 'next/server';
import { InvoiceController } from '@/modules/invoices/controllers/invoice.controller';

export const dynamic = 'force-dynamic';

/**
 * @swagger
 * /api/invoices/{id}/cancel:
 *   post:
 *     summary: Cancel an invoice
 *     description: Marks the invoice as cancelled. The record and its number are kept; a cancelled invoice cannot be re-activated or emailed. Admin / Manager only.
 *     tags: [Invoices]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: Invoice cancelled
 *       400:
 *         description: Invoice already cancelled
 *       404:
 *         description: Invoice not found
 */
export async function POST(request: NextRequest, props: { params: Promise<{ id: string }> }) {
  const { id } = await props.params;
  return InvoiceController.cancel(request, id);
}
