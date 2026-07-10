import { NextRequest } from 'next/server';
import { StaffController } from '@/modules/staff/controllers/staff.controller';

type Props = { params: Promise<{ id: string }> };

/**
 * @swagger
 * /api/staff/{id}:
 *   get:
 *     summary: Get staff member by ID
 *     tags: [Staff]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: Staff member retrieved successfully
 *       404:
 *         description: Staff member not found
 *   put:
 *     summary: Update a staff member
 *     tags: [Staff]
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
 *               name:     { type: string }
 *               email:    { type: string, format: email }
 *               mobile:   { type: string }
 *               status:   { type: string, enum: [ACTIVE, INACTIVE] }
 *               password: { type: string, minLength: 6 }
 *     responses:
 *       200:
 *         description: Staff member updated successfully
 *   delete:
 *     summary: Soft delete a staff member
 *     tags: [Staff]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema: { type: integer }
 *     responses:
 *       200:
 *         description: Staff member deleted successfully
 */
export const GET    = async (req: NextRequest, p: Props) => StaffController.getById(req, (await p.params).id);
export const PUT    = async (req: NextRequest, p: Props) => StaffController.update(req, (await p.params).id);
export const DELETE = async (req: NextRequest, p: Props) => StaffController.delete(req, (await p.params).id);
