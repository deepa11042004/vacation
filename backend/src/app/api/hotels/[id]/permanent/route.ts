import { NextRequest } from 'next/server';
import { HotelController } from '@/modules/hotels/controllers/hotel.controller';

/**
 * @swagger
 * /api/hotels/{id}/permanent:
 *   delete:
 *     summary: Permanently delete a hotel
 *     description: Hard deletes the hotel record from the database. Irreversible. Admin only.
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
 *         description: Hotel permanently deleted
 *       404:
 *         description: Hotel not found
 */
export async function DELETE(request: NextRequest, props: { params: Promise<{ id: string }> }) {
  const { id } = await props.params;
  return HotelController.permanentDelete(request, id);
}
