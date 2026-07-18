import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/shared/database/sequelize';
import { TravelQueryRepository } from '@/modules/travel-queries/repositories/travel-query.repository';
import { TravelQueryType, TravelQueryStatus } from '@/modules/travel-queries/interfaces/travel-query.interface';
import { ResponseUtil } from '@/shared/utils/response.util';
import { errorHandler, AppError } from '@/shared/middlewares/error.middleware';
import { authenticateRequest, requireRoles } from '@/shared/middlewares/auth.middleware';
import { UserRole } from '@/modules/users/types/user.types';

const repo = new TravelQueryRepository();

// GET /api/travel-queries — admin list
export async function GET(req: NextRequest) {
  try {
    await connectDB();
    const user = await authenticateRequest(req);
    requireRoles(user, [UserRole.ADMIN, UserRole.MANAGER, UserRole.AGENT]);

    const { searchParams } = new URL(req.url);
    const filters = {
      status:     (searchParams.get('status')     || undefined) as TravelQueryStatus | undefined,
      query_type: (searchParams.get('query_type') || undefined) as TravelQueryType   | undefined,
      search:     searchParams.get('search')      || undefined,
      page:       parseInt(searchParams.get('page')  || '1',  10),
      limit:      parseInt(searchParams.get('limit') || '20', 10),
    };

    const { rows, count } = await repo.findAll(filters);
    return NextResponse.json(
      ResponseUtil.success('Travel queries fetched', { queries: rows, total: count, page: filters.page, limit: filters.limit }),
      { status: 200 },
    );
  } catch (error) {
    return errorHandler(error);
  }
}

// POST /api/travel-queries — public submission (no auth required)
export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const body = await req.json();

    const { query_type, card_number, details } = body;

    if (!query_type || !Object.values(TravelQueryType).includes(query_type)) {
      throw new AppError('Invalid query type', 400);
    }
    if (!card_number || String(card_number).trim().length < 2) {
      throw new AppError('Card number is required', 400);
    }

    const query = await repo.create({
      query_type,
      card_number: String(card_number).trim(),
      details: details ?? null,
      status: TravelQueryStatus.NEW,
    });

    return NextResponse.json(
      ResponseUtil.success('Your request has been submitted. Our team will contact you shortly.', { query_id: query.query_id }),
      { status: 201 },
    );
  } catch (error) {
    return errorHandler(error);
  }
}
