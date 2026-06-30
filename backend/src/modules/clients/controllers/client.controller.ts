import { NextRequest, NextResponse } from 'next/server';
import { ClientService } from '../services/client.service';
import { CreateClientSchema, UpdateClientSchema } from '../validators/client.validator';
import { ResponseUtil } from '../../../shared/utils/response.util';
import { errorHandler } from '../../../shared/middlewares/error.middleware';
import { ClientStatus } from '../types/client.types';

const clientService = new ClientService();

export class ClientController {
  
  static async create(req: NextRequest) {
    try {
      const body = await req.json();
      
      // Validation
      const validatedData = CreateClientSchema.parse(body);
      
      // Business Logic via Service
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

  static async getById(req: NextRequest, id: string) {
    try {
      if (!id) throw new Error('Client ID is required');

      const result = await clientService.getClientById(id);

      return NextResponse.json(
        ResponseUtil.success('Client retrieved successfully', result),
        { status: 200 }
      );
    } catch (error) {
      return errorHandler(error);
    }
  }

  static async update(req: NextRequest, id: string) {
    try {
      if (!id) throw new Error('Client ID is required');

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

  static async delete(req: NextRequest, id: string) {
    try {
      if (!id) throw new Error('Client ID is required');

      const result = await clientService.softDeleteClient(id);

      return NextResponse.json(
        ResponseUtil.success('Client deleted successfully', result),
        { status: 200 }
      );
    } catch (error) {
      return errorHandler(error);
    }
  }

  static async restore(req: NextRequest, id: string) {
    try {
      if (!id) throw new Error('Client ID is required');

      const result = await clientService.restoreClient(id);

      return NextResponse.json(
        ResponseUtil.success('Client restored successfully', result),
        { status: 200 }
      );
    } catch (error) {
      return errorHandler(error);
    }
  }
}
