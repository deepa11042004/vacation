import { PaymentMode, PaymentStatus, PaymentType } from '../types/payment.types';

export interface IPayment {
  payment_id: number;
  payment_number: string;
  membership_id: number;
  client_id: number;
  payment_type: PaymentType;
  amount: number;
  payment_date: Date;
  due_date?: Date | null;
  payment_mode: PaymentMode;
  transaction_ref?: string | null;
  bank_name?: string | null;
  status: PaymentStatus;
  remarks?: string | null;
  created_by?: number | null;
  updated_by?: number | null;
  created_at: Date;
  updated_at: Date;
}
