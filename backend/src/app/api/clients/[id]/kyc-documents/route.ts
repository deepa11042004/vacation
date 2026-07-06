import { NextRequest, NextResponse } from 'next/server';
import { KycDocumentService } from '@/modules/kyc-documents/services/kyc-document.service';
import { ResponseUtil } from '@/shared/utils/response.util';
import { errorHandler } from '@/shared/middlewares/error.middleware';
import { authenticateRequest, requireRoles } from '@/shared/middlewares/auth.middleware';
import { UserRole } from '@/modules/users/types/user.types';
import { connectDB } from '@/shared/database/sequelize';

const service = new KycDocumentService();

export async function GET(request: NextRequest, props: { params: Promise<{ id: string }> }) {
  try {
    await connectDB();
    const currentUser = await authenticateRequest(request);
    requireRoles(currentUser, [UserRole.ADMIN, UserRole.MANAGER]);

    const { id } = await props.params;
    const clientId = parseInt(id, 10);
    if (isNaN(clientId)) return NextResponse.json(ResponseUtil.failure('Invalid client id'), { status: 400 });

    const documents = await service.getByClientId(clientId);
    return NextResponse.json(ResponseUtil.success('Documents fetched', { documents }));
  } catch (error) {
    return errorHandler(error);
  }
}

export async function POST(request: NextRequest, props: { params: Promise<{ id: string }> }) {
  try {
    await connectDB();
    const currentUser = await authenticateRequest(request);
    requireRoles(currentUser, [UserRole.ADMIN, UserRole.MANAGER]);

    const { id } = await props.params;
    const clientId = parseInt(id, 10);
    if (isNaN(clientId)) return NextResponse.json(ResponseUtil.failure('Invalid client id'), { status: 400 });

    const formData = await request.formData();
    const title = (formData.get('title') as string | null)?.trim();
    const file = formData.get('file') as File | null;

    if (!title) return NextResponse.json(ResponseUtil.failure('Title is required'), { status: 400 });
    if (!file) return NextResponse.json(ResponseUtil.failure('File is required'), { status: 400 });

    const document = await service.create(clientId, title, file);
    return NextResponse.json(ResponseUtil.success('Document uploaded', { document }), { status: 201 });
  } catch (error) {
    return errorHandler(error);
  }
}
