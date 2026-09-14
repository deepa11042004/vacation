import { NextRequest } from 'next/server';
import { VoucherController } from '@/modules/vouchers/controllers/voucher.controller';

/**
 * @swagger
 * /api/vouchers:
 *   post:
 *     summary: Create a new gift voucher
 *     tags: [Vouchers]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [applicant, email, phone, locations, benefit]
 *             properties:
 *               voucher_number: { type: string }
 *               voucher_type: { type: string, enum: [Member, Non Member] }
 *               applicant: { type: string }
 *               spouse: { type: string }
 *               email: { type: string }
 *               phone: { type: string }
 *               locations: { type: array, items: { type: string } }
 *               benefit: { type: string }
 *               issue_date: { type: string, format: date }
 *               validity: { type: string }
 *               terms_and_conditions: { type: string }
 *     responses:
 *       201:
 *         description: Voucher created successfully
 *       400:
 *         description: Validation error
 *   get:
 *     summary: Get all vouchers
 *     tags: [Vouchers]
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: query
 *         name: search
 *         schema: { type: string }
 *       - in: query
 *         name: voucher_type
 *         schema: { type: string, enum: [Member, Non Member] }
 *       - in: query
 *         name: status
 *         schema: { type: string, enum: [ACTIVE, REDEEMED, EXPIRED] }
 *       - in: query
 *         name: from_date
 *         schema: { type: string, format: date }
 *       - in: query
 *         name: to_date
 *         schema: { type: string, format: date }
 *       - in: query
 *         name: page
 *         schema: { type: integer, default: 1 }
 *       - in: query
 *         name: limit
 *         schema: { type: integer, default: 10 }
 *     responses:
 *       200:
 *         description: Vouchers retrieved successfully
 */
export async function POST(request: NextRequest) {
  return VoucherController.create(request);
}

export async function GET(request: NextRequest) {
  return VoucherController.getAll(request);
}
