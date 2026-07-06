export interface IClientOffer {
  offer_id: number;
  client_id: number;
  offer_name: string;
  valid_until?: string | null;
  is_redeemed?: boolean;
  created_at?: Date;
  updated_at?: Date;
  deleted_at?: Date | null;
}
