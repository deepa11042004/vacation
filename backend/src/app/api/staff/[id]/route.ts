import { NextRequest } from 'next/server';
import { StaffController } from '@/modules/staff/controllers/staff.controller';

type Props = { params: Promise<{ id: string }> };

export const GET    = async (req: NextRequest, p: Props) => StaffController.getById(req, (await p.params).id);
export const PUT    = async (req: NextRequest, p: Props) => StaffController.update(req, (await p.params).id);
export const DELETE = async (req: NextRequest, p: Props) => StaffController.delete(req, (await p.params).id);
