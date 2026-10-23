import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { connectDB } from '@/shared/database/sequelize';
import { authenticateRequest, requireRoles } from '@/shared/middlewares/auth.middleware';
import { errorHandler } from '@/shared/middlewares/error.middleware';
import { ResponseUtil } from '@/shared/utils/response.util';
import { getAppSettings, saveAppSettings } from '@/shared/utils/app-settings.service';
import { previewInvoiceNumber, previewMembershipNumber, isMembershipNumberTaken } from '@/shared/utils/numbering';
import { UserRole } from '@/modules/users/types/user.types';

export const dynamic = 'force-dynamic';

const KIND = 'membership' as const;

const SeriesSchema = z.object({
  prefix: z.string().max(20).regex(/^[A-Za-z0-9\-_\/]*$/, 'Prefix may only contain letters, numbers, - _ /'),
  start_number: z.number().int().min(1).max(999999999),
  padding: z.number().int().min(1).max(10),
});

/** Package-derived prefix (first 3 letters of the package name), used when no fixed prefix is set. */
function packagePrefix(request: NextRequest) {
  const pkg = request.nextUrl.searchParams.get('package') ?? '';
  const clean = pkg.replace(/[^A-Za-z]/g, '').toUpperCase();
  return (clean.slice(0, 3) || 'MEM').padEnd(3, 'X');
}

/**
 * @swagger
 * /api/settings/membership-series:
 *   get:
 *     summary: Get the membership number series and the next number
 *     tags: [Settings]
 *     security:
 *       - BearerAuth: []
 *   put:
 *     summary: Update the membership number series (Admin only)
 *     description: Saving restarts the counter at start_number.
 *     tags: [Settings]
 *     security:
 *       - BearerAuth: []
 */
export async function GET(request: NextRequest) {
  try {
    await connectDB();
    const currentUser = await authenticateRequest(request);
    requireRoles(currentUser, [UserRole.ADMIN, UserRole.MANAGER]);
    const series = getAppSettings()[KIND];
    // ?check=<number> reports whether that number is already used by a membership
    const check = request.nextUrl.searchParams.get('check')?.trim();
    const taken = check ? await isMembershipNumberTaken(check) : undefined;
    return NextResponse.json(
      ResponseUtil.success('Series retrieved', { ...series, next: await previewMembershipNumber(packagePrefix(request)), taken }),
    );
  } catch (error) {
    return errorHandler(error);
  }
}

export async function PUT(request: NextRequest) {
  try {
    await connectDB();
    const currentUser = await authenticateRequest(request);
    requireRoles(currentUser, [UserRole.ADMIN]);
    const body = SeriesSchema.parse(await request.json());
    const settings = getAppSettings();
    settings[KIND] = { ...body, next_number: body.start_number };
    saveAppSettings(settings);
    return NextResponse.json(
      ResponseUtil.success('Series updated', { ...settings[KIND], next: await previewMembershipNumber(packagePrefix(request)) }),
    );
  } catch (error) {
    return errorHandler(error);
  }
}
