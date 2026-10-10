import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/shared/database/sequelize';
import { authenticateRequest, requireRoles } from '@/shared/middlewares/auth.middleware';
import { UserRole } from '@/modules/users/types/user.types';
import { AppError, errorHandler } from '@/shared/middlewares/error.middleware';
import { ResponseUtil } from '@/shared/utils/response.util';
import { StaffRepository } from '@/modules/staff/repositories/staff.repository';
import { resolveUrl } from '@/shared/utils/media-url.util';
import fs from 'fs/promises';
import path from 'path';

const staffRepo = new StaffRepository();

export async function POST(
  req: NextRequest,
  props: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const currentUser = await authenticateRequest(req);
    requireRoles(currentUser, [UserRole.ADMIN, UserRole.MANAGER]);

    const { id } = await props.params;
    const staffId = parseInt(id, 10);
    if (isNaN(staffId) || staffId <= 0) throw new AppError('Invalid staff ID', 400);

    const staff = await staffRepo.findById(staffId);
    if (!staff) throw new AppError('Staff member not found', 404);

    const formData = await req.formData();
    const file = formData.get('file') as File | null;
    if (!file) throw new AppError('No image file uploaded', 400);

    const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
    if (!validTypes.includes(file.type)) {
      throw new AppError('Invalid file type. Only JPEG, PNG, WEBP and GIF are allowed.', 400);
    }

    if (file.size > 5 * 1024 * 1024) {
      throw new AppError('Image size exceeds 5MB limit.', 400);
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const uploadDir = path.join(process.cwd(), 'public', 'uploads', 'staff');
    await fs.mkdir(uploadDir, { recursive: true });

    const frontendUploadDir = path.resolve(process.cwd(), '../frontend/public/uploads/staff');
    try { await fs.mkdir(frontendUploadDir, { recursive: true }); } catch {}

    const cleanName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_');
    const filename = `${Date.now()}_${cleanName}`;
    const filePath = path.join(uploadDir, filename);
    await fs.writeFile(filePath, buffer);

    try {
      await fs.writeFile(path.join(frontendUploadDir, filename), buffer);
    } catch {}

    const relativePath = `/uploads/staff/${filename}`;
    const updated = await staffRepo.update(staffId, { photo: relativePath } as any);

    return NextResponse.json(
      ResponseUtil.success('Staff photo updated successfully', {
        photo: updated ? updated.photo : resolveUrl(relativePath),
        staff: updated ? updated.toJSON() : null,
      }),
      { status: 200 }
    );
  } catch (error) {
    return errorHandler(error);
  }
}
