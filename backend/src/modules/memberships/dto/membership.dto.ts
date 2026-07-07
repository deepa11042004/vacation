import { MembershipDSA, MembershipStatus, PaymentMode } from '../types/membership.types';

export interface CreateMembershipDTO {
  client_id: number;
  package_name?: string | null;
  validity_years?: number | null;
  nights_per_year?: number | null;
  sale_date: Date;
  total_price: number;
  discount_amount?: number;
  payment_mode: PaymentMode;
  down_payment?: number;
  sales_consultant_id?: number | null;
  take_over_manager_id?: number | null;
  sales_consultant?: string | null;
  take_over_manager?: string | null;
  dsa?: MembershipDSA | null;
  reference_by?: string | null;
  remarks?: string | null;
  created_by?: number | null;
}

export interface UpdateMembershipDTO {
  sale_date?: Date;
  end_date?: Date;
  total_price?: number;
  discount_amount?: number;
  net_price?: number;
  payment_mode?: PaymentMode;
  sales_consultant_id?: number | null;
  take_over_manager_id?: number | null;
  sales_consultant?: string | null;
  take_over_manager?: string | null;
  dsa?: MembershipDSA | null;
  reference_by?: string | null;
  remarks?: string | null;
  status?: MembershipStatus;
  outstanding_balance?: number;
  updated_by?: number | null;
}
