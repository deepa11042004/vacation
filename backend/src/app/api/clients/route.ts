import { NextRequest } from 'next/server';
import { ClientController } from '@/modules/clients/controllers/client.controller';

/**
 * @swagger
 * components:
 *   schemas:
 *     Client:
 *       type: object
 *       properties:
 *         client_id:
 *           type: integer
 *           example: 1
 *         client_code:
 *           type: string
 *           example: "CLI-000001"
 *         title:
 *           type: string
 *           example: "Mr"
 *         first_name:
 *           type: string
 *           example: "John"
 *         middle_name:
 *           type: string
 *           example: "D."
 *         last_name:
 *           type: string
 *           example: "Doe"
 *         gender:
 *           type: string
 *           enum: [MALE, FEMALE, OTHER]
 *           example: "MALE"
 *         date_of_birth:
 *           type: string
 *           format: date
 *           example: "1990-05-15"
 *         mobile:
 *           type: string
 *           example: "1234567890"
 *         alternate_mobile:
 *           type: string
 *           example: "0987654321"
 *         email:
 *           type: string
 *           format: email
 *           example: "john.doe@example.com"
 *         country_code:
 *           type: string
 *           example: "+1"
 *         profile_photo:
 *           type: string
 *           format: uri
 *           example: "https://example.com/photo.jpg"
 *         status:
 *           type: string
 *           enum: [ACTIVE, INACTIVE]
 *           example: "ACTIVE"
 *         remarks:
 *           type: string
 *           example: "Frequent traveler."
 *         created_by:
 *           type: integer
 *           nullable: true
 *           example: null
 *         updated_by:
 *           type: integer
 *           nullable: true
 *           example: null
 *         created_at:
 *           type: string
 *           format: date-time
 *           example: "2026-07-01T10:44:38.000Z"
 *         updated_at:
 *           type: string
 *           format: date-time
 *           example: "2026-07-01T10:44:38.000Z"
 *         deleted_at:
 *           type: string
 *           format: date-time
 *           nullable: true
 *           example: null
 *     ClientResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: true
 *         message:
 *           type: string
 *           example: "Client operation successful"
 *         data:
 *           $ref: '#/components/schemas/Client'
 *     ClientListResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: true
 *         message:
 *           type: string
 *           example: "Clients retrieved successfully"
 *         data:
 *           type: object
 *           properties:
 *             clients:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Client'
 *             total:
 *               type: integer
 *               example: 1
 *             page:
 *               type: integer
 *               example: 1
 *             limit:
 *               type: integer
 *               example: 10
 *     ApiErrorResponse:
 *       type: object
 *       properties:
 *         success:
 *           type: boolean
 *           example: false
 *         message:
 *           type: string
 *           example: "Operation failed"
 *         errors:
 *           type: array
 *           items:
 *             type: object
 */

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
 *               title: { type: string, description: "e.g., Mr, Mrs, Ms" }
 *               first_name: { type: string }
 *               middle_name: { type: string }
 *               last_name: { type: string }
 *               gender: { type: string, enum: [MALE, FEMALE, OTHER] }
 *               mobile: { type: string }
 *               alternate_mobile: { type: string }
 *               email: { type: string }
 *               country_code: { type: string }
 *               profile_photo: { type: string }
 *               remarks: { type: string }
 *     responses:
 *       201:
 *         description: Client created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ClientResponse'
 *       400:
 *         description: Validation or Bad Request
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiErrorResponse'
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
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ClientListResponse'
 */
export async function GET(request: NextRequest) {
  return ClientController.getAll(request);
}
