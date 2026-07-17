import { ClientStatus, Gender } from '../types/client.types';

export interface IClient {
  client_id: number;
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
  is_welcome_mail_sent?: boolean;
  marriage_anniversary?: Date | null;
  spouse_name?: string | null;
  qr_token?: string | null;
  birthday_mail_sent_year?: number | null;
  anniversary_mail_sent_year?: number | null;
  created_by?: number | null;
  updated_by?: number | null;
  created_at: Date;
  updated_at: Date;
  deleted_at?: Date | null;
}
