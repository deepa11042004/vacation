import { NextRequest } from 'next/server';
import { VoucherController } from '@/modules/vouchers/controllers/voucher.controller';

/**
 * @swagger
 * /api/vouchers/redeem:
 *   post:
 *     summary: Public voucher verification and redemption
 *     tags: [Vouchers]
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [voucherNumber]
 *             properties:
 *               voucherNumber: { type: string, example: "81714091628" }
 *     responses:
 *       200:
 *         description: Voucher redeemed successfully
 *       400:
 *         description: Invalid, expired, or already redeemed voucher
 */
export async function POST(request: NextRequest) {
  return VoucherController.redeem(request);
}
