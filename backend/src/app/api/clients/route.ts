import { NextRequest } from 'next/server';
import { ClientController } from '@/modules/clients/controllers/client.controller';

/**
 * @swagger
 * /api/clients:
 *   post:
 *     summary: Create a new client
 *     description: Creates a master profile for a customer in the system.
 *     tags: [Clients]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [first_name, last_name, gender, mobile, email, country_code]
 *             properties:
 *               first_name: { type: string }
 *               middle_name: { type: string }
 *               last_name: { type: string }
 *               gender: { type: string, enum: [MALE, FEMALE, OTHER] }
 *               mobile: { type: string }
 *               email: { type: string }
 *               country_code: { type: string }
 *               password: { type: string }
 *     responses:
 *       201:
 *         description: Client created successfully
 *       400:
 *         description: Validation or Bad Request
 */
export async function POST(request: NextRequest) {
  return ClientController.create(request);
}

/**
 * @swagger
 * /api/clients:
 *   get:
 *     summary: Retrieve a list of clients
 *     description: Retrieve all clients with optional pagination and filtering.
 *     tags: [Clients]
 *     parameters:
 *       - in: query
 *         name: search
 *         schema: { type: string }
 *         description: Search by name, email, mobile, or client code
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
 *         description: A list of clients
 */
export async function GET(request: NextRequest) {
  return ClientController.getAll(request);
}
