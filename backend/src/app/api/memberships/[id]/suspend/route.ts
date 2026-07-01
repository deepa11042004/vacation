import { NextRequest } from 'next/server';
import { MembershipController } from '@/modules/memberships/controllers/membership.controller';

/**
 * @swagger
 * /api/memberships/{id}/suspend:
 *   post:
 *     summary: Suspend an active membership
 *     description: |
 *       Changes membership status from **ACTIVE** to **SUSPENDED**.
 *       Typically used when a client has a pending overdue balance or breach of terms.
 *       Only ACTIVE memberships can be suspended.
 *       Admin or Manager only.
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
 *         description: Membership suspended successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean, example: true }
 *                 message: { type: string, example: "Membership suspended successfully" }
 *                 data: { nullable: true, example: null }
 *       400:
 *         description: Membership is not in ACTIVE state
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
export async function POST(request: NextRequest, props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  return MembershipController.suspend(request, params.id);
}
