import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { OnboardService } from '@/modules/clients/services/onboard.service';
import { CreateClientSchema } from '@/modules/clients/validators/client.validator';
import { ResponseUtil } from '@/shared/utils/response.util';
import { errorHandler } from '@/shared/middlewares/error.middleware';
import { authenticateRequest, requireRoles } from '@/shared/middlewares/auth.middleware';
import { UserRole } from '@/modules/users/types/user.types';
import { connectDB } from '@/shared/database/sequelize';
import { PaymentMode } from '@/modules/payments/types/payment.types';
import { MembershipDSA } from '@/modules/memberships/types/membership.types';

const MembershipSchema = z.object({
  package_name:      z.string().min(1, 'Package name is required'),
  validity_years:    z.number().int().positive().optional().default(1),
  nights_per_year:   z.number().int().min(0).optional().default(0),
  sale_date:         z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Sale date must be YYYY-MM-DD'),
  total_price:       z.number().positive('Total price must be positive'),
  discount_amount:   z.number().min(0).optional().default(0),
  down_payment:      z.number().min(0).optional().default(0),
  amc:               z.number().min(0).optional().nullable(),
  payment_mode:      z.nativeEnum(PaymentMode, { errorMap: () => ({ message: 'Invalid payment mode' }) }),
  transaction_ref:   z.string().max(100).optional().nullable(),
  bank_name:         z.string().max(100).optional().nullable(),
  sales_consultant:  z.string().max(100).optional().nullable(),
  take_over_manager: z.string().max(100).optional().nullable(),
  dsa:                    z.nativeEnum(MembershipDSA, { errorMap: () => ({ message: 'Invalid DSA type' }) }).optional().nullable(),
  reference_by:           z.string().max(150).optional().nullable(),
  referrer_membership_id: z.number().int().positive().optional().nullable(),
  remarks:                z.string().optional().nullable(),
});

const AddressSchema = z.object({
  primary_address:   z.string().optional().nullable(),
  primary_state:     z.string().optional().nullable(),
  primary_pincode:   z.string().max(20).optional().nullable(),
  secondary_address: z.string().optional().nullable(),
  secondary_state:   z.string().optional().nullable(),
  secondary_pincode: z.string().max(20).optional().nullable(),
}).optional();

const OfferSchema = z.object({
  offer_name:  z.string().min(1).max(255),
  valid_until: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional().nullable(),
});

const OnboardSchema = z.object({
  client:     CreateClientSchema,
  address:    AddressSchema,
  membership: MembershipSchema,
  offers:     z.array(OfferSchema).optional().default([]),
});

const onboardService = new OnboardService();

/**
 * @swagger
 * /api/clients/onboard:
 *   post:
 *     summary: Onboard a new client in one shot
 *     description: |
 *       Creates a client profile, address, membership, and optional offers in a single atomic transaction.
 *       This is the primary endpoint used by the sales team when registering a new member.
 *       Admin / Manager only.
 *     tags: [Clients]
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [client, membership]
 *             properties:
 *               client:
 *                 type: object
 *                 description: Client profile fields (same as POST /api/clients)
 *                 required: [first_name, last_name, gender, mobile, email, country_code]
 *                 properties:
 *                   first_name:        { type: string }
 *                   last_name:         { type: string }
 *                   gender:            { type: string, enum: [MALE, FEMALE, OTHER] }
 *                   mobile:            { type: string }
 *                   email:             { type: string, format: email }
 *                   country_code:      { type: string, example: "+91" }
 *                   send_welcome_mail: { type: boolean, default: false }
 *               address:
 *                 type: object
 *                 nullable: true
 *                 properties:
 *                   primary_address:   { type: string }
 *                   primary_state:     { type: string }
 *                   primary_pincode:   { type: string }
 *                   secondary_address: { type: string }
 *                   secondary_state:   { type: string }
 *                   secondary_pincode: { type: string }
 *               membership:
 *                 type: object
 *                 required: [package_name, sale_date, total_price, payment_mode]
 *                 properties:
 *                   package_name:      { type: string, example: "Gold 5N" }
 *                   validity_years:    { type: integer, default: 1 }
 *                   nights_per_year:   { type: integer, default: 0 }
 *                   sale_date:         { type: string, format: date }
 *                   total_price:       { type: number }
 *                   discount_amount:   { type: number, default: 0 }
 *                   down_payment:      { type: number, default: 0 }
 *                   payment_mode:      { type: string, enum: [CASH, CHEQUE, ONLINE, BANK_TRANSFER, CARD] }
 *                   dsa:               { type: string, enum: [VENUE, CSDO, OTHER], nullable: true }
 *                   reference_by:      { type: string, nullable: true }
 *                   remarks:           { type: string, nullable: true }
 *               offers:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     offer_name:  { type: string }
 *                     valid_until: { type: string, format: date, nullable: true }
 *     responses:
 *       201:
 *         description: Client onboarded successfully
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden — Admin or Manager only
 */
export async function POST(request: NextRequest) {
  try {
    await connectDB();
    const currentUser = await authenticateRequest(request);
    requireRoles(currentUser, [UserRole.ADMIN, UserRole.MANAGER]);

    const body = await request.json();
    const validated = OnboardSchema.parse(body);

    const result = await onboardService.onboardClient(validated);

    return NextResponse.json(
      ResponseUtil.success('Client onboarded successfully', result),
      { status: 201 },
    );
  } catch (error) {
    return errorHandler(error);
  }
}
