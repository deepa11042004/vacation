export enum EnquiryStatus {
  NEW = 'NEW',
  CONTACTED = 'CONTACTED',
  CONVERTED = 'CONVERTED',
  CLOSED = 'CLOSED',
}

export interface IEnquiry {
  id: number;
  name: string;
  mobile: string;
  city?: string | null;
  age?: string | null;
  email: string;
  hotel_name?: string | null;
  query?: string | null;
  check_in?: string | null;
  check_out?: string | null;
  guests?: string | null;
  status: EnquiryStatus;
  notes?: string | null;
  created_at?: Date;
  updated_at?: Date;
}
