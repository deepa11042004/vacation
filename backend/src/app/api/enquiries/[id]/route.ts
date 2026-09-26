import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/shared/database/sequelize';
import { EnquiryRepository } from '@/modules/enquiries/repositories/enquiry.repository';
import { ResponseUtil } from '@/shared/utils/response.util';
import { errorHandler, AppError } from '@/shared/middlewares/error.middleware';

const repo = new EnquiryRepository();

// GET /api/enquiries/[id]
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const { id: idStr } = await params;
    const id = parseInt(idStr, 10);
    if (isNaN(id)) throw new AppError('Invalid ID', 400);

    const enquiry = await repo.findById(id);
    if (!enquiry) throw new AppError('Enquiry not found', 404);

    return NextResponse.json(ResponseUtil.success('Enquiry fetched', enquiry));
  } catch (error) {
    return errorHandler(error);
  }
}

// PATCH /api/enquiries/[id] — update status and/or notes
export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const { id: idStr } = await params;
    const id = parseInt(idStr, 10);
    if (isNaN(id)) throw new AppError('Invalid ID', 400);

    const enquiry = await repo.findById(id);
    if (!enquiry) throw new AppError('Enquiry not found', 404);

    const body = await req.json();
    const updateData: any = {};
    if (body.status !== undefined) updateData.status = body.status;
    if (body.notes !== undefined) updateData.notes = body.notes;

    await repo.update(id, updateData);
    const updated = await repo.findById(id);

    return NextResponse.json(ResponseUtil.success('Enquiry updated', updated));
  } catch (error) {
    return errorHandler(error);
  }
}

// DELETE /api/enquiries/[id]
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await connectDB();
    const { id: idStr } = await params;
    const id = parseInt(idStr, 10);
    if (isNaN(id)) throw new AppError('Invalid ID', 400);

    const enquiry = await repo.findById(id);
    if (!enquiry) throw new AppError('Enquiry not found', 404);

    await repo.delete(id);
    return NextResponse.json(ResponseUtil.success('Enquiry deleted successfully', null));
  } catch (error) {
    return errorHandler(error);
  }
}
