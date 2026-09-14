import { NextRequest } from 'next/server';
import { VoucherController } from '@/modules/vouchers/controllers/voucher.controller';

/**
 * @swagger
 * /api/vouchers/{id}/resend-email:
 *   post:
 *     summary: Resend voucher email to customer
 *     tags: [Vouchers]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: Voucher email sent successfully
 *       404:
 *         description: Voucher not found
 */
export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return VoucherController.resendEmail(request, id);
}
