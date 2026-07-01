import { NextRequest } from 'next/server';
import { PackageController } from '@/modules/packages/controllers/package.controller';

/**
 * @swagger
 * /api/packages/{id}/restore:
 *   post:
 *     summary: Restore a soft-deleted package
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
 *         description: Package restored successfully
 *       400:
 *         description: Package is not deleted
 *       404:
 *         description: Package not found
 */
export async function POST(request: NextRequest, props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  return PackageController.restore(request, params.id);
}
