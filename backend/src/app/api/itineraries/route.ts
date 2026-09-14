import { NextRequest } from 'next/server';
import { ItineraryController } from '@/modules/itineraries/controllers/itinerary.controller';

/**
 * @swagger
 * /api/itineraries:
 *   post:
 *     summary: Create a new itinerary
 *     tags: [Itineraries]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name, destination, type, days, nights]
 *             properties:
 *               name: { type: string, example: "Goa Sunkissed Shores & Beach Serenity" }
 *               destination: { type: string, example: "Goa, India" }
 *               type: { type: string, enum: [DOMESTIC, INTERNATIONAL] }
 *               category: { type: string, example: "Beach & Coastal" }
 *               badge: { type: string, example: "Coastal Luxury" }
 *               duration: { type: string, example: "5 Days / 4 Nights" }
 *               days: { type: integer, example: 5 }
 *               nights: { type: integer, example: 4 }
 *               best_time: { type: string, example: "October to May" }
 *               image: { type: string }
 *               short_desc: { type: string }
 *               highlights: { type: array, items: { type: string } }
 *               inclusions: { type: array, items: { type: string } }
 *               schedule:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     day: { type: string, example: "Day 1" }
 *                     title: { type: string }
 *                     desc: { type: string }
 *     responses:
 *       201:
 *         description: Itinerary created successfully
 *       400:
 *         description: Validation error
 *   get:
 *     summary: Get all itineraries
 *     tags: [Itineraries]
 *     parameters:
 *       - in: query
 *         name: search
 *         schema: { type: string }
 *       - in: query
 *         name: type
 *         schema: { type: string, enum: [DOMESTIC, INTERNATIONAL] }
 *       - in: query
 *         name: category
 *         schema: { type: string }
 *       - in: query
 *         name: status
 *         schema: { type: string, enum: [ACTIVE, INACTIVE] }
 *       - in: query
 *         name: includeDeleted
 *         schema: { type: boolean, default: false }
 *       - in: query
 *         name: page
 *         schema: { type: integer, default: 1 }
 *       - in: query
 *         name: limit
 *         schema: { type: integer, default: 10 }
 *     responses:
 *       200:
 *         description: Itineraries retrieved successfully
 */
export async function POST(request: NextRequest) {
  return ItineraryController.create(request);
}

export async function GET(request: NextRequest) {
  return ItineraryController.getAll(request);
}
