import { NextRequest, NextResponse } from 'next/server';
import { ItineraryService } from '../services/itinerary.service';
import { CreateItinerarySchema, UpdateItinerarySchema } from '../validators/itinerary.validator';
import { ResponseUtil } from '../../../shared/utils/response.util';
import { errorHandler, AppError } from '../../../shared/middlewares/error.middleware';
import { ItineraryType, ItineraryStatus } from '../types/itinerary.types';
import { connectDB } from '../../../shared/database/sequelize';
import { ITINERARY_CONSTANTS } from '../constants/itinerary.constants';
import { authenticateRequest, requireRoles } from '../../../shared/middlewares/auth.middleware';
import { UserRole } from '../../users/types/user.types';
import fs from 'fs/promises';
import path from 'path';

const itineraryService = new ItineraryService();

export class ItineraryController {
  private static parseId(idStr: string): number {
    const id = parseInt(idStr, 10);
    if (isNaN(id) || id <= 0) {
      throw new AppError(ITINERARY_CONSTANTS.ERRORS.INVALID_ID, 400);
    }
    return id;
  }

  static async create(req: NextRequest) {
    try {
      await connectDB();
      const currentUser = await authenticateRequest(req);
      requireRoles(currentUser, [UserRole.ADMIN, UserRole.MANAGER]);

      const body = await req.json();
      const validatedData = CreateItinerarySchema.parse(body);
      const result = await itineraryService.createItinerary({
        ...validatedData,
        created_by: currentUser.user_id,
      });

      return NextResponse.json(
        ResponseUtil.success('Itinerary created successfully', result),
        { status: 201 },
      );
    } catch (error) {
      return errorHandler(error);
    }
  }

  static async getAll(req: NextRequest) {
    try {
      await connectDB();

      const searchParams = req.nextUrl?.searchParams ?? new URL(req.url, 'http://localhost').searchParams;
      const search = searchParams.get('search') || undefined;
      const type = searchParams.get('type') as ItineraryType | undefined;
      const status = searchParams.get('status') as ItineraryStatus | undefined;
      const category = searchParams.get('category') || undefined;
      const deleted = searchParams.get('deleted') === 'true';
      const includeDeleted = searchParams.get('includeDeleted') === 'true';
      const page = parseInt(searchParams.get('page') || '1', 10);
      const limit = parseInt(searchParams.get('limit') || '10', 10);
      const sort = searchParams.get('sort') as 'name' | 'created_at' | undefined;

      const result = await itineraryService.getAllItineraries({ search, type, status, category, deleted, includeDeleted, page, limit, sort });

      return NextResponse.json(
        ResponseUtil.success('Itineraries retrieved successfully', result),
        { status: 200 },
      );
    } catch (error) {
      return errorHandler(error);
    }
  }

  static async getById(req: NextRequest, idStr: string) {
    try {
      await connectDB();

      const id = this.parseId(idStr);
      const result = await itineraryService.getItineraryById(id);

      return NextResponse.json(
        ResponseUtil.success('Itinerary retrieved successfully', result),
        { status: 200 },
      );
    } catch (error) {
      return errorHandler(error);
    }
  }

