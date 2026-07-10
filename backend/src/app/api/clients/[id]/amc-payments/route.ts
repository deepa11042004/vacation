import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { AmcPaymentService } from '@/modules/amc-payments/services/amc-payment.service';
import { ResponseUtil } from '@/shared/utils/response.util';
import { errorHandler } from '@/shared/middlewares/error.middleware';
import { authenticateRequest, requireRoles } from '@/shared/middlewares/auth.middleware';
import { UserRole } from '@/modules/users/types/user.types';
import { connectDB } from '@/shared/database/sequelize';

const service = new AmcPaymentService();

const UpsertSchema = z.object({
  membership_id: z.number().int().positive(),
  year_number:   z.number().int().positive(),
  amount:        z.number().min(0).optional().nullable(),
  is_received:   z.boolean(),
  payment_date:  z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional().nullable(),
  payment_mode:  z.string().max(100).optional().nullable(),
});

/**
 * @swagger
 * /api/clients/{id}/amc-payments:
 *   get:
 *     summary: List AMC payments for a client
 *     description: Returns annual maintenance charge (AMC) payment records for all memberships of a client.
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
 *         description: AMC payments retrieved successfully
 *   post:
 *     summary: Upsert an AMC payment record
 *     description: Creates or updates an AMC payment for a specific membership year. Admin / Manager only.
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
 *             required: [membership_id, year_number, is_received]
 *             properties:
 *               membership_id: { type: integer }
 *               year_number:   { type: integer, example: 1 }
 *               is_received:   { type: boolean }
 *               amount:        { type: number, nullable: true }
 *               payment_date:  { type: string, format: date, nullable: true }
 *               payment_mode:  { type: string, nullable: true }
 *     responses:
 *       200:
 *         description: AMC payment saved successfully
 */
export async function GET(
  request: NextRequest,
  props: { params: Promise<{ id: string }> },
) {
  try {
    await connectDB();
    const currentUser = await authenticateRequest(request);

    const { id } = await props.params;
    const clientId = parseInt(id, 10);
    if (isNaN(clientId)) return NextResponse.json(ResponseUtil.failure('Invalid client id'), { status: 400 });

    if (currentUser.role === UserRole.CLIENT && currentUser.client_id !== clientId) {
      return NextResponse.json(ResponseUtil.failure('Forbidden: Access denied'), { status: 403 });
    }

    requireRoles(currentUser, [UserRole.ADMIN, UserRole.MANAGER, UserRole.CLIENT]);

    const payments = await service.getByClientId(clientId);
    return NextResponse.json(ResponseUtil.success('AMC payments fetched', { payments }));
  } catch (error) {
    return errorHandler(error);
  }
}

export async function POST(
  request: NextRequest,
  props: { params: Promise<{ id: string }> },
) {
  try {
    await connectDB();
    const currentUser = await authenticateRequest(request);
    requireRoles(currentUser, [UserRole.ADMIN, UserRole.MANAGER]);

    const { id } = await props.params;
    const clientId = parseInt(id, 10);
    if (isNaN(clientId)) return NextResponse.json(ResponseUtil.failure('Invalid client id'), { status: 400 });

    const body = await request.json();
    const validated = UpsertSchema.parse(body);
    const payment = await service.upsert(clientId, validated);
    return NextResponse.json(ResponseUtil.success('AMC payment saved', { payment }));
  } catch (error) {
    return errorHandler(error);
  }
}
