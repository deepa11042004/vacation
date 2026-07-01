import { NextRequest } from 'next/server';
import { HotelController } from '@/modules/hotels/controllers/hotel.controller';

/**
 * @swagger
 * /api/hotels/{id}/images:
 *   post:
 *     summary: Upload an image for a hotel
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
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required: [file]
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *                 description: Image file to upload (JPEG, PNG, WEBP)
 *               sort_order:
 *                 type: integer
 *                 default: 0
 *     responses:
 *       201:
 *         description: Image uploaded and associated successfully
 *       400:
 *         description: Maximum limit of 6 images reached or file validation error
 */
export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return HotelController.uploadImage(request, id);
}
