import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/shared/database/sequelize';
import { TravelQueryRepository } from '@/modules/travel-queries/repositories/travel-query.repository';
import { TravelQueryStatus } from '@/modules/travel-queries/interfaces/travel-query.interface';
import { ResponseUtil } from '@/shared/utils/response.util';
import { errorHandler, AppError } from '@/shared/middlewares/error.middleware';
import { authenticateRequest, requireRoles } from '@/shared/middlewares/auth.middleware';
import { UserRole } from '@/modules/users/types/user.types';

const repo = new TravelQueryRepository();

export async function GET(req: NextRequest, props: { params: Promise<{ id: string }> }) {
  try {
    await connectDB();
    const user = await authenticateRequest(req);
    requireRoles(user, [UserRole.ADMIN, UserRole.MANAGER, UserRole.AGENT]);

    const { id } = await props.params;
    const query = await repo.findById(parseInt(id, 10));
    if (!query) throw new AppError('Travel query not found', 404);

    return NextResponse.json(ResponseUtil.success('OK', query), { status: 200 });
  } catch (error) {
    return errorHandler(error);
  }
}

export async function PATCH(req: NextRequest, props: { params: Promise<{ id: string }> }) {
  try {
    await connectDB();
    const user = await authenticateRequest(req);
    requireRoles(user, [UserRole.ADMIN, UserRole.MANAGER, UserRole.AGENT]);

    const { id } = await props.params;
    const query_id = parseInt(id, 10);
    const existing = await repo.findById(query_id);
    if (!existing) throw new AppError('Travel query not found', 404);

    const body = await req.json();
    const update: Record<string, unknown> = {};

    if (body.status && Object.values(TravelQueryStatus).includes(body.status)) {
      update.status = body.status;
    }
    if (typeof body.admin_notes !== 'undefined') {
      update.admin_notes = body.admin_notes || null;
    }

    await repo.update(query_id, update);
    const updated = await repo.findById(query_id);

    return NextResponse.json(ResponseUtil.success('Updated', updated), { status: 200 });
  } catch (error) {
    return errorHandler(error);
  }
}
