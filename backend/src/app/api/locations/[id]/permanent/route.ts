import { NextRequest } from 'next/server';
import { LocationController } from '@/modules/locations/controllers/location.controller';

/**
 * @swagger
 * /api/locations/{id}/permanent:
 *   delete:
 *     summary: Permanently delete a location
 *     description: Hard deletes the location record. Irreversible. Admin only.
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
 *         description: Location permanently deleted
 *       404:
 *         description: Location not found
 */
export async function DELETE(request: NextRequest, props: { params: Promise<{ id: string }> }) {
  const { id } = await props.params;
  return LocationController.permanentDelete(request, id);
}
