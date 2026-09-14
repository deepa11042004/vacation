import { NextRequest } from 'next/server';
import { ItineraryController } from '@/modules/itineraries/controllers/itinerary.controller';

/**
 * @swagger
 * /api/itineraries/{id}/permanent:
 *   delete:
 *     summary: Permanently delete an itinerary
 *     description: Hard deletes the itinerary record. Irreversible. Admin only.
 *     tags: [Itineraries]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: Itinerary permanently deleted
 *       404:
 *         description: Itinerary not found
 */
export async function DELETE(request: NextRequest, props: { params: Promise<{ id: string }> }) {
  const { id } = await props.params;
  return ItineraryController.permanentDelete(request, id);
}
