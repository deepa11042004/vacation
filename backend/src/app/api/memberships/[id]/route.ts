import { NextRequest } from 'next/server';
import { MembershipController } from '@/modules/memberships/controllers/membership.controller';

/**
 * @swagger
 * /api/memberships/{id}:
 *   get:
 *     summary: Get membership by ID
 *     description: Returns full membership detail including client, package, and consultant associations. CLIENT role may only fetch their own membership.
 *     tags: [Memberships]
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
 *         description: Membership retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/MembershipResponse'
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden — CLIENT trying to access another client's membership
 *       404:
 *         description: Membership not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiErrorResponse'
 */
export async function GET(request: NextRequest, props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  return MembershipController.getById(request, params.id);
}

/**
 * @swagger
 * /api/memberships/{id}:
 *   put:
 *     summary: Update membership details
 *     description: |
 *       Update editable fields on a membership.
 *       - **Status changes** must use dedicated endpoints (`/cancel`, `/suspend`, `/reactivate`)
 *       - If `total_price` or `discount_amount` changes, `net_price` and `outstanding_balance` are **recalculated automatically**
 *       - If `start_date` changes, `end_date` is **recalculated** from the package's validity_years
 *     tags: [Memberships]
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
 *               sale_date:
 *                 type: string
 *                 format: date
 *               start_date:
 *                 type: string
 *                 format: date
 *                 description: Re-triggers end_date recalculation
 *               total_price:
 *                 type: number
 *                 example: 360000
 *               discount_amount:
 *                 type: number
 *                 example: 25000
 *               payment_mode:
 *                 type: string
 *                 enum: [CASH, CHEQUE, ONLINE, BANK_TRANSFER, CARD]
 *               sales_consultant_id:
 *                 type: integer
 *                 nullable: true
 *               take_over_manager_id:
 *                 type: integer
 *                 nullable: true
 *               dsa:
 *                 type: string
 *                 enum: [VENUE, CSDO, OTHER]
 *                 nullable: true
 *               reference_by:
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
 *         description: Membership updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/MembershipResponse'
 *       400:
 *         description: Validation error
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
export async function PUT(request: NextRequest, props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  return MembershipController.update(request, params.id);
}

/**
 * @swagger
 * /api/memberships/{id}:
 *   delete:
 *     summary: Soft delete a membership
 *     description: Soft deletes the membership record (sets deleted_at). The membership data is retained and can be restored. Admin only.
 *     tags: [Memberships]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Membership deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean, example: true }
 *                 message: { type: string, example: "Membership deleted successfully" }
 *                 data: { nullable: true, example: null }
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden — Admin only
 *       404:
 *         description: Membership not found
 */
export async function DELETE(request: NextRequest, props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  return MembershipController.delete(request, params.id);
}
