import { NextRequest } from 'next/server';
import { InvoiceController } from '@/modules/invoices/controllers/invoice.controller';

/**
 * @swagger
 * /api/invoices/{id}/permanent:
 *   delete:
 *     summary: Permanently delete an invoice
 *     description: Hard deletes the invoice record. Irreversible. Admin only.
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
 *         description: Invoice permanently deleted
 *       404:
 *         description: Invoice not found
 */
export async function DELETE(request: NextRequest, props: { params: Promise<{ id: string }> }) {
  const { id } = await props.params;
  return InvoiceController.permanentDelete(request, id);
}
