import { PaymentMode, PaymentStatus, PaymentType } from '../types/payment.types';

export interface CreatePaymentDTO {
  membership_id: number;
  client_id: number;
  payment_type: PaymentType;
  amount: number;
  payment_date: Date;
  due_date?: Date | null;
  payment_mode: PaymentMode;
  transaction_ref?: string | null;
  bank_name?: string | null;
  status?: PaymentStatus;
  remarks?: string | null;
  created_by?: number | null;
}

export interface UpdatePaymentDTO {
  payment_type?: PaymentType;
  amount?: number;
  payment_date?: Date;
  due_date?: Date | null;
  payment_mode?: PaymentMode;
  transaction_ref?: string | null;
  bank_name?: string | null;
  remarks?: string | null;
  updated_by?: number | null;
}
