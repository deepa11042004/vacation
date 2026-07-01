import { z } from 'zod';
import { PackageCategory, PackageStatus, UnitType } from '../types/package.types';

export const CreatePackageSchema = z.object({
  name: z.string().min(1, 'Package name is required').max(150),
  category: z.nativeEnum(PackageCategory, {
    errorMap: () => ({ message: 'Category must be SILVER, GOLD, or PLATINUM' }),
  }),
  validity_years: z.number().int().positive('Validity years must be a positive integer'),
  total_nights: z.number().int().positive('Total nights must be a positive integer'),
  nights_per_year: z.number().int().positive('Nights per year must be a positive integer'),
  unit_type: z.nativeEnum(UnitType, {
    errorMap: () => ({ message: 'Unit type must be STUDIO, 1BHK, 2BHK, or SUITE' }),
  }),
  max_adults: z.number().int().min(1).max(10).optional(),
  max_children: z.number().int().min(0).max(10).optional(),
  base_price: z.number().positive('Base price must be greater than 0'),
  amc_amount: z.number().min(0, 'AMC amount cannot be negative'),
  description: z.string().optional().nullable(),
  status: z.nativeEnum(PackageStatus).optional(),
  created_by: z.number().int().optional().nullable(),
});

export const UpdatePackageSchema = CreatePackageSchema.partial().extend({
  updated_by: z.number().int().optional().nullable(),
});
