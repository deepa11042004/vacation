import { NextRequest } from 'next/server';
import { PaymentController } from '@/modules/payments/controllers/payment.controller';

/**
 * @swagger
 * /api/memberships/{id}/payments:
 *   get:
 *     summary: Get all payments for a membership
 *     description: Returns the full payment history for a specific membership ordered by payment_date descending. Admin, Manager, or Agent only.
 *     tags: [Payments]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Membership ID
 *     responses:
 *       200:
 *         description: Payments retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Payments retrieved successfully"
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Payment'
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Membership not found
 */
export async function GET(request: NextRequest, props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  return PaymentController.getByMembershipId(request, params.id);
}
