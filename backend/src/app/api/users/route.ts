import { NextRequest } from 'next/server';
import { UserController } from '@/modules/users/controllers/user.controller';

/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       properties:
 *         user_id:
 *           type: integer
 *           example: 1
 *         client_id:
 *           type: integer
 *           nullable: true
 *           example: null
 *         email:
 *           type: string
 *           format: email
 *           example: "agent@example.com"
 *         role:
 *           type: string
 *           enum: [ADMIN, AGENT, MANAGER, CLIENT]
 *           example: "AGENT"
 *         status:
 *           type: string
 *           enum: [ACTIVE, INACTIVE]
 *           example: "ACTIVE"
 *         created_by:
 *           type: integer
 *           nullable: true
 *           example: null
 *         updated_by:
 *           type: integer
 *           nullable: true
 *           example: null
 *         created_at:
 *           type: string
 *           format: date-time
 *           example: "2026-07-01T10:44:38.000Z"
 *         updated_at:
 *           type: string
 *           format: date-time
 *           example: "2026-07-01T10:44:38.000Z"
 *         client:
 *           $ref: '#/components/schemas/Client'
 *           nullable: true
 *     UserResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: true
 *         message:
 *           type: string
 *           example: "User operation successful"
 *         data:
 *           $ref: '#/components/schemas/User'
 *     UserListResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: true
 *         message:
 *           type: string
 *           example: "Users retrieved successfully"
 *         data:
 *           type: object
 *           properties:
 *             users:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/User'
 *             total:
 *               type: integer
 *               example: 1
 *             page:
 *               type: integer
 *               example: 1
 *             limit:
 *               type: integer
 *               example: 10
 */

/**
 * @swagger
 * /api/users:
 *   post:
 *     summary: Create a User
 *     description: Creates a user account in the system (Admin only).
 *     tags: [Users]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, password]
 *             properties:
 *               email: { type: string, format: email, example: "newagent@example.com" }
 *               password: { type: string, example: "password123" }
 *               role: { type: string, enum: [ADMIN, AGENT, MANAGER, CLIENT], example: "AGENT" }
 *               status: { type: string, enum: [ACTIVE, INACTIVE], example: "ACTIVE" }
 *               client_id: { type: integer, example: null }
 *     responses:
 *       201:
 *         description: User created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UserResponse'
 *       400:
 *         description: Validation or Bad Request
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiErrorResponse'
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden (Admin only)
 */
export async function POST(request: NextRequest) {
  return UserController.create(request);
}

/**
 * @swagger
 * /api/users:
 *   get:
 *     summary: Get Users List
 *     description: Retrieves users list (Admin/Manager only).
 *     tags: [Users]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: query
 *         name: search
 *         schema: { type: string }
 *         description: Search by email
 *       - in: query
 *         name: role
 *         schema: { type: string, enum: [ADMIN, AGENT, MANAGER, CLIENT] }
 *       - in: query
 *         name: status
 *         schema: { type: string, enum: [ACTIVE, INACTIVE] }
 *       - in: query
 *         name: page
 *         schema: { type: integer, default: 1 }
 *       - in: query
 *         name: limit
 *         schema: { type: integer, default: 10 }
 *     responses:
 *       200:
 *         description: Users list retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UserListResponse'
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 */
export async function GET(request: NextRequest) {
  return UserController.getAll(request);
}
