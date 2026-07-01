import { NextRequest, NextResponse } from 'next/server';
import { AuthService } from '../services/auth.service';
import { LoginSchema, TokenRefreshSchema } from '../validators/auth.validator';
import { ResponseUtil } from '../../../shared/utils/response.util';
import { errorHandler } from '../../../shared/middlewares/error.middleware';
import { connectDB } from '../../../shared/database/sequelize';
import { authenticateRequest } from '../../../shared/middlewares/auth.middleware';

const authService = new AuthService();

export class AuthController {
  static async login(req: NextRequest) {
    try {
      await connectDB();
      const body = await req.json();
      const validatedData = LoginSchema.parse(body);
      const result = await authService.login(validatedData);

      return NextResponse.json(
        ResponseUtil.success('Logged in successfully', result),
        { status: 200 }
      );
    } catch (error) {
      return errorHandler(error);
    }
  }

  static async refresh(req: NextRequest) {
    try {
      await connectDB();
      const body = await req.json();
      const validatedData = TokenRefreshSchema.parse(body);
      const result = await authService.refresh(validatedData.refresh_token);

      return NextResponse.json(
        ResponseUtil.success('Token refreshed successfully', result),
        { status: 200 }
      );
    } catch (error) {
      return errorHandler(error);
    }
  }

  static async logout(req: NextRequest) {
    try {
      await connectDB();
      const currentUser = await authenticateRequest(req);
      const result = await authService.logout(currentUser.user_id);

      return NextResponse.json(
        ResponseUtil.success('Logged out successfully', result),
        { status: 200 }
      );
    } catch (error) {
      return errorHandler(error);
    }
  }

  static async me(req: NextRequest) {
    try {
      await connectDB();
      const currentUser = await authenticateRequest(req);
      const result = await authService.me(currentUser.user_id);

      return NextResponse.json(
        ResponseUtil.success('User profile retrieved successfully', result),
        { status: 200 }
      );
    } catch (error) {
      return errorHandler(error);
    }
  }
}
