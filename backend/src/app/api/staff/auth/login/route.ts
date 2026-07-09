import { NextRequest } from 'next/server';
import { StaffAuthController } from '@/modules/staff/controllers/staff-auth.controller';

export const POST = (req: NextRequest) => StaffAuthController.login(req);
