import { NextRequest } from 'next/server';
import { PaymentController } from '@/modules/payments/controllers/payment.controller';

/**
 * @swagger
 * /api/payments/{id}:
 *   get:
 *     summary: Get payment by ID
 *     description: Returns full payment detail including membership and client associations. Admin, Manager, or Agent only.
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
 *         description: Payment retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PaymentResponse'
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Payment not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiErrorResponse'
 */
export async function GET(request: NextRequest, props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  return PaymentController.getById(request, params.id);
}

/**
 * @swagger
 * /api/payments/{id}:
 *   put:
 *     summary: Update payment details
 *     description: |
 *       Admin only. Updates non-status fields on a payment.
 *       - Cancelled payments **cannot** be updated
 *       - If `amount` changes on a **PAID** payment, the membership `outstanding_balance` is **automatically rebalanced** (new_amount − old_amount applied as delta)
 *     tags: [Payments]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               payment_type:
 *                 type: string
 *                 enum: [DOWN_PAYMENT, INSTALMENT, AMC, PENALTY, REFUND]
 *               amount:
 *                 type: number
 *                 example: 55000
 *                 description: Changing this rebalances the membership outstanding_balance
 *               payment_date:
 *                 type: string
 *                 format: date
 *               due_date:
 *                 type: string
 *                 format: date
 *                 nullable: true
 *               payment_mode:
 *                 type: string
 *                 enum: [CASH, CHEQUE, ONLINE, BANK_TRANSFER, CARD]
 *               transaction_ref:
 *                 type: string
 *                 nullable: true
 *               bank_name:
 *                 type: string
 *                 nullable: true
 *               remarks:
 *                 type: string
 *                 nullable: true
 *               updated_by:
 *                 type: integer
 *                 nullable: true
 *     responses:
 *       200:
 *         description: Payment updated successfully
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
export async function PUT(request: NextRequest, props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  return PaymentController.update(request, params.id);
}
