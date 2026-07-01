

export interface IClientAddress {
  address_id: number;
  client_code: string;
  primary_address?: string | null;
  secondary_address?: string | null;
  primary_state?: string | null;
  secondary_state?: string | null;
  primary_pincode?: string | null;
  secondary_pincode?: string | null;
  created_at: Date;
  updated_at: Date;
}
