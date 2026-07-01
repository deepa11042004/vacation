import { ClientStatus, DSAType, Gender } from '../types/client.types';

export interface IClient {
  client_id: number;
  client_code: string;
  title?: string | null;
  first_name: string;
  middle_name?: string | null;
  last_name: string;
  gender: Gender;
  date_of_birth?: Date | null;
  mobile: string;
  alternate_mobile?: string | null;
  email: string;
  country_code: string;
  profile_photo?: string | null;
  status: ClientStatus;
  sales_consultant?: string | null;
  take_over_manager?: string | null;
  dsa?: DSAType | null;
  reference_by?: string | null;
  marriage_anniversary?: Date | null;
  spouse_name?: string | null;
  remarks?: string | null;
  created_by?: number | null;
  updated_by?: number | null;
  created_at: Date;
  updated_at: Date;
  deleted_at?: Date | null;
}
