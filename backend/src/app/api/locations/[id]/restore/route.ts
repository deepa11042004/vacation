import { NextRequest } from 'next/server';
import { LocationController } from '@/modules/locations/controllers/location.controller';

/**
 * @swagger
 * /api/locations/{id}/restore:
 *   patch:
 *     summary: Restore a soft-deleted location
 *     tags: [Locations]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: Location restored successfully
 */
export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return LocationController.restore(request, id);
}
