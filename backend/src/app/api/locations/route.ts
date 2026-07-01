import { NextRequest } from 'next/server';
import { LocationController } from '@/modules/locations/controllers/location.controller';

/**
 * @swagger
 * /api/locations:
 *   post:
 *     summary: Create a new location
 *     tags: [Locations]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [location_name, country, type]
 *             properties:
 *               location_name: { type: string, example: "Goa" }
 *               country: { type: string, example: "India" }
 *               type: { type: string, enum: [DOMESTIC, INTERNATIONAL], example: "DOMESTIC" }
 *               map_link: { type: string, example: "https://maps.google.com/..." }
 *               location_image: { type: string, example: "https://example.com/image.jpg" }
 *               description: { type: string, example: "Beach destination" }
 *               remarks: { type: string, example: "Popular in winter" }
 *     responses:
 *       201:
 *         description: Location created successfully
 *       400:
 *         description: Name already exists or validation error
 *   get:
 *     summary: Get all locations
 *     tags: [Locations]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: query
 *         name: search
 *         schema: { type: string }
 *       - in: query
 *         name: type
 *         schema: { type: string, enum: [DOMESTIC, INTERNATIONAL] }
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
 *         description: Locations retrieved successfully
 */
export async function POST(request: NextRequest) {
  return LocationController.create(request);
}

export async function GET(request: NextRequest) {
  return LocationController.getAll(request);
}
