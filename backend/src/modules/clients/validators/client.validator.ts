import { z } from 'zod';
import { ClientStatus, DSAType, Gender } from '../types/client.types';

export const CreateClientSchema = z.object({
  title: z.string().max(10).optional(),
  first_name: z.string().min(1, 'First name is required').max(50),
  middle_name: z.string().max(50).optional().nullable(),
  last_name: z.string().min(1, 'Last name is required').max(50),
  gender: z.nativeEnum(Gender, {
    errorMap: () => ({ message: 'Invalid gender' }),
  }),
  date_of_birth: z.coerce.date().optional().nullable(),
  mobile: z.string().min(10, 'Mobile must be at least 10 characters').max(15),
  alternate_mobile: z.string().max(15).optional().nullable(),
  email: z.string().email('Invalid email address'),
  country_code: z.string().min(1).max(5),
  profile_photo: z.string().url('Profile photo must be a valid URL').optional().nullable(),
  status: z.nativeEnum(ClientStatus).optional(),
  sales_consultant: z.string().max(100).optional().nullable(),
  take_over_manager: z.string().max(100).optional().nullable(),
  dsa: z.nativeEnum(DSAType, {
    errorMap: () => ({ message: 'DSA must be one of: venue, csdo, other' }),
  }).optional().nullable(),
  reference_by: z.string().max(100).optional().nullable(),
  marriage_anniversary: z.coerce.date().optional().nullable(),
  spouse_name: z.string().max(100).optional().nullable(),
  remarks: z.string().optional().nullable(),
  created_by: z.number().int().optional().nullable(),
});

export const UpdateClientSchema = CreateClientSchema.partial().extend({
  updated_by: z.number().int().optional().nullable(),
});
