import { NextRequest } from 'next/server';
import { StaffController } from '@/modules/staff/controllers/staff.controller';

export const GET  = (req: NextRequest) => StaffController.getAll(req);
export const POST = (req: NextRequest) => StaffController.create(req);
