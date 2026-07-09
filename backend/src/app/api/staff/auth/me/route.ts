import { NextRequest } from 'next/server';
import { StaffAuthController } from '@/modules/staff/controllers/staff-auth.controller';

export const GET = (req: NextRequest) => StaffAuthController.me(req);
