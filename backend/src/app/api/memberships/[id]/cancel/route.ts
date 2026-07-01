import { NextRequest } from 'next/server';
import { MembershipController } from '@/modules/memberships/controllers/membership.controller';

/**
 * @swagger
 * /api/memberships/{id}/cancel:
 *   post:
 *     summary: Cancel a membership
 *     description: |
 *       Sets membership status to **CANCELLED**. A cancellation reason is required.
 *       Once cancelled, the membership cannot be reactivated — only restored from soft-delete.
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
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [cancellation_reason]
 *             properties:
 *               cancellation_reason:
 *                 type: string
 *                 example: "Client requested cancellation due to relocation"
 *               updated_by:
 *                 type: integer
 *                 nullable: true
 *     responses:
 *       200:
 *         description: Membership cancelled successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean, example: true }
 *                 message: { type: string, example: "Membership cancelled successfully" }
 *                 data: { nullable: true, example: null }
 *       400:
 *         description: Membership is already cancelled
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
  return MembershipController.cancel(request, params.id);
}
