import { z } from 'zod';
import { UserRole, UserStatus } from '../types/user.types';

export const CreateUserSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  role: z.nativeEnum(UserRole).optional(),
  status: z.nativeEnum(UserStatus).optional(),
  client_id: z.number().int().positive().optional().nullable(),
  created_by: z.number().int().optional().nullable(),
}).refine((data) => {
  if (data.role === UserRole.CLIENT && !data.client_id) {
    return false;
  }
  return true;
}, {
  message: 'client_id is required when role is CLIENT',
  path: ['client_id'],
});

export const UpdateUserSchema = z.object({
  email: z.string().email('Invalid email address').optional(),
  password: z.string().min(6, 'Password must be at least 6 characters').optional(),
  role: z.nativeEnum(UserRole).optional(),
  status: z.nativeEnum(UserStatus).optional(),
  client_id: z.number().int().positive().optional().nullable(),
  updated_by: z.number().int().optional().nullable(),
}).refine((data) => {
  if (data.role === UserRole.CLIENT && !data.client_id) {
    return false;
  }
  return true;
}, {
  message: 'client_id is required when role is CLIENT',
  path: ['client_id'],
});
