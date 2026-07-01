import { z } from 'zod';

export const LoginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

export const TokenRefreshSchema = z.object({
  refresh_token: z.string().min(1, 'Refresh token is required'),
});
