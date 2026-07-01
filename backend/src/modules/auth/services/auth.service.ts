import bcrypt from 'bcrypt';
import { UserRepository } from '../../users/repositories/user.repository';
import { LoginDTO } from '../dto/auth.dto';
import { JwtUtil } from '../../../shared/utils/jwt.util';
import { AppError } from '../../../shared/middlewares/error.middleware';
import { UserStatus } from '../../users/types/user.types';

export class AuthService {
  private userRepository: UserRepository;

  constructor() {
    this.userRepository = new UserRepository();
  }

  async login(data: LoginDTO) {
    // 1. Fetch user by email
    const user = await this.userRepository.findByEmail(data.email);
    if (!user) {
      throw new AppError('Invalid email or password', 401);
    }

    // 2. Check user status
    if (user.status !== UserStatus.ACTIVE) {
      throw new AppError('User account is inactive', 403);
    }

    // 3. Verify password
    const isPasswordValid = await bcrypt.compare(data.password!, user.password);
    if (!isPasswordValid) {
      throw new AppError('Invalid email or password', 401);
    }

    // 4. Generate tokens
    const tokenPayload = {
      user_id: user.user_id,
      email: user.email,
      role: user.role,
      client_id: user.client_id || null,
    };

    const accessToken = JwtUtil.generateAccessToken(tokenPayload);
    const refreshToken = JwtUtil.generateRefreshToken(tokenPayload);

    // 5. Save refresh token in database
    await this.userRepository.update(user.user_id, { refresh_token: refreshToken });

    const userJson = user.toJSON();
    delete userJson.password;
    delete userJson.refresh_token;

    return {
      accessToken,
      refreshToken,
      user: userJson,
    };
  }

  async refresh(refreshToken: string) {
    try {
      // 1. Verify Refresh Token
      const decoded = JwtUtil.verifyRefreshToken(refreshToken);

      // 2. Fetch User
      const user = await this.userRepository.findById(decoded.user_id);
      if (!user || user.status !== UserStatus.ACTIVE) {
        throw new AppError('Unauthorized: User account is inactive or not found', 401);
      }

      // 3. Verify Refresh Token matches database
      if (user.refresh_token !== refreshToken) {
        throw new AppError('Unauthorized: Invalid Refresh Token session', 401);
      }

      // 4. Generate new tokens
      const tokenPayload = {
        user_id: user.user_id,
        email: user.email,
        role: user.role,
        client_id: user.client_id || null,
      };

      const accessToken = JwtUtil.generateAccessToken(tokenPayload);
      const newRefreshToken = JwtUtil.generateRefreshToken(tokenPayload);

      // 5. Save new refresh token in database
      await this.userRepository.update(user.user_id, { refresh_token: newRefreshToken });

      return {
        accessToken,
        refreshToken: newRefreshToken,
      };
    } catch (error) {
      if (error instanceof AppError) {
        throw error;
      }
      throw new AppError('Unauthorized: Invalid or expired Refresh Token', 401);
    }
  }

  async logout(user_id: number) {
    const user = await this.userRepository.findById(user_id);
    if (!user) {
      throw new AppError('User not found', 404);
    }

    // Invalidate refresh token in database
    await this.userRepository.update(user_id, { refresh_token: null });
    return { message: 'Logged out successfully' };
  }
}
