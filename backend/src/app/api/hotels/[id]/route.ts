import { NextRequest } from 'next/server';
import { HotelController } from '@/modules/hotels/controllers/hotel.controller';

/**
 * @swagger
 * /api/hotels/{id}:
 *   get:
 *     summary: Get hotel by ID
 *     tags: [Hotels]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: Hotel retrieved successfully
 *       404:
 *         description: Hotel not found
 *   put:
 *     summary: Update a hotel
 *     tags: [Hotels]
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
 *               location_id: { type: integer }
 *               hotel_name: { type: string }
 *               property_type: { type: string, enum: [INTERNAL_PROPERTY, ASSOCIATED_PROPERTY] }
 *               hotel_type: { type: string, enum: [HOTEL, RESORT, VILLA, APARTMENT, HOMESTAY, GUEST_HOUSE] }
 *               address: { type: string }
 *               map_link: { type: string }
 *               description: { type: string }
 *               status: { type: string, enum: [ACTIVE, INACTIVE] }
 *               remarks: { type: string }
 *     responses:
 *       200:
 *         description: Hotel updated successfully
 *   delete:
 *     summary: Soft delete a hotel
 *     tags: [Hotels]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: Hotel deleted successfully
 */
export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return HotelController.getById(request, id);
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return HotelController.update(request, id);
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return HotelController.delete(request, id);
}
