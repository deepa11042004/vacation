import { NextRequest } from 'next/server';
import { StaffController } from '@/modules/staff/controllers/staff.controller';

type Props = { params: Promise<{ id: string }> };

export const DELETE = async (req: NextRequest, p: Props) => StaffController.permanentDelete(req, (await p.params).id);
