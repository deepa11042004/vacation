import { NextRequest } from 'next/server';
import { HotelController } from '@/modules/hotels/controllers/hotel.controller';

/**
 * @swagger
 * /api/hotels/{id}/images/{imageId}:
 *   delete:
 *     summary: Delete a hotel image
 *     tags: [Hotels]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *       - in: path
 *         name: imageId
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: Image deleted successfully
 *       404:
 *         description: Image not found
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; imageId: string }> }
) {
  const { id, imageId } = await params;
  return HotelController.deleteImage(request, id, imageId);
}
