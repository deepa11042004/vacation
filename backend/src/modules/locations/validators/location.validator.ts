import { z } from 'zod';
import { LocationType, LocationStatus } from '../types/location.types';

export const CreateLocationSchema = z.object({
  location_code: z.string().min(1, 'Location code is required').max(20).toUpperCase(),
  location_name: z.string().min(1, 'Location name is required').max(100),
  country: z.string().min(1, 'Country is required').max(100),
  type: z.nativeEnum(LocationType, {
    errorMap: () => ({ message: 'Invalid location type (DOMESTIC or INTERNATIONAL)' }),
  }),
  map_link: z.string().url('Map link must be a valid URL').optional().nullable().or(z.literal('')),
  location_image: z.string().optional().nullable(),
  description: z.string().optional().nullable(),
  famous_sightseens: z.array(z.string()).optional().nullable(),
  is_online: z.boolean().optional(),
  status: z.nativeEnum(LocationStatus).optional(),
  remarks: z.string().optional().nullable(),
  created_by: z.number().int().optional().nullable(),
});

export const UpdateLocationSchema = CreateLocationSchema.partial().extend({
  updated_by: z.number().int().optional().nullable(),
});
