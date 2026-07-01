import { NextRequest } from 'next/server';
import { PackageController } from '@/modules/packages/controllers/package.controller';

/**
 * @swagger
 * components:
 *   schemas:
 *     Package:
 *       type: object
 *       properties:
 *         package_id:
 *           type: integer
 *           example: 1
 *         package_code:
 *           type: string
 *           example: "PKG-000001"
 *         name:
 *           type: string
 *           example: "Gold 5-Year Premium"
 *         category:
 *           type: string
 *           enum: [SILVER, GOLD, PLATINUM]
 *           example: "GOLD"
 *         validity_years:
 *           type: integer
 *           example: 5
 *         total_nights:
 *           type: integer
 *           example: 25
 *         nights_per_year:
 *           type: integer
 *           example: 5
 *         unit_type:
 *           type: string
 *           enum: [STUDIO, 1BHK, 2BHK, SUITE]
 *           example: "1BHK"
 *         max_adults:
 *           type: integer
 *           example: 2
 *         max_children:
 *           type: integer
 *           example: 1
 *         base_price:
 *           type: number
 *           format: float
 *           example: 350000.00
 *         amc_amount:
 *           type: number
 *           format: float
 *           example: 12000.00
 *         description:
 *           type: string
 *           nullable: true
 *           example: "5-year gold membership with 1BHK unit"
 *         status:
 *           type: string
 *           enum: [ACTIVE, INACTIVE]
 *           example: "ACTIVE"
 *         created_at:
 *           type: string
 *           format: date-time
 *         updated_at:
 *           type: string
 *           format: date-time
 *     PackageResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: true
 *         message:
 *           type: string
 *         data:
 *           $ref: '#/components/schemas/Package'
 *     PackageListResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: true
 *         message:
 *           type: string
 *         data:
 *           type: object
 *           properties:
 *             packages:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Package'
 *             total:
 *               type: integer
 *             page:
 *               type: integer
 *             limit:
 *               type: integer
 */

/**
 * @swagger
 * /api/packages:
 *   post:
 *     summary: Create a new package
 *     description: Create a holiday membership package under a category (SILVER, GOLD, PLATINUM). Admin only.
 *     tags: [Packages]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name, category, validity_years, total_nights, nights_per_year, unit_type, base_price, amc_amount]
 *             properties:
 *               name:
 *                 type: string
 *                 example: "Gold 5-Year Premium"
 *               category:
 *                 type: string
 *                 enum: [SILVER, GOLD, PLATINUM]
 *               validity_years:
 *                 type: integer
 *                 example: 5
 *               total_nights:
 *                 type: integer
 *                 example: 25
 *               nights_per_year:
 *                 type: integer
 *                 example: 5
 *               unit_type:
 *                 type: string
 *                 enum: [STUDIO, 1BHK, 2BHK, SUITE]
 *               max_adults:
 *                 type: integer
 *                 example: 2
 *               max_children:
 *                 type: integer
 *                 example: 1
 *               base_price:
 *                 type: number
 *                 example: 350000
 *               amc_amount:
 *                 type: number
 *                 example: 12000
 *               description:
 *                 type: string
 *     responses:
 *       201:
 *         description: Package created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PackageResponse'
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden (Admin only)
 */
export async function POST(request: NextRequest) {
  return PackageController.create(request);
}

/**
 * @swagger
 * /api/packages:
 *   get:
 *     summary: List all packages
 *     description: Returns a paginated list of packages. Filter by category, status, or search by name/code.
 *     tags: [Packages]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *           enum: [SILVER, GOLD, PLATINUM]
 *         description: Filter by package category
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *           enum: [ACTIVE, INACTIVE]
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search by name, code, or description
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *           default: 1
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *     responses:
 *       200:
 *         description: Packages retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PackageListResponse'
 */
export async function GET(request: NextRequest) {
  return PackageController.getAll(request);
}
