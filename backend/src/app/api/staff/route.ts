import { NextRequest } from 'next/server';
import { StaffController } from '@/modules/staff/controllers/staff.controller';

/**
 * @swagger
 * /api/staff:
 *   get:
 *     summary: List all staff members
 *     tags: [Staff]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: query
 *         name: search
 *         schema: { type: string }
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
 *         description: Staff list retrieved successfully
 *   post:
 *     summary: Create a staff member
 *     tags: [Staff]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name, email, password]
 *             properties:
 *               name:     { type: string, example: "Rahul Sharma" }
 *               email:    { type: string, format: email }
 *               password: { type: string, minLength: 6 }
 *               mobile:   { type: string }
 *               status:   { type: string, enum: [ACTIVE, INACTIVE], default: ACTIVE }
 *     responses:
 *       201:
 *         description: Staff member created successfully
 */
export const GET  = (req: NextRequest) => StaffController.getAll(req);
export const POST = (req: NextRequest) => StaffController.create(req);
