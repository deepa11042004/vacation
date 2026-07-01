import { NextRequest } from 'next/server';
import { JwtUtil, TokenPayload } from '../utils/jwt.util';
import { AppError } from './error.middleware';

/**
 * Authenticates the request by checking the Authorization header.
 * Throws an AppError if token is invalid or missing.
 * Returns the decoded token payload if authentication is successful.
 */
export const authenticateRequest = async (req: NextRequest): Promise<TokenPayload> => {
  const authHeader = req.headers.get('authorization');
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw new AppError('Unauthorized: Access Token missing or invalid', 401);
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = JwtUtil.verifyAccessToken(token);
    return decoded;
  } catch (error) {
    throw new AppError('Unauthorized: Invalid or expired Access Token', 401);
  }
};

/**
 * Authorizes the request by checking the user's role against allowed roles.
 * Throws a 403 Forbidden AppError if role is not authorized.
 */
export const requireRoles = (user: TokenPayload, allowedRoles: string[]): void => {
  if (!allowedRoles.includes(user.role)) {
    throw new AppError('Forbidden: Access denied', 403);
  }
};
