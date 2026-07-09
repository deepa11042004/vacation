import { NextRequest, NextResponse } from 'next/server';
import { StaffAuthService } from '../services/staff-auth.service';
import { StaffLoginSchema } from '../validators/staff.validator';
import { ResponseUtil } from '../../../shared/utils/response.util';
import { errorHandler, AppError } from '../../../shared/middlewares/error.middleware';
import { connectDB } from '../../../shared/database/sequelize';
import { JwtUtil } from '../../../shared/utils/jwt.util';
import { StaffRepository } from '../repositories/staff.repository';

const authService = new StaffAuthService();

export class StaffAuthController {
  static async login(req: NextRequest) {
    try {
      await connectDB();
      const body = StaffLoginSchema.parse(await req.json());
      const result = await authService.login(body.email, body.phone);
      return NextResponse.json(ResponseUtil.success('Logged in successfully.', result));
    } catch (e) { return errorHandler(e); }
  }

  static async me(req: NextRequest) {
    try {
      await connectDB();
      const auth = req.headers.get('authorization');
      if (!auth?.startsWith('Bearer ')) throw new AppError('Unauthorized.', 401);
      const payload = JwtUtil.verifyAccessToken(auth.split(' ')[1]);
      if (payload.role !== 'STAFF') throw new AppError('Forbidden.', 403);
      const repo = new StaffRepository();
      const staff = await repo.findById(payload.user_id);
      if (!staff) throw new AppError('Staff not found.', 404);
      return NextResponse.json(ResponseUtil.success('Profile retrieved.', staff.toJSON()));
    } catch (e) { return errorHandler(e); }
  }
}
