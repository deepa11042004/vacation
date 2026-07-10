import { NextRequest, NextResponse } from 'next/server';
import { connectDB } from '@/shared/database/sequelize';
import { authenticateRequest } from '@/shared/middlewares/auth.middleware';
import { errorHandler, AppError } from '@/shared/middlewares/error.middleware';
import { ResponseUtil } from '@/shared/utils/response.util';
import { MembershipRepository } from '@/modules/memberships/repositories/membership.repository';

const repo = new MembershipRepository();

/**
 * @swagger
 * /api/memberships/lookup:
 *   get:
 *     summary: Look up a membership by number
 *     description: Validates a membership number and returns basic member info. Used by the referral lookup widget during client onboarding.
 *     tags: [Memberships]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: query
 *         name: membership_no
 *         required: true
 *         schema: { type: string, example: "MEM-00001" }
 *         description: The membership number to look up
 *     responses:
 *       200:
 *         description: Membership found
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean, example: true }
 *                 data:
 *                   type: object
 *                   properties:
 *                     membership_id:     { type: integer, example: 5 }
 *                     membership_number: { type: string, example: "MEM-00005" }
 *                     status:            { type: string, example: "ACTIVE" }
 *                     client:
 *                       type: object
 *                       properties:
 *                         first_name: { type: string }
 *                         last_name:  { type: string }
 *                         mobile:     { type: string }
 *       400:
 *         description: membership_no query param missing
 *       404:
 *         description: Membership not found
 */
export async function GET(request: NextRequest) {
  try {
    await connectDB();
    await authenticateRequest(request);

    const membership_no = request.nextUrl.searchParams.get('membership_no')?.trim();
    if (!membership_no) throw new AppError('membership_no query param is required', 400);

    const membership = await repo.findByMembershipNumber(membership_no);
    if (!membership) throw new AppError('No membership found with that number', 404);

    const client = (membership as any).client;

    return NextResponse.json(
      ResponseUtil.success('Membership found', {
        membership_id:     membership.membership_id,
        membership_number: membership.membership_number,
        status:            membership.status,
        client: client
          ? { first_name: client.first_name, last_name: client.last_name, mobile: client.mobile }
          : null,
      }),
    );
  } catch (error) {
    return errorHandler(error);
  }
}
