import { NextRequest } from 'next/server';
import { MembershipController } from '@/modules/memberships/controllers/membership.controller';

/**
 * @swagger
 * components:
 *   schemas:
 *     Membership:
 *       type: object
 *       properties:
 *         membership_id:
 *           type: integer
 *           example: 1
 *         membership_number:
 *           type: string
 *           example: "MEM-000001"
 *         client_id:
 *           type: integer
 *           example: 1
 *         package_id:
 *           type: integer
 *           example: 2
 *         sale_date:
 *           type: string
 *           format: date
 *           example: "2026-07-01"
 *         start_date:
 *           type: string
 *           format: date
 *           example: "2026-07-01"
 *         end_date:
 *           type: string
 *           format: date
 *           example: "2031-07-01"
 *         nights_remaining:
 *           type: integer
 *           example: 25
 *         nights_per_year:
 *           type: integer
 *           example: 5
 *         total_price:
 *           type: number
 *           format: float
 *           example: 350000.00
 *         discount_amount:
 *           type: number
 *           format: float
 *           example: 20000.00
 *         net_price:
 *           type: number
 *           format: float
 *           example: 330000.00
 *         payment_mode:
 *           type: string
 *           enum: [CASH, CHEQUE, ONLINE, BANK_TRANSFER, CARD]
 *           example: "CHEQUE"
 *         down_payment:
 *           type: number
 *           format: float
 *           example: 100000.00
 *         outstanding_balance:
 *           type: number
 *           format: float
 *           example: 230000.00
 *         sales_consultant_id:
 *           type: integer
 *           nullable: true
 *           example: 3
 *         take_over_manager_id:
 *           type: integer
 *           nullable: true
 *           example: null
 *         dsa:
 *           type: string
 *           enum: [VENUE, CSDO, OTHER]
 *           nullable: true
 *           example: "VENUE"
 *         reference_by:
 *           type: string
 *           nullable: true
 *           example: "John Doe"
 *         status:
 *           type: string
 *           enum: [ACTIVE, SUSPENDED, EXPIRED, CANCELLED]
 *           example: "ACTIVE"
 *         cancellation_reason:
 *           type: string
 *           nullable: true
 *           example: null
 *         remarks:
 *           type: string
 *           nullable: true
 *           example: "Referred by existing member"
 *         created_by:
 *           type: integer
 *           nullable: true
 *         updated_by:
 *           type: integer
 *           nullable: true
 *         created_at:
 *           type: string
 *           format: date-time
 *           example: "2026-07-01T10:00:00.000Z"
 *         updated_at:
 *           type: string
 *           format: date-time
 *           example: "2026-07-01T10:00:00.000Z"
 *         client:
 *           type: object
 *           nullable: true
 *           properties:
 *             client_id: { type: integer, example: 1 }
 *             client_code: { type: string, example: "CLI-000001" }
 *             first_name: { type: string, example: "John" }
 *             last_name: { type: string, example: "Doe" }
 *             email: { type: string, example: "john.doe@example.com" }
 *             mobile: { type: string, example: "9876543210" }
 *         package:
 *           type: object
 *           nullable: true
 *           properties:
 *             package_id: { type: integer, example: 2 }
 *             package_code: { type: string, example: "PKG-000002" }
 *             name: { type: string, example: "Gold 5-Year 1BHK Premium" }
 *             category: { type: string, enum: [SILVER, GOLD, PLATINUM], example: "GOLD" }
 *             unit_type: { type: string, enum: [STUDIO, 1BHK, 2BHK, SUITE], example: "1BHK" }
 *         salesConsultant:
 *           type: object
 *           nullable: true
 *           properties:
 *             user_id: { type: integer }
 *             email: { type: string }
 *         takeOverManager:
 *           type: object
 *           nullable: true
 *           properties:
 *             user_id: { type: integer }
 *             email: { type: string }
 *     MembershipResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: true
 *         message:
 *           type: string
 *           example: "Membership retrieved successfully"
 *         data:
 *           $ref: '#/components/schemas/Membership'
 *     MembershipListResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: true
 *         message:
 *           type: string
 *           example: "Memberships retrieved successfully"
 *         data:
 *           type: object
 *           properties:
 *             memberships:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Membership'
 *             total:
 *               type: integer
 *               example: 25
 *             page:
 *               type: integer
 *               example: 1
 *             limit:
 *               type: integer
 *               example: 10
 */

