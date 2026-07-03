import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { connectDB } from '@/shared/database/sequelize';
import { authenticateRequest, requireRoles } from '@/shared/middlewares/auth.middleware';
import { errorHandler, AppError } from '@/shared/middlewares/error.middleware';
import { ResponseUtil } from '@/shared/utils/response.util';
import { ClientService } from '@/modules/clients/services/client.service';
import { UserRole } from '@/modules/users/types/user.types';

const clientService = new ClientService();

const AddressSchema = z.object({
  primary_address:   z.string().optional().nullable(),
  primary_state:     z.string().max(100).optional().nullable(),
  primary_pincode:   z.string().max(20).optional().nullable(),
  secondary_address: z.string().optional().nullable(),
  secondary_state:   z.string().max(100).optional().nullable(),
  secondary_pincode: z.string().max(20).optional().nullable(),
});

/**
 * @swagger
 * /api/clients/{id}/address:
 *   get:
 *     summary: Get a client's address
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
 *         description: Address retrieved (null if none saved yet)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean, example: true }
 *                 message: { type: string, example: "Address retrieved" }
 *                 data:
 *                   nullable: true
 *                   type: object
 *                   properties:
 *                     address_id:        { type: integer }
 *                     client_id:         { type: integer }
 *                     primary_address:   { type: string, nullable: true }
 *                     primary_state:     { type: string, nullable: true }
 *                     primary_pincode:   { type: string, nullable: true }
 *                     secondary_address: { type: string, nullable: true }
 *                     secondary_state:   { type: string, nullable: true }
 *                     secondary_pincode: { type: string, nullable: true }
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden — Admin or Manager only
 *       404:
 *         description: Client not found
 */
export async function GET(request: NextRequest, props: { params: Promise<{ id: string }> }) {
  try {
    await connectDB();
    const currentUser = await authenticateRequest(request);
    requireRoles(currentUser, [UserRole.ADMIN, UserRole.MANAGER]);
    const { id } = await props.params;
    const client_id = parseInt(id, 10);
    if (isNaN(client_id) || client_id <= 0) throw new AppError('Invalid client ID', 400);
    const result = await clientService.getAddress(client_id);
    return NextResponse.json(ResponseUtil.success('Address retrieved', result), { status: 200 });
  } catch (error) {
    return errorHandler(error);
  }
}

/**
 * @swagger
 * /api/clients/{id}/address:
 *   put:
 *     summary: Create or update a client's address
 *     description: Upserts the address record — creates it on first call, updates it on subsequent calls.
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
 *             properties:
 *               primary_address:   { type: string, nullable: true }
 *               primary_state:     { type: string, maxLength: 100, nullable: true }
 *               primary_pincode:   { type: string, maxLength: 20, nullable: true }
 *               secondary_address: { type: string, nullable: true }
 *               secondary_state:   { type: string, maxLength: 100, nullable: true }
 *               secondary_pincode: { type: string, maxLength: 20, nullable: true }
 *     responses:
 *       200:
 *         description: Address saved successfully
 *       400:
 *         description: Validation error or invalid client ID
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden — Admin or Manager only
 *       404:
 *         description: Client not found
 */
export async function PUT(request: NextRequest, props: { params: Promise<{ id: string }> }) {
  try {
    await connectDB();
    const currentUser = await authenticateRequest(request);
    requireRoles(currentUser, [UserRole.ADMIN, UserRole.MANAGER]);

    const { id } = await props.params;
    const client_id = parseInt(id, 10);
    if (isNaN(client_id) || client_id <= 0) throw new AppError('Invalid client ID', 400);

    const body = await request.json();
    const data = AddressSchema.parse(body);
    const result = await clientService.upsertAddress(client_id, data);

    return NextResponse.json(ResponseUtil.success('Address saved successfully', result), { status: 200 });
  } catch (error) {
    return errorHandler(error);
  }
}
