import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/shared/database/sequelize';
import { EnquiryRepository } from '@/modules/enquiries/repositories/enquiry.repository';
import { EnquiryStatus } from '@/modules/enquiries/interfaces/enquiry.interface';
import { ResponseUtil } from '@/shared/utils/response.util';
import { errorHandler, AppError } from '@/shared/middlewares/error.middleware';

const repo = new EnquiryRepository();

// GET /api/enquiries — list enquiries with optional search & status filter
export async function GET(req: NextRequest) {
  try {
    await connectDB();

    const { searchParams } = new URL(req.url);
    const search = searchParams.get('search') || undefined;
    const status = (searchParams.get('status') || undefined) as EnquiryStatus | undefined;
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = parseInt(searchParams.get('limit') || '20', 10);

    const { rows, count } = await repo.findAll({ search, status, page, limit });

    return NextResponse.json(
      ResponseUtil.success('Enquiries fetched successfully', {
        enquiries: rows,
        total: count,
        page,
        limit,
      }),
      { status: 200 }
    );
  } catch (error) {
    return errorHandler(error);
  }
}

// POST /api/enquiries — create a new enquiry
export async function POST(req: NextRequest) {
  try {
    await connectDB();
    const body = await req.json();

    const { name, mobile, city, age, email, hotel_name, query, check_in, check_out, guests } = body;

    if (!name || !mobile || !email) {
      throw new AppError('Name, mobile and email are required', 400);
    }

    const newEnquiry = await repo.create({
      name: String(name).trim(),
      mobile: String(mobile).trim(),
      city: city ? String(city).trim() : null,
      age: age ? String(age).trim() : null,
      email: String(email).trim(),
      hotel_name: hotel_name ? String(hotel_name).trim() : null,
      query: query ? String(query).trim() : null,
      check_in: check_in ? String(check_in).trim() : null,
      check_out: check_out ? String(check_out).trim() : null,
      guests: guests ? String(guests).trim() : null,
      status: EnquiryStatus.NEW,
    });

    return NextResponse.json(
      ResponseUtil.success('Enquiry submitted successfully', newEnquiry),
      { status: 201 }
    );
  } catch (error) {
    return errorHandler(error);
  }
}
