import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { ClientOfferService } from '@/modules/client-offers/services/client-offer.service';
import { ResponseUtil } from '@/shared/utils/response.util';
import { errorHandler } from '@/shared/middlewares/error.middleware';
import { authenticateRequest, requireRoles } from '@/shared/middlewares/auth.middleware';
import { UserRole } from '@/modules/users/types/user.types';
import { connectDB } from '@/shared/database/sequelize';

const service = new ClientOfferService();

const CreateOfferSchema = z.object({
  offer_name:  z.string().min(1, 'Offer name is required').max(255),
  valid_until: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional().nullable(),
});

/**
 * @swagger
 * /api/clients/{id}/offers:
 *   get:
 *     summary: List client offers
 *     tags: [Clients]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: Offers retrieved successfully
 *   post:
 *     summary: Add an offer to a client
 *     tags: [Clients]
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
 *             required: [offer_name]
 *             properties:
 *               offer_name:  { type: string, example: "Free Night Stay" }
 *               valid_until: { type: string, format: date, example: "2026-12-31" }
 *     responses:
 *       201:
 *         description: Offer added successfully
 */
// GET /api/clients/:id/offers
export async function GET(
  request: NextRequest,
  props: { params: Promise<{ id: string }> },
) {
  try {
    await connectDB();
    const currentUser = await authenticateRequest(request);

    const { id } = await props.params;
    const client_id = parseInt(id, 10);
    if (isNaN(client_id)) return NextResponse.json(ResponseUtil.failure('Invalid client id'), { status: 400 });

    if (currentUser.role === UserRole.CLIENT && currentUser.client_id !== client_id) {
      return NextResponse.json(ResponseUtil.failure('Forbidden: Access denied'), { status: 403 });
    }

    const offers = await service.getByClientId(client_id);
    return NextResponse.json(ResponseUtil.success('Offers fetched', { offers }));
  } catch (error) {
    return errorHandler(error);
  }
}

// POST /api/clients/:id/offers
export async function POST(
  request: NextRequest,
  props: { params: Promise<{ id: string }> },
) {
  try {
    await connectDB();
    const currentUser = await authenticateRequest(request);
    requireRoles(currentUser, [UserRole.ADMIN, UserRole.MANAGER]);

    const { id } = await props.params;
    const client_id = parseInt(id, 10);
    if (isNaN(client_id)) return NextResponse.json(ResponseUtil.failure('Invalid client id'), { status: 400 });

    const body = await request.json();
    const validated = CreateOfferSchema.parse(body);

    const offer = await service.addOffer(client_id, validated);
    return NextResponse.json(ResponseUtil.success('Offer added', { offer }), { status: 201 });
  } catch (error) {
    return errorHandler(error);
  }
}
