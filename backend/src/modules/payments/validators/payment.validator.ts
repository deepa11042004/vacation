import { z } from 'zod';
import { PaymentMode, PaymentStatus, PaymentType } from '../types/payment.types';

export const CreatePaymentSchema = z.object({
  membership_id: z.number().int().positive('Membership ID is required'),
  client_id: z.number().int().positive('Client ID is required'),
  payment_type: z.nativeEnum(PaymentType, {
    errorMap: () => ({ message: 'payment_type must be DOWN_PAYMENT, INSTALMENT, AMC, PENALTY, or REFUND' }),
  }),
  amount: z.number().positive('Amount must be greater than 0'),
  payment_date: z.coerce.date(),
  due_date: z.coerce.date().optional().nullable(),
  payment_mode: z.nativeEnum(PaymentMode, {
    errorMap: () => ({ message: 'payment_mode must be CASH, CHEQUE, ONLINE, BANK_TRANSFER, or CARD' }),
  }),
  transaction_ref: z.string().max(100).optional().nullable(),
  bank_name: z.string().max(100).optional().nullable(),
  status: z.nativeEnum(PaymentStatus).optional(),
  remarks: z.string().optional().nullable(),
  created_by: z.number().int().optional().nullable(),
});

export const UpdatePaymentSchema = z.object({
  payment_type: z.nativeEnum(PaymentType).optional(),
  amount: z.number().positive().optional(),
  payment_date: z.coerce.date().optional(),
  due_date: z.coerce.date().optional().nullable(),
  payment_mode: z.nativeEnum(PaymentMode).optional(),
  transaction_ref: z.string().max(100).optional().nullable(),
  bank_name: z.string().max(100).optional().nullable(),
  remarks: z.string().optional().nullable(),
  updated_by: z.number().int().optional().nullable(),
});

export const CancelPaymentSchema = z.object({
  updated_by: z.number().int().optional().nullable(),
});
