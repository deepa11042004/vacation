export interface IAmcPayment {
  amc_payment_id: number;
  client_id: number;
  membership_id: number;
  year_number: number;
  is_received: boolean;
  payment_date?: string | null;
  payment_mode?: string | null;
  created_at?: Date;
  updated_at?: Date;
  deleted_at?: Date | null;
}
