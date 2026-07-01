import { NextRequest } from 'next/server';
import { PaymentController } from '@/modules/payments/controllers/payment.controller';

/**
 * @swagger
 * /api/payments/{id}/cancel:
 *   post:
 *     summary: Cancel a payment
 *     description: |
 *       Sets the payment status to **CANCELLED**. Admin only.
 *
 *       **Balance restoration (automatic):**
 *       - If the payment was `PAID` + non-REFUND → `outstanding_balance += amount` (money reversed)
 *       - If the payment was `PAID` + REFUND → `outstanding_balance -= amount` (refund reversed)
 *       - If payment was `PENDING` → no balance change
 *     tags: [Payments]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Payment ID
 *     responses:
 *       200:
 *         description: Payment cancelled and membership balance restored
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PaymentResponse'
 *       400:
 *         description: Payment is already cancelled
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiErrorResponse'
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden — Admin only
 *       404:
 *         description: Payment not found
 */
export async function POST(request: NextRequest, props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  return PaymentController.cancel(request, params.id);
}
