import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/shared/database/sequelize';
import { ClientRepository } from '@/modules/clients/repositories/client.repository';
import { ResponseUtil } from '@/shared/utils/response.util';
import { errorHandler, AppError } from '@/shared/middlewares/error.middleware';
import { authenticateRequest, requireRoles } from '@/shared/middlewares/auth.middleware';
import { UserRole } from '@/modules/users/types/user.types';

const clientRepo = new ClientRepository();

export async function POST(req: NextRequest, props: { params: Promise<{ id: string }> }) {
  try {
    await connectDB();
    const currentUser = await authenticateRequest(req);
    requireRoles(currentUser, [UserRole.ADMIN, UserRole.MANAGER]);

    const { id } = await props.params;
    const client_id = parseInt(id, 10);
    if (isNaN(client_id) || client_id <= 0) throw new AppError('Invalid client ID', 400);

    const client = await clientRepo.findById(client_id);
    if (!client) throw new AppError('Client not found', 404);

    const token = await clientRepo.generateQrToken(client_id);
    const qrUrl = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/auth/qr-login?token=${token}`;

    return NextResponse.json(
      ResponseUtil.success('QR token generated', { qr_token: token, qr_url: qrUrl }),
      { status: 200 },
    );
  } catch (error) {
    return errorHandler(error);
  }
}
