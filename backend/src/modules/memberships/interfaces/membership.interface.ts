import { MembershipDSA, MembershipStatus, PaymentMode } from '../types/membership.types';

export interface IMembership {
  membership_id: number;
  membership_number: string;
  client_id: number;
  package_id: number;
  sale_date: Date;
  start_date: Date;
  end_date: Date;
  nights_remaining: number;
  nights_per_year: number;
  total_price: number;
  discount_amount: number;
  net_price: number;
  payment_mode: PaymentMode;
  down_payment: number;
  outstanding_balance: number;
  sales_consultant_id?: number | null;
  take_over_manager_id?: number | null;
  dsa?: MembershipDSA | null;
  reference_by?: string | null;
  status: MembershipStatus;
  cancellation_reason?: string | null;
  remarks?: string | null;
  created_by?: number | null;
  updated_by?: number | null;
  created_at: Date;
  updated_at: Date;
  deleted_at?: Date | null;
}
