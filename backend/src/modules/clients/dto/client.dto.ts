import { ClientStatus, Gender } from '../types/client.types';

export interface CreateClientDTO {
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
  status?: ClientStatus;
  marriage_anniversary?: Date | null;
  spouse_name?: string | null;
  created_by?: number | null;
}

export interface UpdateClientDTO {
  first_name?: string;
  middle_name?: string | null;
  last_name?: string;
  gender?: Gender;
  date_of_birth?: Date | null;
  mobile?: string;
  alternate_mobile?: string | null;
  email?: string;
  country_code?: string;
  profile_photo?: string | null;
  status?: ClientStatus;
  marriage_anniversary?: Date | null;
  spouse_name?: string | null;
  updated_by?: number | null;
}
