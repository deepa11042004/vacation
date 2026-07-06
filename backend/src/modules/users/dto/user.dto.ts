import { UserRole, UserStatus } from '../types/user.types';

export interface CreateUserDTO {
  email: string;
  first_name?: string | null;
  middle_name?: string | null;
  last_name?: string | null;
  password?: string;
  role?: UserRole;
  status?: UserStatus;
  client_id?: number | null;
  allowed_sections?: string[] | null;
  created_by?: number | null;
}

export interface UpdateUserDTO {
  email?: string;
  first_name?: string | null;
  middle_name?: string | null;
  last_name?: string | null;
  password?: string;
  role?: UserRole;
  status?: UserStatus;
  client_id?: number | null;
  allowed_sections?: string[] | null;
  refresh_token?: string | null;
  updated_by?: number | null;
}
