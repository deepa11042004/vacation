import { z } from 'zod';
import { StaffStatus } from '../models/Staff.model';

export const CreateStaffSchema = z.object({
  full_name:    z.string().min(1).max(255),
  email:        z.string().email(),
  phone:        z.string().min(7).max(20),
  designation:  z.string().max(255).optional().nullable(),
  department:   z.string().max(255).optional().nullable(),
  joining_date: z.coerce.date().optional().nullable(),
  status:       z.nativeEnum(StaffStatus).optional().default(StaffStatus.ACTIVE),
});

export const UpdateStaffSchema = z.object({
  full_name:    z.string().min(1).max(255).optional(),
  email:        z.string().email().optional(),
  phone:        z.string().min(7).max(20).optional(),
  designation:  z.string().max(255).optional().nullable(),
  department:   z.string().max(255).optional().nullable(),
  joining_date: z.coerce.date().optional().nullable(),
  status:       z.nativeEnum(StaffStatus).optional(),
});

export const StaffLoginSchema = z.object({
  email: z.string().email(),
  phone: z.string().min(7),
});
