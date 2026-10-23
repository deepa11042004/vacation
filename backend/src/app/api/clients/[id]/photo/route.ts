import { NextRequest, NextResponse } from 'next/server';
import { ClientPhotoService } from '@/modules/clients/services/client-photo.service';
import { ResponseUtil } from '@/shared/utils/response.util';
import { errorHandler, AppError } from '@/shared/middlewares/error.middleware';
import { authenticateRequest } from '@/shared/middlewares/auth.middleware';
import { UserRole } from '@/modules/users/types/user.types';
import { connectDB } from '@/shared/database/sequelize';

export const dynamic = 'force-dynamic';

const service = new ClientPhotoService();

/** Admins/managers can change any client photo; a client can only change their own. */
async function authorize(request: NextRequest, idStr: string) {
  const currentUser = await authenticateRequest(request);
  const clientId = parseInt(idStr, 10);
  if (isNaN(clientId) || clientId <= 0) throw new AppError('Invalid client id', 400);

  const isStaff = currentUser.role === UserRole.ADMIN || currentUser.role === UserRole.MANAGER;
  const isOwner = currentUser.role === UserRole.CLIENT && currentUser.client_id === clientId;
  if (!isStaff && !isOwner) throw new AppError('Forbidden: Access denied', 403);
  return clientId;
}

/**
 * @swagger
 * /api/clients/{id}/photo:
 *   post:
 *     summary: Upload or replace a client's profile photo
 *     description: multipart/form-data with a `file` field (JPG, PNG or WebP, max 2 MB). Admin / Manager, or the client themself.
 *     tags: [Clients]
 *     security:
 *       - BearerAuth: []
 *   delete:
 *     summary: Remove a client's profile photo
 *     tags: [Clients]
 *     security:
 *       - BearerAuth: []
 */
export async function POST(request: NextRequest, props: { params: Promise<{ id: string }> }) {
  try {
    await connectDB();
    const { id } = await props.params;
    const clientId = await authorize(request, id);

    const formData = await request.formData();
    const file = formData.get('file') as File | null;
    if (!file || typeof file === 'string') throw new AppError('Photo file is required', 400);

    const profile_photo = await service.setPhoto(clientId, file);
    return NextResponse.json(ResponseUtil.success('Photo updated', { profile_photo }));
  } catch (error) {
    return errorHandler(error);
  }
}

export async function DELETE(request: NextRequest, props: { params: Promise<{ id: string }> }) {
  try {
    await connectDB();
    const { id } = await props.params;
    const clientId = await authorize(request, id);
    await service.removePhoto(clientId);
    return NextResponse.json(ResponseUtil.success('Photo removed', { profile_photo: null }));
  } catch (error) {
    return errorHandler(error);
  }
}
