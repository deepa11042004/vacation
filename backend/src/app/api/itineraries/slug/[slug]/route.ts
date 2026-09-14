import { NextRequest } from 'next/server';
import { ItineraryController } from '@/modules/itineraries/controllers/itinerary.controller';

/**
 * @swagger
 * /api/itineraries/slug/{slug}:
 *   get:
 *     summary: Get itinerary by slug
 *     tags: [Itineraries]
 *     parameters:
 *       - in: path
 *         name: slug
 *         required: true
 *         schema: { type: string }
 *     responses:
 *       200:
 *         description: Itinerary retrieved successfully
 *       404:
 *         description: Itinerary not found
 */
export async function GET(request: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  return ItineraryController.getBySlug(request, slug);
}
