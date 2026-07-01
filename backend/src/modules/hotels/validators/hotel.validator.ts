import { z } from 'zod';
import { PropertyType, HotelType, HotelStatus } from '../types/hotel.types';

export const CreateHotelSchema = z.object({
  location_id: z.number().int().positive('Invalid Location ID'),
  hotel_name: z.string().min(1, 'Hotel name is required').max(100),
  property_type: z.nativeEnum(PropertyType, {
    errorMap: () => ({ message: 'Invalid property type (INTERNAL_PROPERTY or ASSOCIATED_PROPERTY)' }),
  }),
  hotel_type: z.nativeEnum(HotelType, {
    errorMap: () => ({ message: 'Invalid hotel type' }),
  }),
  address: z.string().optional().nullable(),
  map_link: z.string().url('Map link must be a valid URL').optional().nullable().or(z.literal('')),
  description: z.string().optional().nullable(),
  status: z.nativeEnum(HotelStatus).optional(),
  remarks: z.string().optional().nullable(),
  created_by: z.number().int().optional().nullable(),
});

export const UpdateHotelSchema = CreateHotelSchema.partial().extend({
  updated_by: z.number().int().optional().nullable(),
});

export const AddHotelImageSchema = z.object({
  sort_order: z.number().int().nonnegative().optional(),
});
