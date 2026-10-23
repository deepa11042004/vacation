import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { authenticateRequest, requireRoles } from '@/shared/middlewares/auth.middleware';
import { errorHandler } from '@/shared/middlewares/error.middleware';
import { ResponseUtil } from '@/shared/utils/response.util';
import { getAppSettings, saveAppSettings } from '@/shared/utils/app-settings.service';
import { UserRole } from '@/modules/users/types/user.types';

export const dynamic = 'force-dynamic';

const GstSchema = z
  .object({
    slots: z
      .array(
        z.object({
          id: z.string().min(1).max(40),
          label: z.string().min(1).max(60),
          rate: z.number().min(0).max(100),
        }),
      )
      .min(1)
      .max(10),
    default_slot_id: z.string().min(1),
  })
  .refine(g => g.slots.some(s => s.id === g.default_slot_id), { message: 'Default slot must be one of the slots' })
  .refine(g => new Set(g.slots.map(s => s.id)).size === g.slots.length, { message: 'Slot ids must be unique' })
  .refine(g => new Set(g.slots.map(s => s.rate)).size === g.slots.length, { message: 'Each slot must have a different rate' });

/**
 * @swagger
 * /api/settings/gst:
 *   get:
 *     summary: Get GST slots used on tax invoices
 *     tags: [Settings]
 *     security:
 *       - BearerAuth: []
 *   put:
 *     summary: Update GST slots and the default slot (Admin only)
 *     tags: [Settings]
 *     security:
 *       - BearerAuth: []
 */
export async function GET(request: NextRequest) {
  try {
    const currentUser = await authenticateRequest(request);
    requireRoles(currentUser, [UserRole.ADMIN, UserRole.MANAGER]);
    return NextResponse.json(ResponseUtil.success('GST settings retrieved', getAppSettings().gst));
  } catch (error) {
    return errorHandler(error);
  }
}

export async function PUT(request: NextRequest) {
  try {
    const currentUser = await authenticateRequest(request);
    requireRoles(currentUser, [UserRole.ADMIN]);
    const gst = GstSchema.parse(await request.json());
    const settings = getAppSettings();
    settings.gst = gst;
    saveAppSettings(settings);
    return NextResponse.json(ResponseUtil.success('GST settings updated', gst));
  } catch (error) {
    return errorHandler(error);
  }
}
