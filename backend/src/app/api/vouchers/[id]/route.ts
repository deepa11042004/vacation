import { NextRequest } from 'next/server';
import { VoucherController } from '@/modules/vouchers/controllers/voucher.controller';

/**
 * @swagger
 * /api/vouchers/{id}:
 *   get:
 *     summary: Get voucher details by ID
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
 *         description: Voucher retrieved successfully
 *       404:
 *         description: Voucher not found
 */
export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return VoucherController.getById(request, id);
}
