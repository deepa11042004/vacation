import { NextRequest, NextResponse } from 'next/server';
import { ClientOfferService } from '@/modules/client-offers/services/client-offer.service';
import { ResponseUtil } from '@/shared/utils/response.util';
import { errorHandler } from '@/shared/middlewares/error.middleware';
import { authenticateRequest, requireRoles } from '@/shared/middlewares/auth.middleware';
import { UserRole } from '@/modules/users/types/user.types';
import { connectDB } from '@/shared/database/sequelize';

const service = new ClientOfferService();

/**
 * @swagger
 * /api/clients/{id}/offers/{offer_id}:
 *   delete:
 *     summary: Delete a client offer
 *     tags: [Clients]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *         description: Client ID
 *       - in: path
 *         name: offer_id
 *         required: true
 *         schema: { type: integer }
 *         description: Offer ID
 *     responses:
 *       200:
 *         description: Offer deleted successfully
 *       404:
 *         description: Offer not found
 */
// DELETE /api/clients/:id/offers/:offer_id
export async function DELETE(
  request: NextRequest,
  props: { params: Promise<{ id: string; offer_id: string }> },
) {
  try {
    await connectDB();
    const currentUser = await authenticateRequest(request);
    requireRoles(currentUser, [UserRole.ADMIN, UserRole.MANAGER]);

    const { offer_id } = await props.params;
    const offerIdNum = parseInt(offer_id, 10);
    if (isNaN(offerIdNum)) return NextResponse.json(ResponseUtil.failure('Invalid offer id'), { status: 400 });

    await service.deleteOffer(offerIdNum);
    return NextResponse.json(ResponseUtil.success('Offer deleted', null));
  } catch (error) {
    return errorHandler(error);
  }
}
