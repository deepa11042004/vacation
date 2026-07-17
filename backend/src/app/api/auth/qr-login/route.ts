import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/shared/database/sequelize';
import { ClientRepository } from '@/modules/clients/repositories/client.repository';
import { User } from '@/modules/users/models/User.model';
import { JwtUtil } from '@/shared/utils/jwt.util';
import { ResponseUtil } from '@/shared/utils/response.util';
import { errorHandler, AppError } from '@/shared/middlewares/error.middleware';
import { UserStatus } from '@/modules/users/types/user.types';

const clientRepo = new ClientRepository();

export async function GET(req: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);
    const token = searchParams.get('token');
    if (!token) throw new AppError('QR token is required', 400);

    // Find client by QR token
    const client = await clientRepo.findByQrToken(token);
    if (!client) throw new AppError('Invalid or unrecognised QR code', 404);

    // Find the user account linked to this client
    const user = await User.findOne({ where: { client_id: client.client_id } });
    if (!user) throw new AppError('No user account linked to this client', 404);

    if (user.status !== UserStatus.ACTIVE) {
      throw new AppError('This account is inactive', 403);
    }

    // Parse allowed_sections
    let allowedSections: string[] | null = null;
    if (user.allowed_sections) {
      try { allowedSections = JSON.parse(user.allowed_sections as unknown as string); } catch { allowedSections = null; }
    }

    const tokenPayload = {
      user_id: user.user_id,
      email: user.email,
      role: user.role,
      client_id: user.client_id || null,
      allowed_sections: allowedSections,
    };

    const accessToken = JwtUtil.generateAccessToken(tokenPayload);
    const refreshToken = JwtUtil.generateRefreshToken(tokenPayload);

    // Persist the new refresh token
    await User.update({ refresh_token: refreshToken }, { where: { user_id: user.user_id } });

    const userJson: Record<string, unknown> = user.toJSON() as unknown as Record<string, unknown>;
    delete userJson.password;
    delete userJson.refresh_token;
    if (typeof userJson.allowed_sections === 'string') {
      try { userJson.allowed_sections = JSON.parse(userJson.allowed_sections); } catch { userJson.allowed_sections = null; }
    }

    return NextResponse.json(
      ResponseUtil.success('QR login successful', { accessToken, refreshToken, user: userJson }),
      { status: 200 },
    );
  } catch (error) {
    return errorHandler(error);
  }
}
