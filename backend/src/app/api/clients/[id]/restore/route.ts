import { NextRequest } from 'next/server';
import { ClientController } from '@/modules/clients/controllers/client.controller';

/**
 * @swagger
 * /api/clients/{id}/restore:
 *   patch:
 *     summary: Restore a soft-deleted client
 *     tags: [Clients]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: string, format: uuid }
 *     responses:
 *       200:
 *         description: Client restored successfully
 *       404:
 *         description: Client not found
 */
export async function PATCH(request: NextRequest, props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  return ClientController.restore(request, params.id);
}
