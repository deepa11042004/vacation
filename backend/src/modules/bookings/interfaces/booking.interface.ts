export enum NightType {
  MEMBERSHIP    = 'MEMBERSHIP',
  COMPLIMENTARY = 'COMPLIMENTARY',
  EXTRA         = 'EXTRA',
}

export enum BookingStatus {
  CONFIRMED = 'CONFIRMED',
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
}

export interface IBooking {
  booking_id: number;
  client_id: number;
  membership_id: number;
  assist_by?: string | null;
  contact_number?: string | null;
  check_in: string;
  check_out: string;
  nights: number;
  no_of_rooms: number;
  no_of_adults: number;
  children: number;
  booking_type?: string | null;
  hotel_name: string;
  hotel_address?: string | null;
  hotel_contact?: string | null;
  confirmation_number?: string | null;
  booking_amount?: number | null;
  room_category?: string | null;
  remark?: string | null;
  night_type: NightType;
  redeemed_offer_ids?: number[] | null;
  amount_paid_by_client: number;
  note?: string | null;
  status: BookingStatus;
  created_at?: Date;
  updated_at?: Date;
  deleted_at?: Date | null;
}
