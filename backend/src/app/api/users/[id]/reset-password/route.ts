import { NextRequest } from 'next/server';
import { UserController } from '@/modules/users/controllers/user.controller';

/**
 * @swagger
 * /api/users/{id}/reset-password:
 *   post:
 *     summary: Reset a user's password
 *     description: Sets a new password for the specified panel user (Admin only). Use this instead of PUT /api/users/{id} when the only change is the password.
 *     tags: [Users]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *         description: ID of the user whose password is being reset
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [password]
 *             properties:
 *               password:
 *                 type: string
 *                 minLength: 6
 *                 example: "newSecurePass123"
 *                 description: New plain-text password (min 6 characters). Stored hashed.
 *     responses:
 *       200:
 *         description: Password reset successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean, example: true }
 *                 message: { type: string, example: "Password reset successfully" }
 *       400:
 *         description: Validation error — password too short or missing
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiErrorResponse'
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden — Admin only
 *       404:
 *         description: User not found
 */
export async function POST(request: NextRequest, props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  return UserController.resetPassword(request, params.id);
}
