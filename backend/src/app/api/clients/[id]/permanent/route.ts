import { NextRequest } from 'next/server';
import { ClientController } from '@/modules/clients/controllers/client.controller';

/**
 * @swagger
 * /api/clients/{id}/permanent:
 *   delete:
 *     summary: Permanently delete a client
 *     description: Hard deletes the client and all associated data. Irreversible. Admin only.
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
 *         description: Client permanently deleted
 *       404:
 *         description: Client not found
 */
export async function DELETE(request: NextRequest, props: { params: Promise<{ id: string }> }) {
  const { id } = await props.params;
  return ClientController.permanentDelete(request, id);
}
