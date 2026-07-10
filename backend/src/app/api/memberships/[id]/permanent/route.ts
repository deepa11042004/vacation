import { NextRequest } from 'next/server';
import { MembershipController } from '@/modules/memberships/controllers/membership.controller';

/**
 * @swagger
 * /api/memberships/{id}/permanent:
 *   delete:
 *     summary: Permanently delete a membership
 *     description: Hard deletes the membership and all associated payment records. Irreversible. Admin only.
 *     tags: [Memberships]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: Membership permanently deleted
 *       404:
 *         description: Membership not found
 */
export async function DELETE(request: NextRequest, props: { params: Promise<{ id: string }> }) {
  const { id } = await props.params;
  return MembershipController.permanentDelete(request, id);
}
