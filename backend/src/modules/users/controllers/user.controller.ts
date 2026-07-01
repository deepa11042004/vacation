import { NextRequest, NextResponse } from 'next/server';
import { UserService } from '../services/user.service';
import { CreateUserSchema, UpdateUserSchema } from '../validators/user.validator';
import { ResponseUtil } from '../../../shared/utils/response.util';
import { errorHandler, AppError } from '../../../shared/middlewares/error.middleware';
import { UserRole, UserStatus } from '../types/user.types';
import { connectDB } from '../../../shared/database/sequelize';
import { authenticateRequest, requireRoles } from '../../../shared/middlewares/auth.middleware';
import { USER_CONSTANTS } from '../constants/user.constants';

const userService = new UserService();

export class UserController {

  private static parseId(idStr: string): number {
    const id = parseInt(idStr, 10);
    if (isNaN(id) || id <= 0) {
      throw new AppError(USER_CONSTANTS.ERRORS.INVALID_ID, 400);
    }
    return id;
  }

  static async create(req: NextRequest) {
    try {
      await connectDB();
      const currentUser = await authenticateRequest(req);
      requireRoles(currentUser, [UserRole.ADMIN]);

      const body = await req.json();
      const validatedData = CreateUserSchema.parse(body);

      const result = await userService.createUser(validatedData);

      return NextResponse.json(
        ResponseUtil.success('User created successfully', result),
        { status: 201 }
      );
    } catch (error) {
      return errorHandler(error);
    }
  }

  static async getAll(req: NextRequest) {
    try {
      await connectDB();
      const currentUser = await authenticateRequest(req);
      requireRoles(currentUser, [UserRole.ADMIN, UserRole.MANAGER]);

      const { searchParams } = new URL(req.url);
      const search = searchParams.get('search') || undefined;
      const role = searchParams.get('role') as UserRole | undefined;
      const status = searchParams.get('status') as UserStatus | undefined;
      const page = parseInt(searchParams.get('page') || '1', 10);
      const limit = parseInt(searchParams.get('limit') || '10', 10);

      const filters = { search, role, status, page, limit };

      const result = await userService.getAllUsers(filters);

      return NextResponse.json(
        ResponseUtil.success('Users retrieved successfully', result),
        { status: 200 }
      );
    } catch (error) {
      return errorHandler(error);
    }
  }

  static async getById(req: NextRequest, idStr: string) {
    try {
      await connectDB();
      const currentUser = await authenticateRequest(req);
      const id = this.parseId(idStr);

      // Access control: Admin, Manager, or the user themselves
      if (currentUser.role !== UserRole.ADMIN && currentUser.role !== UserRole.MANAGER && currentUser.user_id !== id) {
        throw new AppError('Forbidden: Access denied', 403);
      }

      const result = await userService.getUserById(id);

      return NextResponse.json(
        ResponseUtil.success('User retrieved successfully', result),
        { status: 200 }
      );
    } catch (error) {
      return errorHandler(error);
    }
  }

  static async update(req: NextRequest, idStr: string) {
    try {
      await connectDB();
      const currentUser = await authenticateRequest(req);
      const id = this.parseId(idStr);

      // Access control: Admin or the user themselves
      if (currentUser.role !== UserRole.ADMIN && currentUser.user_id !== id) {
        throw new AppError('Forbidden: Access denied', 403);
      }

      const body = await req.json();
      const validatedData = UpdateUserSchema.parse(body);

      // Prevent non-admin from updating their own role or status
      if (currentUser.role !== UserRole.ADMIN) {
        delete validatedData.role;
        delete validatedData.status;
      }

      const result = await userService.updateUser(id, validatedData);

      return NextResponse.json(
        ResponseUtil.success('User updated successfully', result),
        { status: 200 }
      );
    } catch (error) {
      return errorHandler(error);
    }
  }

  static async delete(req: NextRequest, idStr: string) {
    try {
      await connectDB();
      const currentUser = await authenticateRequest(req);
      requireRoles(currentUser, [UserRole.ADMIN]);

      const id = this.parseId(idStr);
      const result = await userService.deleteUser(id);

      return NextResponse.json(
        ResponseUtil.success('User deleted successfully', result),
        { status: 200 }
      );
    } catch (error) {
      return errorHandler(error);
    }
  }
}