  static async getBySlug(req: NextRequest, slug: string) {
    try {
      await connectDB();

      const result = await itineraryService.getItineraryBySlug(slug);

      return NextResponse.json(
        ResponseUtil.success('Itinerary retrieved successfully', result),
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
      const validatedData = UpdateItinerarySchema.parse(body);
      const result = await itineraryService.updateItinerary(id, {
        ...validatedData,
        updated_by: currentUser.user_id,
      });

      return NextResponse.json(
        ResponseUtil.success('Itinerary updated successfully', result),
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
      requireRoles(currentUser, [UserRole.ADMIN, UserRole.MANAGER]);

      const id = this.parseId(idStr);
      await itineraryService.softDeleteItinerary(id);

      return NextResponse.json(
        ResponseUtil.success('Itinerary deleted successfully', null),
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
      requireRoles(currentUser, [UserRole.ADMIN, UserRole.MANAGER]);

      const id = this.parseId(idStr);
      await itineraryService.restoreItinerary(id);

      return NextResponse.json(
        ResponseUtil.success('Itinerary restored successfully', null),
        { status: 200 },
      );
    } catch (error) {
      return errorHandler(error);
    }
  }

  static async permanentDelete(req: NextRequest, idStr: string) {
    try {
      await connectDB();
      const currentUser = await authenticateRequest(req);
      requireRoles(currentUser, [UserRole.ADMIN]);

      const id = this.parseId(idStr);
      await itineraryService.permanentDeleteItinerary(id);

      return NextResponse.json(
        ResponseUtil.success('Itinerary permanently deleted', null),
        { status: 200 },
      );
    } catch (error) {
      return errorHandler(error);
    }
  }

  // --- Itinerary Gallery Images Endpoints ---

  static async uploadImage(req: NextRequest, itineraryIdStr: string) {
    try {
      await connectDB();
      const currentUser = await authenticateRequest(req);
      requireRoles(currentUser, [UserRole.ADMIN, UserRole.MANAGER]);

      const itinerary_id = this.parseId(itineraryIdStr);

      const formData = await req.formData();
      const file = formData.get('file') as File;
      const sortOrderStr = formData.get('sort_order') as string | null;
      const sort_order = sortOrderStr ? parseInt(sortOrderStr, 10) : 0;

      if (!file) {
        throw new AppError('No file uploaded', 400);
      }

      const validTypes = ['image/jpeg', 'image/png', 'image/webp'];
      if (!validTypes.includes(file.type)) {
        throw new AppError('Invalid file type. Only JPEG, PNG and WEBP are allowed.', 400);
      }

      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      const uploadDir = path.join(process.cwd(), 'public', 'uploads', 'itineraries');
      await fs.mkdir(uploadDir, { recursive: true });

      const filename = `${Date.now()}_${file.name.replace(/\s+/g, '_')}`;
      const filePath = path.join(uploadDir, filename);
      await fs.writeFile(filePath, buffer);

      const relativePath = `/uploads/itineraries/${filename}`;

      const result = await itineraryService.addItineraryImage(itinerary_id, {
        image_path: relativePath,
        sort_order,
      });

      return NextResponse.json(
        ResponseUtil.success('Image uploaded successfully', result),
        { status: 201 },
      );
    } catch (error) {
      return errorHandler(error);
    }
  }

  static async deleteImage(req: NextRequest, itineraryIdStr: string, imageIdStr: string) {
    try {
      await connectDB();
      const currentUser = await authenticateRequest(req);
      requireRoles(currentUser, [UserRole.ADMIN, UserRole.MANAGER]);

      const itinerary_id = this.parseId(itineraryIdStr);
      const image_id = this.parseId(imageIdStr);

      const result = await itineraryService.deleteItineraryImage(itinerary_id, image_id);

      return NextResponse.json(
        ResponseUtil.success('Image deleted successfully', result),
        { status: 200 },
      );
    } catch (error) {
      return errorHandler(error);
    }
  }

  // --- Cover image (single) ---

  static async uploadCoverImage(req: NextRequest, itineraryIdStr: string) {
    try {
      await connectDB();
      const currentUser = await authenticateRequest(req);
      requireRoles(currentUser, [UserRole.ADMIN, UserRole.MANAGER]);

      const itinerary_id = this.parseId(itineraryIdStr);

      const formData = await req.formData();
      const file = formData.get('file') as File;
      if (!file) throw new AppError('No file uploaded', 400);

      const validTypes = ['image/jpeg', 'image/png', 'image/webp'];
      if (!validTypes.includes(file.type)) {
        throw new AppError('Invalid file type. Only JPEG, PNG and WEBP are allowed.', 400);
      }

      const buffer = Buffer.from(await file.arrayBuffer());
      const uploadDir = path.join(process.cwd(), 'public', 'uploads', 'itineraries');
      await fs.mkdir(uploadDir, { recursive: true });

      const filename = `${Date.now()}_${file.name.replace(/\s+/g, '_')}`;
      await fs.writeFile(path.join(uploadDir, filename), buffer);

      const relativePath = `/uploads/itineraries/${filename}`;
      const result = await itineraryService.updateItinerary(itinerary_id, {
        image: relativePath,
        updated_by: currentUser.user_id,
      });

      return NextResponse.json(
        ResponseUtil.success('Cover image uploaded successfully', result),
        { status: 200 },
      );
    } catch (error) {
      return errorHandler(error);
    }
  }
}
