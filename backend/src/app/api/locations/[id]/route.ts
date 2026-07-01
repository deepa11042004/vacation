import { NextRequest } from 'next/server';
import { LocationController } from '@/modules/locations/controllers/location.controller';

/**
 * @swagger
 * /api/locations/{id}:
 *   get:
 *     summary: Get location by ID
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
 *         description: Location retrieved successfully
 *       404:
 *         description: Location not found
 *   put:
 *     summary: Update a location
 *     tags: [Locations]
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
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               location_name: { type: string }
 *               country: { type: string }
 *               type: { type: string, enum: [DOMESTIC, INTERNATIONAL] }
 *               map_link: { type: string }
 *               location_image: { type: string }
 *               description: { type: string }
 *               status: { type: string, enum: [ACTIVE, INACTIVE] }
 *               remarks: { type: string }
 *     responses:
 *       200:
 *         description: Location updated successfully
 *   delete:
 *     summary: Soft delete a location
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
 *         description: Location deleted successfully
 *       400:
 *         description: Delete restricted (has hotels)
 */
export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return LocationController.getById(request, id);
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return LocationController.update(request, id);
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return LocationController.delete(request, id);
}
