import { NextRequest } from 'next/server';
import { ItineraryController } from '@/modules/itineraries/controllers/itinerary.controller';

/**
 * @swagger
 * /api/itineraries/{id}:
 *   get:
 *     summary: Get itinerary by ID
 *     tags: [Itineraries]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: Itinerary retrieved successfully
 *       404:
 *         description: Itinerary not found
 *   put:
 *     summary: Update an itinerary
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
 *         description: Itinerary updated successfully
 *   delete:
 *     summary: Soft delete an itinerary
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
 *         description: Itinerary deleted successfully
 */
export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return ItineraryController.getById(request, id);
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return ItineraryController.update(request, id);
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return ItineraryController.delete(request, id);
}
