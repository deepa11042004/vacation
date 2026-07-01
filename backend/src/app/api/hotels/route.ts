import { NextRequest } from 'next/server';
import { HotelController } from '@/modules/hotels/controllers/hotel.controller';

/**
 * @swagger
 * /api/hotels:
 *   post:
 *     summary: Create a new hotel
 *     tags: [Hotels]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [location_id, hotel_name, property_type, hotel_type]
 *             properties:
 *               location_id: { type: integer, example: 1 }
 *               hotel_name: { type: string, example: "Leela Palace" }
 *               property_type: { type: string, enum: [INTERNAL_PROPERTY, ASSOCIATED_PROPERTY], example: "INTERNAL_PROPERTY" }
 *               hotel_type: { type: string, enum: [HOTEL, RESORT, VILLA, APARTMENT, HOMESTAY, GUEST_HOUSE], example: "RESORT" }
 *               address: { type: string, example: "Goa Beach Road" }
 *               map_link: { type: string, example: "https://maps.google.com/..." }
 *               description: { type: string, example: "Luxury beach resort" }
 *               remarks: { type: string, example: "Good feedback" }
 *     responses:
 *       201:
 *         description: Hotel created successfully
 *       400:
 *         description: Unique constraint name per location, or validation error
 *   get:
 *     summary: Get all hotels
 *     tags: [Hotels]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: query
 *         name: search
 *         schema: { type: string }
 *       - in: query
 *         name: location_id
 *         schema: { type: integer }
 *       - in: query
 *         name: property_type
 *         schema: { type: string, enum: [INTERNAL_PROPERTY, ASSOCIATED_PROPERTY] }
 *       - in: query
 *         name: hotel_type
 *         schema: { type: string, enum: [HOTEL, RESORT, VILLA, APARTMENT, HOMESTAY, GUEST_HOUSE] }
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
 *         description: Hotels retrieved successfully
 */
export async function POST(request: NextRequest) {
  return HotelController.create(request);
}

export async function GET(request: NextRequest) {
  return HotelController.getAll(request);
}
