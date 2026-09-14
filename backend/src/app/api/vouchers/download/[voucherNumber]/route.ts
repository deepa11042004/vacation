import { NextRequest } from 'next/server';
import { VoucherController } from '@/modules/vouchers/controllers/voucher.controller';

/**
 * @swagger
 * /api/vouchers/download/{voucherNumber}:
 *   get:
 *     summary: Download Voucher PDF by voucher number
 *     tags: [Vouchers]
 *     parameters:
 *       - in: path
 *         name: voucherNumber
 *         required: true
 *         schema: { type: string }
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
export async function GET(request: NextRequest, { params }: { params: Promise<{ voucherNumber: string }> }) {
  const { voucherNumber } = await params;
  return VoucherController.downloadPdfByNumber(request, voucherNumber);
}
