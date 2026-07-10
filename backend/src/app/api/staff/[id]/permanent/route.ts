import { NextRequest } from 'next/server';
import { StaffController } from '@/modules/staff/controllers/staff.controller';

type Props = { params: Promise<{ id: string }> };

/**
 * @swagger
 * /api/staff/{id}/permanent:
 *   delete:
 *     summary: Permanently delete a staff member
 *     description: Hard deletes the staff record. Irreversible. Admin only.
 *     tags: [Staff]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: Staff member permanently deleted
 *       404:
 *         description: Staff member not found
 */
export const DELETE = async (req: NextRequest, p: Props) => StaffController.permanentDelete(req, (await p.params).id);
