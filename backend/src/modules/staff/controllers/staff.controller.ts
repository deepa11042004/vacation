import { NextRequest, NextResponse } from 'next/server';
import { StaffService } from '../services/staff.service';
import { CreateStaffSchema, UpdateStaffSchema } from '../validators/staff.validator';
import { ResponseUtil } from '../../../shared/utils/response.util';
import { errorHandler, AppError } from '../../../shared/middlewares/error.middleware';
import { connectDB } from '../../../shared/database/sequelize';
import { authenticateRequest, requireRoles } from '../../../shared/middlewares/auth.middleware';
import { UserRole } from '../../users/types/user.types';

const staffService = new StaffService();

function parseId(idStr: string) {
  const id = parseInt(idStr, 10);
  if (isNaN(id) || id <= 0) throw new AppError('Invalid staff ID.', 400);
  return id;
}

export class StaffController {
  static async create(req: NextRequest) {
    try {
      await connectDB();
      const user = await authenticateRequest(req);
      requireRoles(user, [UserRole.ADMIN, UserRole.MANAGER]);
      const data = CreateStaffSchema.parse(await req.json());
      const result = await staffService.createStaff(data);
      return NextResponse.json(ResponseUtil.success('Staff created.', result), { status: 201 });
    } catch (e) { return errorHandler(e); }
  }

  static async getAll(req: NextRequest) {
    try {
      await connectDB();
      await authenticateRequest(req);
      const p = new URL(req.url).searchParams;
      const result = await staffService.getAllStaff(
        p.get('search') || undefined,
        parseInt(p.get('page') || '1', 10),
        parseInt(p.get('limit') || '20', 10),
      );
      return NextResponse.json(ResponseUtil.success('Staff retrieved.', result));
    } catch (e) { return errorHandler(e); }
  }

  static async getById(req: NextRequest, idStr: string) {
    try {
      await connectDB();
      await authenticateRequest(req);
      const result = await staffService.getStaffById(parseId(idStr));
      return NextResponse.json(ResponseUtil.success('Staff retrieved.', result));
    } catch (e) { return errorHandler(e); }
  }

  static async update(req: NextRequest, idStr: string) {
    try {
      await connectDB();
      const user = await authenticateRequest(req);
      requireRoles(user, [UserRole.ADMIN, UserRole.MANAGER]);
      const data = UpdateStaffSchema.parse(await req.json());
      const result = await staffService.updateStaff(parseId(idStr), data);
      return NextResponse.json(ResponseUtil.success('Staff updated.', result));
    } catch (e) { return errorHandler(e); }
  }

  static async delete(req: NextRequest, idStr: string) {
    try {
      await connectDB();
      const user = await authenticateRequest(req);
      requireRoles(user, [UserRole.ADMIN]);
      await staffService.deleteStaff(parseId(idStr));
      return NextResponse.json(ResponseUtil.success('Staff deleted.', null));
    } catch (e) { return errorHandler(e); }
  }

  static async permanentDelete(req: NextRequest, idStr: string) {
    try {
      await connectDB();
      const user = await authenticateRequest(req);
      requireRoles(user, [UserRole.ADMIN]);
      await staffService.permanentDeleteStaff(parseId(idStr));
      return NextResponse.json(ResponseUtil.success('Staff permanently deleted.', null));
    } catch (e) { return errorHandler(e); }
  }
}