/**
 * @swagger
 * /api/memberships:
 *   post:
 *     summary: Create a new membership
 *     description: |
 *       Records a membership when a client purchases a package.
 *       - `end_date` is **auto-calculated** from `start_date + package.validity_years`
 *       - `nights_remaining` is **copied** from `package.total_nights`
 *       - `net_price = total_price − discount_amount`
 *       - `outstanding_balance = net_price − down_payment`
 *       - If `down_payment > 0`, a **DOWN_PAYMENT payment record** (`PAY-XXXXXX`) is auto-created in the same DB transaction
 *     tags: [Memberships]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [client_id, package_id, sale_date, start_date, total_price, payment_mode]
 *             properties:
 *               client_id:
 *                 type: integer
 *                 example: 1
 *               package_id:
 *                 type: integer
 *                 example: 2
 *               sale_date:
 *                 type: string
 *                 format: date
 *                 example: "2026-07-01"
 *               start_date:
 *                 type: string
 *                 format: date
 *                 example: "2026-07-01"
 *               total_price:
 *                 type: number
 *                 example: 350000
 *                 description: Negotiated sale price
 *               discount_amount:
 *                 type: number
 *                 example: 20000
 *                 default: 0
 *                 description: Discount given. net_price = total_price - discount_amount
 *               payment_mode:
 *                 type: string
 *                 enum: [CASH, CHEQUE, ONLINE, BANK_TRANSFER, CARD]
 *                 example: "CHEQUE"
 *               down_payment:
 *                 type: number
 *                 example: 100000
 *                 default: 0
 *                 description: Upfront amount. A payment record is auto-created if > 0
 *               sales_consultant_id:
 *                 type: integer
 *                 nullable: true
 *                 example: 3
 *               take_over_manager_id:
 *                 type: integer
 *                 nullable: true
 *                 example: null
 *               dsa:
 *                 type: string
 *                 enum: [VENUE, CSDO, OTHER]
 *                 nullable: true
 *                 example: "VENUE"
 *               reference_by:
 *                 type: string
 *                 nullable: true
 *                 example: "John Smith"
 *               remarks:
 *                 type: string
 *                 nullable: true
 *     responses:
 *       201:
 *         description: Membership created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/MembershipResponse'
 *       400:
 *         description: Validation error (discount > price, down_payment > net_price, etc.)
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiErrorResponse'
 *       401:
 *         description: Unauthorized — missing or invalid token
 *       403:
 *         description: Forbidden — Admin or Manager only
 *       404:
 *         description: Client not found or Package not found / inactive
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiErrorResponse'
 */
export async function POST(request: NextRequest) {
  return MembershipController.create(request);
}

/**
 * @swagger
 * /api/memberships:
 *   get:
 *     summary: List memberships
 *     description: Returns a paginated list of memberships. Filter by client, package, status, or search by membership number.
 *     tags: [Memberships]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: query
 *         name: client_id
 *         schema:
 *           type: integer
 *         description: Filter by client ID
 *       - in: query
 *         name: package_id
 *         schema:
 *           type: integer
 *         description: Filter by package ID
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [ACTIVE, SUSPENDED, EXPIRED, CANCELLED]
 *         description: Filter by membership status
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search by membership_number or reference_by
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
 *         description: Memberships retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/MembershipListResponse'
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden — Admin, Manager, or Agent only
 */
export async function GET(request: NextRequest) {
  return MembershipController.getAll(request);
}
