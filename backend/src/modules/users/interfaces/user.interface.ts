import { UserRole, UserStatus } from '../types/user.types';

export interface IUser {
  user_id: number;
  client_id?: number | null;
  email: string;
  password?: string;
  role: UserRole;
  status: UserStatus;
  refresh_token?: string | null;
  created_by?: number | null;
  updated_by?: number | null;
  created_at: Date;
  updated_at: Date;
  deleted_at?: Date | null;
}
