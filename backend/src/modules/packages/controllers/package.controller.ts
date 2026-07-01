import { NextRequest, NextResponse } from 'next/server';
import { PackageService } from '../services/package.service';
import { CreatePackageSchema, UpdatePackageSchema } from '../validators/package.validator';
import { ResponseUtil } from '../../../shared/utils/response.util';
import { errorHandler, AppError } from '../../../shared/middlewares/error.middleware';
import { PackageCategory, PackageStatus } from '../types/package.types';
import { connectDB } from '../../../shared/database/sequelize';
import { PACKAGE_CONSTANTS } from '../constants/package.constants';
import { authenticateRequest, requireRoles } from '../../../shared/middlewares/auth.middleware';
import { UserRole } from '../../users/types/user.types';

const packageService = new PackageService();

export class PackageController {

  private static parseId(idStr: string): number {
    const id = parseInt(idStr, 10);
    if (isNaN(id) || id <= 0) {
      throw new AppError(PACKAGE_CONSTANTS.ERRORS.INVALID_ID, 400);
    }
    return id;
  }

  static async create(req: NextRequest) {
    try {
      await connectDB();
      const currentUser = await authenticateRequest(req);
      requireRoles(currentUser, [UserRole.ADMIN]);

      const body = await req.json();
      const validatedData = CreatePackageSchema.parse(body);
      const result = await packageService.createPackage(validatedData);

      return NextResponse.json(
        ResponseUtil.success('Package created successfully', result),
        { status: 201 },
      );
    } catch (error) {
      return errorHandler(error);
    }
  }

  static async getAll(req: NextRequest) {
    try {
      await connectDB();
      await authenticateRequest(req);

      const { searchParams } = new URL(req.url);
      const search = searchParams.get('search') || undefined;
      const category = searchParams.get('category') as PackageCategory | undefined;
      const status = searchParams.get('status') as PackageStatus | undefined;
      const page = parseInt(searchParams.get('page') || '1', 10);
      const limit = parseInt(searchParams.get('limit') || '10', 10);

      const result = await packageService.getAllPackages({ search, category, status, page, limit });

      return NextResponse.json(
        ResponseUtil.success('Packages retrieved successfully', result),
        { status: 200 },
      );
    } catch (error) {
      return errorHandler(error);
    }
  }

  static async getGrouped(req: NextRequest) {
    try {
      await connectDB();
      await authenticateRequest(req);

      const result = await packageService.getPackagesGroupedByCategory();

      return NextResponse.json(
        ResponseUtil.success('Packages grouped by category', result),
        { status: 200 },
      );
    } catch (error) {
      return errorHandler(error);
    }
  }

  static async getById(req: NextRequest, idStr: string) {
    try {
      await connectDB();
      await authenticateRequest(req);

      const id = this.parseId(idStr);
      const result = await packageService.getPackageById(id);

      return NextResponse.json(
        ResponseUtil.success('Package retrieved successfully', result),
        { status: 200 },
      );
    } catch (error) {
      return errorHandler(error);
    }
  }

  static async update(req: NextRequest, idStr: string) {
    try {
      await connectDB();
      const currentUser = await authenticateRequest(req);
      requireRoles(currentUser, [UserRole.ADMIN]);

      const id = this.parseId(idStr);
      const body = await req.json();
      const validatedData = UpdatePackageSchema.parse(body);
      const result = await packageService.updatePackage(id, validatedData);

      return NextResponse.json(
        ResponseUtil.success('Package updated successfully', result),
        { status: 200 },
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
      await packageService.softDeletePackage(id);

      return NextResponse.json(
        ResponseUtil.success('Package deleted successfully', null),
        { status: 200 },
      );
    } catch (error) {
      return errorHandler(error);
    }
  }

  static async restore(req: NextRequest, idStr: string) {
    try {
      await connectDB();
      const currentUser = await authenticateRequest(req);
      requireRoles(currentUser, [UserRole.ADMIN]);

      const id = this.parseId(idStr);
      await packageService.restorePackage(id);

      return NextResponse.json(
        ResponseUtil.success('Package restored successfully', null),
        { status: 200 },
      );
    } catch (error) {
      return errorHandler(error);
    }
  }
}
