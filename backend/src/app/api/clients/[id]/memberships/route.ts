import { NextRequest } from 'next/server';
import { MembershipController } from '@/modules/memberships/controllers/membership.controller';

/**
 * @swagger
 * /api/clients/{id}/memberships:
 *   get:
 *     summary: Get all memberships for a client
 *     description: |
 *       Returns all membership records belonging to a specific client.
 *       - **CLIENT** role may only fetch their own memberships (`client_id` must match `token.client_id`)
 *       - Returns memberships with package and consultant associations included
 *     tags: [Memberships]
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
 *         description: Client memberships retrieved successfully
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
 *                   example: "Client memberships retrieved successfully"
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Membership'
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden — CLIENT attempting to view another client's memberships
 *       404:
 *         description: Client not found
 */
export async function GET(request: NextRequest, props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  return MembershipController.getByClientId(request, params.id);
}
