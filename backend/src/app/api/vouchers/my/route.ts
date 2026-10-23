import { NextRequest } from 'next/server';
import { VoucherController } from '@/modules/vouchers/controllers/voucher.controller';

export const dynamic = 'force-dynamic';

/**
 * @swagger
 * /api/vouchers/my:
 *   get:
 *     summary: Vouchers issued to the logged-in client
 *     tags: [Vouchers]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Vouchers retrieved
 *       403:
 *         description: Not a client account
 */
export async function GET(request: NextRequest) {
  return VoucherController.getMine(request);
}
