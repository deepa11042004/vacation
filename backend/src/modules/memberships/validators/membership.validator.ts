import { z } from 'zod';
import { MembershipDSA, MembershipStatus, PaymentMode } from '../types/membership.types';

export const CreateMembershipSchema = z.object({
  client_id: z.number().int().positive('Client ID is required'),
  package_id: z.number().int().positive().optional().nullable(),
  package_name: z.string().min(1).max(255).optional().nullable(),
  validity_years: z.number().int().min(1).optional().nullable(),
  nights_per_year: z.number().int().min(0).optional().nullable(),
  sale_date: z.coerce.date(),
  start_date: z.coerce.date(),
  total_price: z.number().positive('Total price must be greater than 0'),
  discount_amount: z.number().min(0).optional().default(0),
  payment_mode: z.nativeEnum(PaymentMode, {
    errorMap: () => ({ message: 'payment_mode must be CASH, CHEQUE, ONLINE, BANK_TRANSFER, or CARD' }),
  }),
  down_payment: z.number().min(0).optional().default(0),
  sales_consultant_id: z.number().int().optional().nullable(),
  take_over_manager_id: z.number().int().optional().nullable(),
  dsa: z.nativeEnum(MembershipDSA).optional().nullable(),
  reference_by: z.string().max(100).optional().nullable(),
  remarks: z.string().optional().nullable(),
  created_by: z.number().int().optional().nullable(),
}).refine(
  (d) => d.package_id != null || (d.package_name != null && d.package_name.trim().length > 0),
  { message: 'Provide either package_id (from catalogue) or package_name (free-text) with validity details', path: ['package_id'] },
);

export const UpdateMembershipSchema = z.object({
  sale_date: z.coerce.date().optional(),
  start_date: z.coerce.date().optional(),
  total_price: z.number().positive().optional(),
  discount_amount: z.number().min(0).optional(),
  payment_mode: z.nativeEnum(PaymentMode).optional(),
  sales_consultant_id: z.number().int().optional().nullable(),
  take_over_manager_id: z.number().int().optional().nullable(),
  dsa: z.nativeEnum(MembershipDSA).optional().nullable(),
  reference_by: z.string().max(100).optional().nullable(),
  remarks: z.string().optional().nullable(),
  updated_by: z.number().int().optional().nullable(),
});

export const CancelMembershipSchema = z.object({
  cancellation_reason: z.string().min(1, 'Cancellation reason is required'),
  updated_by: z.number().int().optional().nullable(),
});
