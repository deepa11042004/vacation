import { NextRequest } from 'next/server';
import { PaymentController } from '@/modules/payments/controllers/payment.controller';

/**
 * @swagger
 * /api/clients/{id}/payments:
 *   get:
 *     summary: Get all payments for a client
 *     description: |
 *       Returns the complete payment history for a specific client across all their memberships.
 *       - **CLIENT** role may only fetch their own payment history
 *       - Admin and Manager can fetch for any client
 *     tags: [Payments]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Client ID
 *     responses:
 *       200:
 *         description: Client payments retrieved successfully
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
 *                   example: "Client payments retrieved successfully"
 *                 data:
 *                   type: object
 *                   properties:
 *                     payments:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/Payment'
 *                     total:
 *                       type: integer
 *                       example: 8
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden — CLIENT attempting to view another client's payments
 *       404:
 *         description: Client not found
 */
export async function GET(request: NextRequest, props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  return PaymentController.getByClientId(request, params.id);
}
