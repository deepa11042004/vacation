import { NextRequest } from 'next/server';
import { PackageController } from '@/modules/packages/controllers/package.controller';

/**
 * @swagger
 * /api/packages/{id}:
 *   get:
 *     summary: Get a package by ID
 *     tags: [Packages]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Package retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PackageResponse'
 *       404:
 *         description: Package not found
 */
export async function GET(request: NextRequest, props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  return PackageController.getById(request, params.id);
}

/**
 * @swagger
 * /api/packages/{id}:
 *   put:
 *     summary: Update a package
 *     description: Update any field of a package. Admin only.
 *     tags: [Packages]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               category:
 *                 type: string
 *                 enum: [SILVER, GOLD, PLATINUM]
 *               validity_years:
 *                 type: integer
 *               total_nights:
 *                 type: integer
 *               nights_per_year:
 *                 type: integer
 *               unit_type:
 *                 type: string
 *                 enum: [STUDIO, 1BHK, 2BHK, SUITE]
 *               max_adults:
 *                 type: integer
 *               max_children:
 *                 type: integer
 *               base_price:
 *                 type: number
 *               amc_amount:
 *                 type: number
 *               description:
 *                 type: string
 *               status:
 *                 type: string
 *                 enum: [ACTIVE, INACTIVE]
 *     responses:
 *       200:
 *         description: Package updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PackageResponse'
 *       400:
 *         description: Validation error or duplicate name
 *       404:
 *         description: Package not found
 */
export async function PUT(request: NextRequest, props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  return PackageController.update(request, params.id);
}

/**
 * @swagger
 * /api/packages/{id}:
 *   delete:
 *     summary: Soft delete a package
 *     description: Marks the package as deleted. Admin only. Deleted packages cannot be assigned to new memberships.
 *     tags: [Packages]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Package deleted successfully
 *       404:
 *         description: Package not found
 */
export async function DELETE(request: NextRequest, props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  return PackageController.delete(request, params.id);
}
