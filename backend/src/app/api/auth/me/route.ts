import { NextRequest } from 'next/server';
import { AuthController } from '@/modules/auth/controllers/auth.controller';

/**
 * @swagger
 * /api/auth/me:
 *   get:
 *     summary: Get Current User Profile
 *     description: Retrieve the authenticated user's profile information.
 *     tags: [Authentication]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Profile retrieved successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean, example: true }
 *                 message: { type: string, example: "User profile retrieved successfully" }
 *                 data:
 *                   $ref: '#/components/schemas/User'
 *       401:
 *         description: Unauthorized
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiErrorResponse'
 */
export async function GET(request: NextRequest) {
  return AuthController.me(request);
}
