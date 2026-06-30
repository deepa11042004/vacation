import { z } from 'zod';
import { ClientStatus, Gender } from '../types/client.types';

export const CreateClientSchema = z.object({
  first_name: z.string().min(1, 'First name is required').max(50),
  middle_name: z.string().max(50).optional(),
  last_name: z.string().min(1, 'Last name is required').max(50),
  gender: z.nativeEnum(Gender, {
    errorMap: () => ({ message: 'Invalid gender' }),
  }),
  date_of_birth: z.coerce.date().optional(),
  mobile: z.string().min(10).max(15),
  alternate_mobile: z.string().max(15).optional(),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters').optional(),
  country_code: z.string().min(1).max(5),
  profile_photo: z.string().url().optional(),
  status: z.nativeEnum(ClientStatus).optional(),
});

export const UpdateClientSchema = CreateClientSchema.partial().extend({
  email_verified: z.boolean().optional(),
  mobile_verified: z.boolean().optional(),
});
