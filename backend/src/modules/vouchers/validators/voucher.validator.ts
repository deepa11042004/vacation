import { z } from 'zod';
import { VoucherType, VoucherStatus } from '../types/voucher.types';

export const CreateVoucherSchema = z.object({
  voucher_number: z.string().trim().min(5).max(50).optional(),
  voucher_type: z.nativeEnum(VoucherType).default(VoucherType.NON_MEMBER),
  applicant: z.string().trim().min(2, 'Applicant name is required').max(100),
  spouse: z.string().trim().max(100).optional().nullable(),
  email: z.string().trim().email('Invalid email address').max(150),
  phone: z.string().trim().min(7, 'Invalid phone number').max(20),
  locations: z.array(z.string().trim()).optional().default(['Shimla', 'Cochin', 'Jim Corbett', 'Jaipur', 'Agra', 'Goa', 'Nainital', 'Manesar']),
  benefit: z.string().trim().optional().default('Holiday Gift Voucher'),
  issue_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Invalid date format (YYYY-MM-DD)').optional(),
  validity: z.string().trim().min(1).default('1 Year'),
  terms_and_conditions: z.string().trim().optional(),
});

export const RedeemVoucherSchema = z.object({
  voucherNumber: z.string().trim().min(1, 'Voucher number is required'),
});

export const GetVouchersQuerySchema = z.object({
  search: z.string().trim().optional(),
  voucher_type: z.nativeEnum(VoucherType).optional(),
  status: z.nativeEnum(VoucherStatus).optional(),
  from_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
  to_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().positive().max(100).default(10),
});
