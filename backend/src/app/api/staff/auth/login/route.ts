import { NextRequest } from 'next/server';
import { StaffAuthController } from '@/modules/staff/controllers/staff-auth.controller';

/**
 * @swagger
 * /api/staff/auth/login:
 *   post:
 *     summary: Staff login
 *     description: Authenticates a staff member and returns a JWT access token.
 *     tags: [Staff]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, password]
 *             properties:
 *               email:    { type: string, format: email, example: "staff@peltown.com" }
 *               password: { type: string, example: "password123" }
 *     responses:
 *       200:
 *         description: Login successful — returns access token
 *       401:
 *         description: Invalid credentials
 */
export const POST = (req: NextRequest) => StaffAuthController.login(req);
