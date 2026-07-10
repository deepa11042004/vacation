import bcrypt from 'bcrypt';
import { AuthRepository } from '../repositories/auth.repository';
import { UserService } from '../../users/services/user.service';
import { LoginDTO } from '../dto/auth.dto';
import { JwtUtil } from '../../../shared/utils/jwt.util';
import { AppError } from '../../../shared/middlewares/error.middleware';
import { UserRole, UserStatus } from '../../users/types/user.types';
import { Client } from '../../clients/models/Client.model';
import { ClientAddress } from '../../clients/models/ClientAddress.model';
import { Membership } from '../../memberships/models/Membership.model';

export class AuthService {
  private authRepository: AuthRepository;
  private userService: UserService;

  constructor() {
    this.authRepository = new AuthRepository();
    this.userService = new UserService();
  }

  private parseAllowedSections(raw: string | null | undefined): string[] | null {
    if (!raw) return null;
    try { return JSON.parse(raw); } catch { return null; }
  }

  private sanitizeUserJson(userJson: any): any {
    delete userJson.password;
    delete userJson.refresh_token;
    if (typeof userJson.allowed_sections === 'string') {
      userJson.allowed_sections = this.parseAllowedSections(userJson.allowed_sections);
    }
    return userJson;
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
      allowed_sections: this.parseAllowedSections(user.allowed_sections ?? null),
    };

    const accessToken = JwtUtil.generateAccessToken(tokenPayload);
    const refreshToken = JwtUtil.generateRefreshToken(tokenPayload);

    await this.authRepository.updateRefreshToken(user.user_id, refreshToken);

    return { accessToken, refreshToken, user: this.sanitizeUserJson(user.toJSON()) };
  }

  async adminLogin(data: LoginDTO) {
    const user = await this.authRepository.findByEmail(data.email);
    if (!user) {
      throw new AppError('Invalid email or password', 401);
    }

    // Allow ADMIN, MANAGER, AGENT — deny CLIENT accounts
    if (user.role === UserRole.CLIENT) {
      throw new AppError('Access denied. Panel access only.', 403);
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
      allowed_sections: this.parseAllowedSections(user.allowed_sections ?? null),
    };

    const accessToken = JwtUtil.generateAccessToken(tokenPayload);
    const refreshToken = JwtUtil.generateRefreshToken(tokenPayload);

    await this.authRepository.updateRefreshToken(user.user_id, refreshToken);

    return { accessToken, refreshToken, user: this.sanitizeUserJson(user.toJSON()) };
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
        allowed_sections: this.parseAllowedSections(user.allowed_sections ?? null),
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
    const user = await this.userService.getUserById(user_id);

    if (user.role !== UserRole.CLIENT || !user.client_id) return user;

    const [client, membership] = await Promise.all([
      Client.findByPk(user.client_id, {
        attributes: ['client_id', 'first_name', 'middle_name', 'last_name', 'mobile', 'country_code', 'email', 'gender'],
        include: [{ model: ClientAddress, attributes: ['primary_address', 'primary_state', 'primary_pincode'] }],
      }),
      Membership.findOne({
        where: { client_id: user.client_id },
        attributes: ['membership_id', 'membership_number', 'status', 'package_name', 'end_date'],
        order: [['created_at', 'DESC']],
      }),
    ]);

    return {
      ...user,
      clientProfile: client ? client.toJSON() : null,
      membership: membership ? membership.toJSON() : null,
    };
  }
}
