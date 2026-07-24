import { NextRequest, NextResponse } from 'next/server';
import { CallRecordingService } from '@/modules/call-recordings/services/call-recording.service';
import { ResponseUtil } from '@/shared/utils/response.util';
import { errorHandler } from '@/shared/middlewares/error.middleware';
import { authenticateRequest, requireRoles } from '@/shared/middlewares/auth.middleware';
import { UserRole } from '@/modules/users/types/user.types';
import { connectDB } from '@/shared/database/sequelize';

const service = new CallRecordingService();

/**
 * @swagger
 * /api/clients/{id}/call-recordings:
 *   get:
 *     summary: List call recordings for a client
 *     tags: [Clients]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: Recordings retrieved successfully
 *   post:
 *     summary: Upload a call recording for a client
 *     tags: [Clients]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required: [file, note]
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *                 description: Audio file only (mp3, wav, aac, ogg, flac, m4a, webm, etc.)
 *               note: { type: string, example: "Follow-up call" }
 *     responses:
 *       201:
 *         description: Recording uploaded successfully
 *       400:
 *         description: Non-audio file or missing required fields
 */
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
