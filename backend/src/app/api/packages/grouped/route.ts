import { NextRequest } from 'next/server';
import { PackageController } from '@/modules/packages/controllers/package.controller';

/**
 * @swagger
 * /api/packages/grouped:
 *   get:
 *     summary: Get all packages grouped by category
 *     description: Returns packages organised under SILVER, GOLD, and PLATINUM keys. Useful for frontend listing pages.
 *     tags: [Packages]
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Packages grouped by category
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                 data:
 *                   type: object
 *                   properties:
 *                     SILVER:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/Package'
 *                     GOLD:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/Package'
 *                     PLATINUM:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/Package'
 */
export async function GET(request: NextRequest) {
  return PackageController.getGrouped(request);
}
