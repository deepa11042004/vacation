import { NextRequest } from 'next/server';
import { VoucherController } from '@/modules/vouchers/controllers/voucher.controller';

/**
 * @swagger
 * /api/vouchers/{id}/pdf:
 *   get:
 *     summary: Download Voucher PDF by ID
 *     tags: [Vouchers]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: Voucher PDF stream
 *         content:
 *           application/pdf:
 *             schema:
 *               type: string
 *               format: binary
 *       404:
 *         description: Voucher not found
 */
export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return VoucherController.downloadPdf(request, id);
}
