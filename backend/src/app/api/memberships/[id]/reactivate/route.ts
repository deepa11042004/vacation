import { NextRequest } from 'next/server';
import { MembershipController } from '@/modules/memberships/controllers/membership.controller';

/**
 * @swagger
 * /api/memberships/{id}/reactivate:
 *   post:
 *     summary: Reactivate a suspended membership
 *     description: |
 *       Changes membership status from **SUSPENDED** back to **ACTIVE**.
 *       Only SUSPENDED memberships can be reactivated.
 *       Admin only.
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
 *         description: Membership reactivated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean, example: true }
 *                 message: { type: string, example: "Membership reactivated successfully" }
 *                 data: { nullable: true, example: null }
 *       400:
 *         description: Membership is not in SUSPENDED state
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiErrorResponse'
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden — Admin only
 *       404:
 *         description: Membership not found
 */
export async function POST(request: NextRequest, props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  return MembershipController.reactivate(request, params.id);
}
