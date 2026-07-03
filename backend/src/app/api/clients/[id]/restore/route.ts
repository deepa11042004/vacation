import { NextRequest } from 'next/server';
import { ClientController } from '@/modules/clients/controllers/client.controller';

/**
 * @swagger
 * /api/clients/{id}/restore:
 *   post:
 *     summary: Restore a soft-deleted client
 *     description: Clears the `deleted_at` timestamp, making the client active again in all queries.
 *     tags: [Clients]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: Client restored successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean, example: true }
 *                 message: { type: string, example: "Client restored successfully" }
 *       400:
 *         description: Client is not deleted or invalid ID
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden — Admin only
 *       404:
 *         description: Client not found
 */
export async function POST(request: NextRequest, props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  return ClientController.restore(request, params.id);
}
