import { NextRequest } from 'next/server';
import { InvoiceController } from '@/modules/invoices/controllers/invoice.controller';

export const dynamic = 'force-dynamic';

/**
 * @swagger
 * /api/invoices/{id}:
 *   get:
 *     summary: Get invoice by ID
 *     description: Invoices are immutable. They cannot be edited or deleted, only cancelled via POST /api/invoices/{id}/cancel.
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
 *         description: Invoice retrieved successfully
 *       404:
 *         description: Invoice not found
 */
export async function GET(request: NextRequest, props: { params: Promise<{ id: string }> }) {
  const { id } = await props.params;
  return InvoiceController.getById(request, id);
}
