import { ClientStatus, Gender } from '../types/client.types';

export interface CreateClientDTO {
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
  status?: ClientStatus; // optional, default ACTIVE
  remarks?: string | null;
  created_by?: number | null;
}

export interface UpdateClientDTO {
  title?: string | null;
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
  remarks?: string | null;
  updated_by?: number | null;
}
