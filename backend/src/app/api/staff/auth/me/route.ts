import { NextRequest } from 'next/server';
import { StaffAuthController } from '@/modules/staff/controllers/staff-auth.controller';

/**
 * @swagger
 * /api/staff/auth/me:
 *   get:
 *     summary: Get current staff member profile
 *     description: Returns the authenticated staff member's profile using the Bearer token.
 *     tags: [Staff]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Staff profile retrieved successfully
 *       401:
 *         description: Unauthorized
 */
export const GET = (req: NextRequest) => StaffAuthController.me(req);
