import { MembershipDSA, MembershipStatus, PaymentMode } from '../types/membership.types';

export interface CreateMembershipDTO {
  client_id: number;
  package_id: number;
  sale_date: Date;
  start_date: Date;
  total_price: number;
  discount_amount?: number;
  payment_mode: PaymentMode;
  down_payment?: number;
  sales_consultant_id?: number | null;
  take_over_manager_id?: number | null;
  dsa?: MembershipDSA | null;
  reference_by?: string | null;
  remarks?: string | null;
  created_by?: number | null;
}

export interface UpdateMembershipDTO {
  sale_date?: Date;
  start_date?: Date;
  end_date?: Date;
  total_price?: number;
  discount_amount?: number;
  net_price?: number;
  payment_mode?: PaymentMode;
  sales_consultant_id?: number | null;
  take_over_manager_id?: number | null;
  dsa?: MembershipDSA | null;
  reference_by?: string | null;
  remarks?: string | null;
  status?: MembershipStatus;
  updated_by?: number | null;
}
