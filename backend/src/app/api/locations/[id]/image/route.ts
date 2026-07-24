import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/shared/database/sequelize';
import { authenticateRequest, requireRoles } from '@/shared/middlewares/auth.middleware';
import { UserRole } from '@/modules/users/types/user.types';
import { AppError } from '@/shared/middlewares/error.middleware';
import { LocationRepository } from '@/modules/locations/repositories/location.repository';
import fs from 'fs/promises';
import path from 'path';

const locationRepository = new LocationRepository();

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    await connectDB();
    const currentUser = await authenticateRequest(request);
    requireRoles(currentUser, [UserRole.ADMIN, UserRole.MANAGER]);

    const { id } = await params;
    const locationId = parseInt(id, 10);
    if (isNaN(locationId)) throw new AppError('Invalid location ID', 400);

    const location = await locationRepository.findById(locationId);
    if (!location) throw new AppError('Location not found', 404);

    const formData = await request.formData();
    const file = formData.get('file') as File;
    if (!file) throw new AppError('No file uploaded', 400);

    const validTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (!validTypes.includes(file.type)) {
      throw new AppError('Invalid file type. Only JPEG, PNG and WEBP are allowed.', 400);
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const uploadDir = path.join(process.cwd(), 'public', 'uploads', 'locations');
    await fs.mkdir(uploadDir, { recursive: true });

    const filename = `${Date.now()}_${file.name.replace(/\s+/g, '_')}`;
    const filePath = path.join(uploadDir, filename);
    await fs.writeFile(filePath, buffer);

    const relativePath = `/uploads/locations/${filename}`;
    await locationRepository.update(locationId, { location_image: relativePath });

    return NextResponse.json({ location_image: relativePath }, { status: 200 });
  } catch (err) {
    if (err instanceof AppError) {
      return NextResponse.json({ message: err.message }, { status: err.statusCode });
    }
    console.error(err);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
