import { NextRequest } from 'next/server';
import { ItineraryController } from '@/modules/itineraries/controllers/itinerary.controller';

/**
 * @swagger
 * /api/itineraries/{id}/restore:
 *   patch:
 *     summary: Restore a soft-deleted itinerary
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
 *         description: Itinerary restored successfully
 */
export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return ItineraryController.restore(request, id);
}
