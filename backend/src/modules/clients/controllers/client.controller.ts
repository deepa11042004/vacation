import { NextRequest, NextResponse } from 'next/server';
import { ClientService } from '../services/client.service';
import { CreateClientSchema, UpdateClientSchema } from '../validators/client.validator';
import { ResponseUtil } from '../../../shared/utils/response.util';
import { errorHandler, AppError } from '../../../shared/middlewares/error.middleware';
import { ClientStatus } from '../types/client.types';
import { connectDB } from '../../../shared/database/sequelize';
import { CLIENT_CONSTANTS } from '../constants/client.constants';
import { authenticateRequest, requireRoles } from '../../../shared/middlewares/auth.middleware';
import { UserRole } from '../../users/types/user.types';

const clientService = new ClientService();

export class ClientController {

  private static parseId(idStr: string): number {
    const id = parseInt(idStr, 10);
    if (isNaN(id) || id <= 0) {
      throw new AppError(CLIENT_CONSTANTS.ERRORS.INVALID_ID, 400);
    }
    return id;
  }

  static async create(req: NextRequest) {
    try {
      await connectDB();
      const currentUser = await authenticateRequest(req);
      requireRoles(currentUser, [UserRole.ADMIN, UserRole.MANAGER]);

      const body = await req.json();
      const validatedData = CreateClientSchema.parse(body);
      const result = await clientService.createClient(validatedData);

      return NextResponse.json(
        ResponseUtil.success('Client created successfully', result),
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
      requireRoles(currentUser, [UserRole.ADMIN, UserRole.MANAGER, UserRole.AGENT]);

      const { searchParams } = new URL(req.url);
      const search = searchParams.get('search') || undefined;
      const status = searchParams.get('status') as ClientStatus | undefined;
      const page = parseInt(searchParams.get('page') || '1', 10);
      const limit = parseInt(searchParams.get('limit') || '10', 10);

      const filters = { search, status, page, limit };
      const result = await clientService.getAllClients(filters);

      return NextResponse.json(
        ResponseUtil.success('Clients retrieved successfully', result),
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
      requireRoles(currentUser, [UserRole.ADMIN, UserRole.MANAGER, UserRole.AGENT]);

      const id = this.parseId(idStr);
      const result = await clientService.getClientById(id);

      return NextResponse.json(
        ResponseUtil.success('Client retrieved successfully', result),
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
      requireRoles(currentUser, [UserRole.ADMIN, UserRole.MANAGER]);

      const id = this.parseId(idStr);
      const body = await req.json();
      const validatedData = UpdateClientSchema.parse(body);
      const result = await clientService.updateClient(id, validatedData);

      return NextResponse.json(
        ResponseUtil.success('Client updated successfully', result),
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
      await clientService.softDeleteClient(id);

      return NextResponse.json(
        ResponseUtil.success('Client deleted successfully', null),
        { status: 200 }
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
      await clientService.restoreClient(id);

      return NextResponse.json(
        ResponseUtil.success('Client restored successfully', null),
        { status: 200 }
      );
    } catch (error) {
      return errorHandler(error);
    }
  }
}
