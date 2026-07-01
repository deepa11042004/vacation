import { NextRequest, NextResponse } from 'next/server';
import { LocationService } from '../services/location.service';
import { CreateLocationSchema, UpdateLocationSchema } from '../validators/location.validator';
import { ResponseUtil } from '../../../shared/utils/response.util';
import { errorHandler, AppError } from '../../../shared/middlewares/error.middleware';
import { LocationType, LocationStatus } from '../types/location.types';
import { connectDB } from '../../../shared/database/sequelize';
import { LOCATION_CONSTANTS } from '../constants/location.constants';
import { authenticateRequest, requireRoles } from '../../../shared/middlewares/auth.middleware';
import { UserRole } from '../../users/types/user.types';

const locationService = new LocationService();

export class LocationController {
  private static parseId(idStr: string): number {
    const id = parseInt(idStr, 10);
    if (isNaN(id) || id <= 0) {
      throw new AppError(LOCATION_CONSTANTS.ERRORS.INVALID_ID, 400);
    }
    return id;
  }

  static async create(req: NextRequest) {
    try {
      await connectDB();
      const currentUser = await authenticateRequest(req);
      requireRoles(currentUser, [UserRole.ADMIN, UserRole.MANAGER]);

      const body = await req.json();
      const validatedData = CreateLocationSchema.parse(body);
      const result = await locationService.createLocation({
        ...validatedData,
        created_by: currentUser.user_id,
      });

      return NextResponse.json(
        ResponseUtil.success('Location created successfully', result),
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
      const type = searchParams.get('type') as LocationType | undefined;
      const status = searchParams.get('status') as LocationStatus | undefined;
      const page = parseInt(searchParams.get('page') || '1', 10);
      const limit = parseInt(searchParams.get('limit') || '10', 10);

      const result = await locationService.getAllLocations({ search, type, status, page, limit });

      return NextResponse.json(
        ResponseUtil.success('Locations retrieved successfully', result),
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
      const result = await locationService.getLocationById(id);

      return NextResponse.json(
        ResponseUtil.success('Location retrieved successfully', result),
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
      requireRoles(currentUser, [UserRole.ADMIN, UserRole.MANAGER]);

      const id = this.parseId(idStr);
      const body = await req.json();
      const validatedData = UpdateLocationSchema.parse(body);
      const result = await locationService.updateLocation(id, {
        ...validatedData,
        updated_by: currentUser.user_id,
      });

      return NextResponse.json(
        ResponseUtil.success('Location updated successfully', result),
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
      requireRoles(currentUser, [UserRole.ADMIN, UserRole.MANAGER]);

      const id = this.parseId(idStr);
      await locationService.softDeleteLocation(id);

      return NextResponse.json(
        ResponseUtil.success('Location deleted successfully', null),
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
      requireRoles(currentUser, [UserRole.ADMIN, UserRole.MANAGER]);

      const id = this.parseId(idStr);
      await locationService.restoreLocation(id);

      return NextResponse.json(
        ResponseUtil.success('Location restored successfully', null),
        { status: 200 },
      );
    } catch (error) {
      return errorHandler(error);
    }
  }
}
