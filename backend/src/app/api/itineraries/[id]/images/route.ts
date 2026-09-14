import { NextRequest } from 'next/server';
import { ItineraryController } from '@/modules/itineraries/controllers/itinerary.controller';

/**
 * @swagger
 * /api/itineraries/{id}/images:
 *   post:
 *     summary: Upload a gallery image for an itinerary
 *     tags: [Itineraries]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required: [file]
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *               sort_order:
 *                 type: integer
 *                 default: 0
 *     responses:
 *       201:
 *         description: Image uploaded and associated successfully
 *       400:
 *         description: Maximum limit of 12 images reached or file validation error
 */
export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return ItineraryController.uploadImage(request, id);
}
