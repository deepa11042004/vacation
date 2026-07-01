import bcrypt from 'bcrypt';
import { AuthRepository } from '../repositories/auth.repository';
import { UserService } from '../../users/services/user.service';
import { LoginDTO } from '../dto/auth.dto';
import { JwtUtil } from '../../../shared/utils/jwt.util';
import { AppError } from '../../../shared/middlewares/error.middleware';
import { UserStatus } from '../../users/types/user.types';

export class AuthService {
  private authRepository: AuthRepository;
  private userService: UserService;

  constructor() {
    this.authRepository = new AuthRepository();
    this.userService = new UserService();
  }

  async login(data: LoginDTO) {
    const user = await this.authRepository.findByEmail(data.email);
    if (!user) {
      throw new AppError('Invalid email or password', 401);
    }

    if (user.status !== UserStatus.ACTIVE) {
      throw new AppError('User account is inactive', 403);
    }

    const isPasswordValid = await bcrypt.compare(data.password!, user.password);
    if (!isPasswordValid) {
      throw new AppError('Invalid email or password', 401);
    }

    const tokenPayload = {
      user_id: user.user_id,
      email: user.email,
      role: user.role,
      client_id: user.client_id || null,
    };

    const accessToken = JwtUtil.generateAccessToken(tokenPayload);
    const refreshToken = JwtUtil.generateRefreshToken(tokenPayload);

    await this.authRepository.updateRefreshToken(user.user_id, refreshToken);

    const userJson = user.toJSON();
    delete userJson.password;
    delete userJson.refresh_token;

    return { accessToken, refreshToken, user: userJson };
  }

  async refresh(refreshToken: string) {
    try {
      const decoded = JwtUtil.verifyRefreshToken(refreshToken);

      const user = await this.authRepository.findById(decoded.user_id);
      if (!user || user.status !== UserStatus.ACTIVE) {
        throw new AppError('Unauthorized: User account is inactive or not found', 401);
      }

      if (user.refresh_token !== refreshToken) {
        throw new AppError('Unauthorized: Invalid Refresh Token session', 401);
      }

      const tokenPayload = {
        user_id: user.user_id,
        email: user.email,
        role: user.role,
        client_id: user.client_id || null,
      };

      const accessToken = JwtUtil.generateAccessToken(tokenPayload);
      const newRefreshToken = JwtUtil.generateRefreshToken(tokenPayload);

      await this.authRepository.updateRefreshToken(user.user_id, newRefreshToken);

      return { accessToken, refreshToken: newRefreshToken };
    } catch (error) {
      if (error instanceof AppError) throw error;
      throw new AppError('Unauthorized: Invalid or expired Refresh Token', 401);
    }
  }

  async logout(user_id: number) {
    const user = await this.authRepository.findById(user_id);
    if (!user) {
      throw new AppError('User not found', 404);
    }

    await this.authRepository.updateRefreshToken(user_id, null);
    return { message: 'Logged out successfully' };
  }

  async me(user_id: number) {
    return await this.userService.getUserById(user_id);
  }
}
