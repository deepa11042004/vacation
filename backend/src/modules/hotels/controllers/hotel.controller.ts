import { NextRequest, NextResponse } from 'next/server';
import { HotelService } from '../services/hotel.service';
import { CreateHotelSchema, UpdateHotelSchema, AddHotelImageSchema } from '../validators/hotel.validator';
import { ResponseUtil } from '../../../shared/utils/response.util';
import { errorHandler, AppError } from '../../../shared/middlewares/error.middleware';
import { PropertyType, HotelType, HotelStatus } from '../types/hotel.types';
import { connectDB } from '../../../shared/database/sequelize';
import { HOTEL_CONSTANTS } from '../constants/hotel.constants';
import { authenticateRequest, requireRoles } from '../../../shared/middlewares/auth.middleware';
import { UserRole } from '../../users/types/user.types';
import fs from 'fs/promises';
import path from 'path';

const hotelService = new HotelService();

export class HotelController {
  private static parseId(idStr: string): number {
    const id = parseInt(idStr, 10);
    if (isNaN(id) || id <= 0) {
      throw new AppError(HOTEL_CONSTANTS.ERRORS.INVALID_ID, 400);
    }
    return id;
  }

  static async create(req: NextRequest) {
    try {
      await connectDB();
      const currentUser = await authenticateRequest(req);
      requireRoles(currentUser, [UserRole.ADMIN, UserRole.MANAGER]);

      const body = await req.json();
      const validatedData = CreateHotelSchema.parse(body);
      const result = await hotelService.createHotel({
        ...validatedData,
        created_by: currentUser.user_id,
      });

      return NextResponse.json(
        ResponseUtil.success('Hotel created successfully', result),
        { status: 201 },
      );
    } catch (error) {
      return errorHandler(error);
    }
  }

  static async getAll(req: NextRequest) {
    try {
      await connectDB();
      await authenticateRequest(req);

      const { searchParams } = new URL(req.url);
      const search = searchParams.get('search') || undefined;
      const locationIdStr = searchParams.get('location_id');
      const location_id = locationIdStr ? parseInt(locationIdStr, 10) : undefined;
      const property_type = searchParams.get('property_type') as PropertyType | undefined;
      const hotel_type = searchParams.get('hotel_type') as HotelType | undefined;
      const status = searchParams.get('status') as HotelStatus | undefined;
      const page = parseInt(searchParams.get('page') || '1', 10);
      const limit = parseInt(searchParams.get('limit') || '10', 10);

      const result = await hotelService.getAllHotels({
        search,
        location_id,
        property_type,
        hotel_type,
        status,
        page,
        limit,
      });

      return NextResponse.json(
        ResponseUtil.success('Hotels retrieved successfully', result),
        { status: 200 },
      );
    } catch (error) {
      return errorHandler(error);
    }
  }

  static async getById(req: NextRequest, idStr: string) {
    try {
      await connectDB();
      await authenticateRequest(req);

      const id = this.parseId(idStr);
      const result = await hotelService.getHotelById(id);

      return NextResponse.json(
        ResponseUtil.success('Hotel retrieved successfully', result),
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
      const validatedData = UpdateHotelSchema.parse(body);
      const result = await hotelService.updateHotel(id, {
        ...validatedData,
        updated_by: currentUser.user_id,
      });

      return NextResponse.json(
        ResponseUtil.success('Hotel updated successfully', result),
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
      await hotelService.softDeleteHotel(id);

      return NextResponse.json(
        ResponseUtil.success('Hotel deleted successfully', null),
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
      await hotelService.restoreHotel(id);

      return NextResponse.json(
        ResponseUtil.success('Hotel restored successfully', null),
        { status: 200 },
      );
    } catch (error) {
      return errorHandler(error);
    }
  }

  // --- Hotel Images Endpoints ---

  static async uploadImage(req: NextRequest, hotelIdStr: string) {
    try {
      await connectDB();
      const currentUser = await authenticateRequest(req);
      requireRoles(currentUser, [UserRole.ADMIN, UserRole.MANAGER]);

      const hotel_id = this.parseId(hotelIdStr);

      const formData = await req.formData();
      const file = formData.get('file') as File;
      const sortOrderStr = formData.get('sort_order') as string | null;
      const sort_order = sortOrderStr ? parseInt(sortOrderStr, 10) : 0;

      if (!file) {
        throw new AppError('No file uploaded', 400);
      }

      // Check format
      const validTypes = ['image/jpeg', 'image/png', 'image/webp'];
      if (!validTypes.includes(file.type)) {
        throw new AppError('Invalid file type. Only JPEG, PNG and WEBP are allowed.', 400);
      }

      // Read file into Buffer
      const arrayBuffer = await file.arrayBuffer();
      const buffer = Buffer.from(arrayBuffer);

      // Create uploads folder if not exists
      const uploadDir = path.join(process.cwd(), 'public', 'uploads', 'hotels');
      await fs.mkdir(uploadDir, { recursive: true });

      // Save file
      const filename = `${Date.now()}_${file.name.replace(/\s+/g, '_')}`;
      const filePath = path.join(uploadDir, filename);
      await fs.writeFile(filePath, buffer);

      const relativePath = `/uploads/hotels/${filename}`;

      // Call Service
      const result = await hotelService.addHotelImage(hotel_id, {
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

  static async deleteImage(req: NextRequest, hotelIdStr: string, imageIdStr: string) {
    try {
      await connectDB();
      const currentUser = await authenticateRequest(req);
      requireRoles(currentUser, [UserRole.ADMIN, UserRole.MANAGER]);

      const hotel_id = this.parseId(hotelIdStr);
      const image_id = this.parseId(imageIdStr);

      const result = await hotelService.deleteHotelImage(hotel_id, image_id);

      return NextResponse.json(
        ResponseUtil.success('Image deleted successfully', result),
        { status: 200 },
      );
    } catch (error) {
      return errorHandler(error);
    }
  }
}
