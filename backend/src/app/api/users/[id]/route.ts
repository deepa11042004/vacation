import { NextRequest } from 'next/server';
import { UserController } from '@/modules/users/controllers/user.controller';

/**
 * @swagger
 * /api/users/{id}:
 *   get:
 *     summary: Get a User by ID
 *     description: Retrieves details of a specific user (Admin, Manager, or the user themselves).
 *     tags: [Users]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: User profile retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UserResponse'
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: User not found
 */
export async function GET(request: NextRequest, props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  return UserController.getById(request, params.id);
}

/**
 * @swagger
 * /api/users/{id}:
 *   put:
 *     summary: Update User Details
 *     description: Updates a user's details. Normal users can only update their own profile and cannot change role/status.
 *     tags: [Users]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email: { type: string, format: email, example: "updated@example.com" }
 *               password: { type: string, example: "newpassword123" }
 *               role: { type: string, enum: [ADMIN, AGENT, MANAGER, CLIENT], example: "AGENT" }
 *               status: { type: string, enum: [ACTIVE, INACTIVE], example: "ACTIVE" }
 *               client_id: { type: integer, example: null }
 *     responses:
 *       200:
 *         description: User updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UserResponse'
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       404:
 *         description: User not found
 */
export async function PUT(request: NextRequest, props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  return UserController.update(request, params.id);
}

/**
 * @swagger
 * /api/users/{id}:
 *   delete:
 *     summary: Soft Delete User
 *     description: Soft deletes a user account (Admin only).
 *     tags: [Users]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: User deleted successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success: { type: boolean, example: true }
 *                 message: { type: string, example: "User deleted successfully" }
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden (Admin only)
 *       404:
 *         description: User not found
 */
export async function DELETE(request: NextRequest, props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  return UserController.delete(request, params.id);
}
