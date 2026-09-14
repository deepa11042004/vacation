import { VoucherType, VoucherStatus } from '../types/voucher.types';

export interface IVoucher {
  voucher_id: number;
  voucher_number: string;
  voucher_type: VoucherType;
  applicant: string;
  spouse?: string | null;
  email: string;
  phone: string;
  locations: string[];
  benefit: string;
  issue_date: Date | string;
  validity: string;
  expiry_date: Date | string;
  status: VoucherStatus;
  terms_and_conditions: string;
  redeemed_at?: Date | string | null;
  created_by?: number | null;
  created_at: Date;
  updated_at: Date;
}

export interface ICreateVoucherDTO {
  voucher_number?: string;
  voucher_type: VoucherType;
  applicant: string;
  spouse?: string | null;
  email: string;
  phone: string;
  locations: string[];
  benefit: string;
  issue_date?: string;
  validity?: string;
  terms_and_conditions?: string;
}

export interface IGetAllVouchersQuery {
  search?: string;
  voucher_type?: VoucherType;
  status?: VoucherStatus;
  from_date?: string;
  to_date?: string;
  page?: number;
  limit?: number;
}
