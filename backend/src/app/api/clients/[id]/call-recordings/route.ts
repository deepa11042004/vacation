import { NextRequest, NextResponse } from 'next/server';
import { CallRecordingService } from '@/modules/call-recordings/services/call-recording.service';
import { ResponseUtil } from '@/shared/utils/response.util';
import { errorHandler } from '@/shared/middlewares/error.middleware';
import { authenticateRequest, requireRoles } from '@/shared/middlewares/auth.middleware';
import { UserRole } from '@/modules/users/types/user.types';
import { connectDB } from '@/shared/database/sequelize';

const service = new CallRecordingService();

export async function GET(request: NextRequest, props: { params: Promise<{ id: string }> }) {
  try {
    await connectDB();
    const currentUser = await authenticateRequest(request);
    requireRoles(currentUser, [UserRole.ADMIN, UserRole.MANAGER]);

    const { id } = await props.params;
    const clientId = parseInt(id, 10);
    if (isNaN(clientId)) return NextResponse.json(ResponseUtil.failure('Invalid client id'), { status: 400 });

    const recordings = await service.getByClientId(clientId);
    return NextResponse.json(ResponseUtil.success('Recordings fetched', { recordings }));
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
    const note = (formData.get('note') as string | null)?.trim();
    const file = formData.get('file') as File | null;

    if (!note) return NextResponse.json(ResponseUtil.failure('Note is required'), { status: 400 });
    if (!file) return NextResponse.json(ResponseUtil.failure('File is required'), { status: 400 });

    const recording = await service.create(clientId, note, file);
    return NextResponse.json(ResponseUtil.success('Recording uploaded', { recording }), { status: 201 });
  } catch (error) {
    return errorHandler(error);
  }
}
