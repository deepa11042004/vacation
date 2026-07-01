import bcrypt from 'bcrypt';
import { UserRepository } from '../repositories/user.repository';
import { CreateUserDTO, UpdateUserDTO } from '../dto/user.dto';
import { UserFilterOptions } from '../types/user.types';
import { AppError } from '../../../shared/middlewares/error.middleware';
import { IUser } from '../interfaces/user.interface';
import { USER_CONSTANTS } from '../constants/user.constants';

export class UserService {
  private userRepository: UserRepository;

  constructor() {
    this.userRepository = new UserRepository();
  }

  private sanitizeUser(userJson: any) {
    delete userJson.password;
    delete userJson.refresh_token;
    return userJson;
  }

  async createUser(data: CreateUserDTO) {
    const existingEmail = await this.userRepository.findByEmail(data.email);
    if (existingEmail) {
      throw new AppError(USER_CONSTANTS.ERRORS.EMAIL_EXISTS, 400);
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(data.password!, salt);

    const userData: Partial<IUser> = {
      ...data,
      password: hashedPassword,
    };

    const newUser = await this.userRepository.create(userData);
    return this.sanitizeUser(newUser.toJSON());
  }

  async getUserById(user_id: number) {
    const user = await this.userRepository.findById(user_id);
    if (!user) {
      throw new AppError(USER_CONSTANTS.ERRORS.NOT_FOUND, 404);
    }
    return this.sanitizeUser(user.toJSON());
  }

  async getAllUsers(filters: UserFilterOptions) {
    const { rows, count } = await this.userRepository.findAll(filters);
    const users = rows.map((user) => this.sanitizeUser(user.toJSON()));

    return {
      users,
      total: count,
      page: filters.page || 1,
      limit: filters.limit || 10,
    };
  }

  async updateUser(user_id: number, data: UpdateUserDTO) {
    const user = await this.userRepository.findById(user_id);
    if (!user) {
      throw new AppError(USER_CONSTANTS.ERRORS.NOT_FOUND, 404);
    }

    if (data.email && data.email !== user.email) {
      const existingEmail = await this.userRepository.findByEmail(data.email);
      if (existingEmail) {
        throw new AppError(USER_CONSTANTS.ERRORS.EMAIL_EXISTS, 400);
      }
    }

    if (data.password) {
      const salt = await bcrypt.genSalt(10);
      data.password = await bcrypt.hash(data.password, salt);
    }

    await this.userRepository.update(user_id, data);
    return await this.getUserById(user_id);
  }

  async deleteUser(user_id: number) {
    const user = await this.userRepository.findById(user_id);
    if (!user) {
      throw new AppError(USER_CONSTANTS.ERRORS.NOT_FOUND, 404);
    }

    await this.userRepository.delete(user_id);
    return { message: 'User deleted successfully' };
  }
}
