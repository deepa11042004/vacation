import { NextRequest } from 'next/server';
import { PaymentController } from '@/modules/payments/controllers/payment.controller';

/**
 * @swagger
 * components:
 *   schemas:
 *     Payment:
 *       type: object
 *       properties:
 *         payment_id:
 *           type: integer
 *           example: 1
 *         payment_number:
 *           type: string
 *           example: "PAY-000001"
 *         membership_id:
 *           type: integer
 *           example: 1
 *         client_id:
 *           type: integer
 *           example: 1
 *         payment_type:
 *           type: string
 *           enum: [DOWN_PAYMENT, INSTALMENT, AMC, PENALTY, REFUND]
 *           example: "INSTALMENT"
 *           description: |
 *             - **DOWN_PAYMENT**: First payment at time of membership creation (auto-created if down_payment > 0)
 *             - **INSTALMENT**: Any subsequent partial payment towards the outstanding balance
 *             - **AMC**: Annual maintenance charge payment
 *             - **PENALTY**: Late fee or penalty charge
 *             - **REFUND**: Refund issued to client (increases outstanding balance)
 *         amount:
 *           type: number
 *           format: float
 *           example: 50000.00
 *         payment_date:
 *           type: string
 *           format: date
 *           example: "2026-08-15"
 *         due_date:
 *           type: string
 *           format: date
 *           nullable: true
 *           example: "2026-08-01"
 *           description: Expected date — used to identify overdue payments when payment_date is null
 *         payment_mode:
 *           type: string
 *           enum: [CASH, CHEQUE, ONLINE, BANK_TRANSFER, CARD]
 *           example: "CHEQUE"
 *         transaction_ref:
 *           type: string
 *           nullable: true
 *           example: "CHQ-112233"
 *           description: Cheque number, UTR, or online transaction ID
 *         bank_name:
 *           type: string
 *           nullable: true
 *           example: "HDFC Bank"
 *         status:
 *           type: string
 *           enum: [PENDING, PAID, CANCELLED]
 *           example: "PAID"
 *           description: |
 *             - **PENDING**: Payment is expected but amount not yet received
 *             - **PAID**: Amount received and confirmed — decrements membership outstanding_balance
 *             - **CANCELLED**: Payment voided — balance is restored
 *         remarks:
 *           type: string
 *           nullable: true
 *           example: "Cheque received on 15-Aug-2026"
 *         created_by:
 *           type: integer
 *           nullable: true
 *         updated_by:
 *           type: integer
 *           nullable: true
 *         created_at:
 *           type: string
 *           format: date-time
 *         updated_at:
 *           type: string
 *           format: date-time
 *         membership:
 *           type: object
 *           nullable: true
 *           properties:
 *             membership_id: { type: integer, example: 1 }
 *             membership_number: { type: string, example: "MEM-000001" }
 *         client:
 *           type: object
 *           nullable: true
 *           properties:
 *             client_id: { type: integer, example: 1 }
 *             client_code: { type: string, example: "CLI-000001" }
 *             first_name: { type: string, example: "John" }
 *             last_name: { type: string, example: "Doe" }
 *     PaymentResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: true
 *         message:
 *           type: string
 *           example: "Payment recorded successfully"
 *         data:
 *           $ref: '#/components/schemas/Payment'
 *     PaymentListResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: true
 *         message:
 *           type: string
 *           example: "Payments retrieved successfully"
 *         data:
 *           type: object
 *           properties:
 *             payments:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Payment'
 *             total:
 *               type: integer
 *               example: 12
 *             page:
 *               type: integer
 *               example: 1
 *             limit:
 *               type: integer
 *               example: 10
 */

/**
 * @swagger
 * /api/payments:
 *   post:
 *     summary: Record a payment
 *     description: |
 *       Manually records a payment against a membership.
 *       **No EMI** — each payment is entered individually by admin/manager.
 *
 *       **Balance update rules (applied atomically):**
 *       - `PAID` + non-REFUND → `outstanding_balance -= amount`
 *       - `PAID` + REFUND → `outstanding_balance += amount`
 *       - `PENDING` → no balance change
 *
 *       **Validation:**
 *       - `INSTALMENT` / `DOWN_PAYMENT` / `AMC` / `PENALTY` amounts cannot exceed the current `outstanding_balance`
 *       - `REFUND` amount cannot exceed total already paid on the membership
 *     tags: [Payments]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [membership_id, client_id, payment_type, amount, payment_date, payment_mode]
 *             properties:
 *               membership_id:
 *                 type: integer
 *                 example: 1
 *               client_id:
 *                 type: integer
 *                 example: 1
 *               payment_type:
 *                 type: string
 *                 enum: [DOWN_PAYMENT, INSTALMENT, AMC, PENALTY, REFUND]
 *                 example: "INSTALMENT"
 *               amount:
 *                 type: number
 *                 example: 50000
 *               payment_date:
 *                 type: string
 *                 format: date
 *                 example: "2026-08-15"
 *               due_date:
 *                 type: string
 *                 format: date
 *                 nullable: true
 *                 example: "2026-08-01"
 *               payment_mode:
 *                 type: string
 *                 enum: [CASH, CHEQUE, ONLINE, BANK_TRANSFER, CARD]
 *                 example: "CHEQUE"
 *               transaction_ref:
 *                 type: string
 *                 nullable: true
 *                 example: "CHQ-112233"
 *               bank_name:
 *                 type: string
 *                 nullable: true
 *                 example: "HDFC Bank"
 *               status:
 *                 type: string
 *                 enum: [PENDING, PAID, CANCELLED]
 *                 default: "PAID"
 *                 description: Defaults to PAID. Use PENDING to log an expected payment not yet received.
 *               remarks:
 *                 type: string
 *                 nullable: true
 *               created_by:
 *                 type: integer
 *                 nullable: true
 *     responses:
 *       201:
 *         description: Payment recorded successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PaymentResponse'
 *       400:
 *         description: Amount exceeds outstanding balance, or refund exceeds total paid
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiErrorResponse'
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden — Admin or Manager only
 *       404:
 *         description: Membership not found
 */
export async function POST(request: NextRequest) {
  return PaymentController.create(request);
}

/**
 * @swagger
 * /api/payments:
 *   get:
 *     summary: List payments
 *     description: Returns paginated payment records. Filter by membership, client, type, status, or date range. Admin or Manager only.
 *     tags: [Payments]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: query
 *         name: membership_id
 *         schema:
 *           type: integer
 *         description: Filter by membership
 *       - in: query
 *         name: client_id
 *         schema:
 *           type: integer
 *         description: Filter by client
 *       - in: query
 *         name: payment_type
 *         schema:
 *           type: string
 *           enum: [DOWN_PAYMENT, INSTALMENT, AMC, PENALTY, REFUND]
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [PENDING, PAID, CANCELLED]
 *       - in: query
 *         name: from_date
 *         schema:
 *           type: string
 *           format: date
 *         description: Filter payments on or after this date (payment_date)
 *         example: "2026-01-01"
 *       - in: query
 *         name: to_date
 *         schema:
 *           type: string
 *           format: date
 *         description: Filter payments on or before this date (payment_date)
 *         example: "2026-12-31"
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *     responses:
 *       200:
 *         description: Payments retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PaymentListResponse'
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden — Admin or Manager only
 */
export async function GET(request: NextRequest) {
  return PaymentController.getAll(request);
}
