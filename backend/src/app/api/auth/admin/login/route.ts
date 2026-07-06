import { NextRequest } from 'next/server';
import { AuthController } from '@/modules/auth/controllers/auth.controller';

/**
 * @swagger
 * /api/auth/admin/login:
 *   post:
 *     summary: Panel Login
 *     description: Authenticates panel staff credentials and returns tokens. Accessible to ADMIN, MANAGER, and AGENT roles. CLIENT accounts are rejected with 403.
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, password]
 *             properties:
 *               email: { type: string, format: email, example: "admin@example.com" }
 *               password: { type: string, example: "password123" }
 *     responses:
 *       200:
 *         description: Login successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean, example: true }
 *                 message: { type: string, example: "Logged in successfully" }
 *                 data:
 *                   type: object
 *                   properties:
 *                     accessToken: { type: string }
 *                     refreshToken: { type: string }
 *                     user:
 *                       $ref: '#/components/schemas/User'
 *       401:
 *         description: Invalid credentials
 *       403:
 *         description: Forbidden — CLIENT accounts cannot access the panel
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiErrorResponse'
 */
export async function POST(request: NextRequest) {
  return AuthController.adminLogin(request);
}
