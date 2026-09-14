import { z } from 'zod';
import { ItineraryType, ItineraryStatus } from '../types/itinerary.types';

const ScheduleItemSchema = z.object({
  day: z.string().min(1, 'Day label is required').max(50),
  title: z.string().min(1, 'Day title is required').max(255),
  desc: z.string().min(1, 'Day description is required'),
});

export const CreateItinerarySchema = z.object({
  slug: z.string().min(1).max(150).regex(/^[a-z0-9-]+$/, 'Slug may only contain lowercase letters, numbers and hyphens').optional(),
  name: z.string().min(1, 'Name is required').max(255),
  destination: z.string().min(1, 'Destination is required').max(255),
  type: z.nativeEnum(ItineraryType, {
    errorMap: () => ({ message: 'Invalid itinerary type (DOMESTIC or INTERNATIONAL)' }),
  }),
  category: z.string().max(100).optional().nullable(),
  badge: z.string().max(100).optional().nullable(),
  duration: z.string().max(50).optional().nullable(),
  days: z.number().int().min(1, 'Days must be at least 1'),
  nights: z.number().int().min(0, 'Nights cannot be negative'),
  best_time: z.string().max(150).optional().nullable(),
  image: z.string().optional().nullable(),
  short_desc: z.string().optional().nullable(),
  highlights: z.array(z.string()).optional().nullable(),
  inclusions: z.array(z.string()).optional().nullable(),
  schedule: z.array(ScheduleItemSchema).optional().nullable(),
  status: z.nativeEnum(ItineraryStatus).optional(),
  remarks: z.string().optional().nullable(),
  created_by: z.number().int().optional().nullable(),
});

export const UpdateItinerarySchema = CreateItinerarySchema.partial().extend({
  updated_by: z.number().int().optional().nullable(),
});

export const AddItineraryImageSchema = z.object({
  image_path: z.string().min(1),
  sort_order: z.number().int().optional(),
});
