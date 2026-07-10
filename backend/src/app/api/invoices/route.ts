import { NextRequest } from 'next/server';
import { InvoiceController } from '@/modules/invoices/controllers/invoice.controller';

export const dynamic = 'force-dynamic';

/**
 * @swagger
 * /api/invoices:
 *   get:
 *     summary: List all invoices
 *     description: Returns a paginated list of invoices. Filter by client, type, or date range.
 *     tags: [Invoices]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: query
 *         name: client_id
 *         schema: { type: integer }
 *         description: Filter by client ID
 *       - in: query
 *         name: invoice_type
 *         schema: { type: string, enum: [invoice, tax] }
 *       - in: query
 *         name: search
 *         schema: { type: string }
 *         description: Search by invoice number or client name
 *       - in: query
 *         name: page
 *         schema: { type: integer, default: 1 }
 *       - in: query
 *         name: limit
 *         schema: { type: integer, default: 10 }
 *       - in: query
 *         name: includeDeleted
 *         schema: { type: boolean, default: false }
 *         description: Include soft-deleted invoices
 *     responses:
 *       200:
 *         description: Invoices retrieved successfully
 *       401:
 *         description: Unauthorized
 */
export async function GET(request: NextRequest) {
  return InvoiceController.getAll(request);
}
