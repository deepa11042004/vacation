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
  dsa:               z.nativeEnum(MembershipDSA, { errorMap: () => ({ message: 'Invalid DSA type' }) }).optional().nullable(),
  reference_by:      z.string().max(100).optional().nullable(),
  remarks:           z.string().optional().nullable(),
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
