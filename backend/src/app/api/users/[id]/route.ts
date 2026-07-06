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
 *     summary: Update Panel User
 *     description: Updates a panel user's details (Admin only). To reset a password use POST /api/users/{id}/reset-password instead.
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
 *               first_name: { type: string, nullable: true, example: "John" }
 *               last_name: { type: string, nullable: true, example: "Doe" }
 *               role: { type: string, enum: [ADMIN, MANAGER, AGENT], example: "MANAGER" }
 *               status: { type: string, enum: [ACTIVE, INACTIVE], example: "ACTIVE" }
 *               allowed_sections:
 *                 type: array
 *                 nullable: true
 *                 description: "Section keys to grant access. Pass null for full access (ADMIN). Pass [] to deny all."
 *                 items: { type: string }
 *                 example: ["dashboard", "clients"]
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
