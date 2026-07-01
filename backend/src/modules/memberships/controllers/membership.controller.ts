import { NextRequest, NextResponse } from 'next/server';
import { MembershipService } from '../services/membership.service';
import { CreateMembershipSchema, UpdateMembershipSchema, CancelMembershipSchema } from '../validators/membership.validator';
import { ResponseUtil } from '../../../shared/utils/response.util';
import { errorHandler, AppError } from '../../../shared/middlewares/error.middleware';
import { MembershipFilterOptions, MembershipStatus } from '../types/membership.types';
import { connectDB } from '../../../shared/database/sequelize';
import { MEMBERSHIP_CONSTANTS } from '../constants/membership.constants';
import { authenticateRequest, requireRoles } from '../../../shared/middlewares/auth.middleware';
import { UserRole } from '../../users/types/user.types';

const membershipService = new MembershipService();

export class MembershipController {

  private static parseId(idStr: string): number {
    const id = parseInt(idStr, 10);
    if (isNaN(id) || id <= 0) {
      throw new AppError(MEMBERSHIP_CONSTANTS.ERRORS.INVALID_ID, 400);
    }
    return id;
  }

  static async create(req: NextRequest) {
    try {
      await connectDB();
      const currentUser = await authenticateRequest(req);
      requireRoles(currentUser, [UserRole.ADMIN, UserRole.MANAGER]);

      const body = await req.json();
      const validatedData = CreateMembershipSchema.parse(body);
      const result = await membershipService.createMembership(validatedData);

      return NextResponse.json(
        ResponseUtil.success('Membership created successfully', result),
        { status: 201 },
      );
    } catch (error) {
      return errorHandler(error);
    }
  }

  static async getAll(req: NextRequest) {
    try {
      await connectDB();
      const currentUser = await authenticateRequest(req);
      requireRoles(currentUser, [UserRole.ADMIN, UserRole.MANAGER, UserRole.AGENT]);

      const { searchParams } = new URL(req.url);
      const filters: MembershipFilterOptions = {
        search: searchParams.get('search') || undefined,
        client_id: searchParams.get('client_id') ? parseInt(searchParams.get('client_id')!, 10) : undefined,
        package_id: searchParams.get('package_id') ? parseInt(searchParams.get('package_id')!, 10) : undefined,
        status: searchParams.get('status') as MembershipStatus | undefined,
        page: parseInt(searchParams.get('page') || '1', 10),
        limit: parseInt(searchParams.get('limit') || '10', 10),
      };

      const result = await membershipService.getAllMemberships(filters);

      return NextResponse.json(
        ResponseUtil.success('Memberships retrieved successfully', result),
        { status: 200 },
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

      if (currentUser.role === UserRole.CLIENT) {
        // Client can only view their own memberships
        const result = await membershipService.getMembershipById(id);
        if (result.client_id !== currentUser.client_id) {
          throw new AppError('Forbidden: Access denied', 403);
        }
        return NextResponse.json(ResponseUtil.success('Membership retrieved successfully', result), { status: 200 });
      }

      requireRoles(currentUser, [UserRole.ADMIN, UserRole.MANAGER, UserRole.AGENT]);
      const result = await membershipService.getMembershipById(id);

      return NextResponse.json(
        ResponseUtil.success('Membership retrieved successfully', result),
        { status: 200 },
      );
    } catch (error) {
      return errorHandler(error);
    }
  }

  static async getByClientId(req: NextRequest, clientIdStr: string) {
    try {
      await connectDB();
      const currentUser = await authenticateRequest(req);

      const clientId = this.parseId(clientIdStr);

      if (currentUser.role === UserRole.CLIENT && currentUser.client_id !== clientId) {
        throw new AppError('Forbidden: Access denied', 403);
      }

      requireRoles(currentUser, [UserRole.ADMIN, UserRole.MANAGER, UserRole.AGENT, UserRole.CLIENT]);
      const result = await membershipService.getMembershipsByClientId(clientId);

      return NextResponse.json(
        ResponseUtil.success('Client memberships retrieved successfully', result),
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
      const validatedData = UpdateMembershipSchema.parse(body);
      const result = await membershipService.updateMembership(id, validatedData);

      return NextResponse.json(
        ResponseUtil.success('Membership updated successfully', result),
        { status: 200 },
      );
    } catch (error) {
      return errorHandler(error);
    }
  }

  static async cancel(req: NextRequest, idStr: string) {
    try {
      await connectDB();
      const currentUser = await authenticateRequest(req);
      requireRoles(currentUser, [UserRole.ADMIN]);

      const id = this.parseId(idStr);
      const body = await req.json();
      const { cancellation_reason, updated_by } = CancelMembershipSchema.parse(body);
      await membershipService.cancelMembership(id, cancellation_reason, updated_by);

      return NextResponse.json(
        ResponseUtil.success('Membership cancelled successfully', null),
        { status: 200 },
      );
    } catch (error) {
      return errorHandler(error);
    }
  }

  static async suspend(req: NextRequest, idStr: string) {
    try {
      await connectDB();
      const currentUser = await authenticateRequest(req);
      requireRoles(currentUser, [UserRole.ADMIN, UserRole.MANAGER]);

      const id = this.parseId(idStr);
      await membershipService.suspendMembership(id, currentUser.user_id);

      return NextResponse.json(
        ResponseUtil.success('Membership suspended successfully', null),
        { status: 200 },
      );
    } catch (error) {
      return errorHandler(error);
    }
  }

  static async reactivate(req: NextRequest, idStr: string) {
    try {
      await connectDB();
      const currentUser = await authenticateRequest(req);
      requireRoles(currentUser, [UserRole.ADMIN]);

      const id = this.parseId(idStr);
      await membershipService.reactivateMembership(id, currentUser.user_id);

      return NextResponse.json(
        ResponseUtil.success('Membership reactivated successfully', null),
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
      await membershipService.softDeleteMembership(id);

      return NextResponse.json(
        ResponseUtil.success('Membership deleted successfully', null),
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
      await membershipService.restoreMembership(id);

      return NextResponse.json(
        ResponseUtil.success('Membership restored successfully', null),
        { status: 200 },
      );
    } catch (error) {
      return errorHandler(error);
    }
  }
}
