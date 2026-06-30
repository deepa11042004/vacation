import { ClientStatus, Gender } from '../types/client.types';

export interface CreateClientDTO {
  first_name: string;
  middle_name?: string;
  last_name: string;
  gender: Gender;
  date_of_birth?: Date;
  mobile: string;
  alternate_mobile?: string;
  email: string;
  password?: string; // Controller might receive password, service will hash it
  country_code: string;
  profile_photo?: string;
  status?: ClientStatus; // optional, default ACTIVE
}

export interface UpdateClientDTO {
  first_name?: string;
  middle_name?: string;
  last_name?: string;
  gender?: Gender;
  date_of_birth?: Date;
  mobile?: string;
  alternate_mobile?: string;
  email?: string;
  password?: string;
  country_code?: string;
  profile_photo?: string;
  status?: ClientStatus;
  email_verified?: boolean;
  mobile_verified?: boolean;
}
