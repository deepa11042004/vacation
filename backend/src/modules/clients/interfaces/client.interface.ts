import { ClientStatus, Gender } from '../types/client.types';

export interface IClient {
  client_id: string;
  client_code: string;
  first_name: string;
  middle_name?: string;
  last_name: string;
  gender: Gender;
  date_of_birth?: Date;
  mobile: string;
  alternate_mobile?: string;
  email: string;
  password?: string;
  country_code: string;
  profile_photo?: string;
  status: ClientStatus;
  email_verified: boolean;
  mobile_verified: boolean;
  created_by?: string;
  updated_by?: string;
  created_at: Date;
  updated_at: Date;
  deleted_at?: Date | null;
}
