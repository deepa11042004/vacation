import bcrypt from 'bcrypt';
import { UserRepository } from '../repositories/user.repository';
import { CreateUserDTO, UpdateUserDTO } from '../dto/user.dto';
import { UserFilterOptions } from '../types/user.types';
import { AppError } from '../../../shared/middlewares/error.middleware';
import { IUser } from '../interfaces/user.interface';

export class UserService {
  private userRepository: UserRepository;

  constructor() {
    this.userRepository = new UserRepository();
  }

  async createUser(data: CreateUserDTO) {
    // 1. Check unique email
    const existingEmail = await this.userRepository.findByEmail(data.email);
    if (existingEmail) {
      throw new AppError('User with this email already exists', 400);
    }

    // 2. Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(data.password!, salt);

    // 3. Create
    const userData: Partial<IUser> = {
      ...data,
      password: hashedPassword,
    };

    const newUser = await this.userRepository.create(userData);
    const userJson = newUser.toJSON();
    delete userJson.password;
    return userJson;
  }

  async getUserById(user_id: number) {
    const user = await this.userRepository.findById(user_id);
    if (!user) {
      throw new AppError('User not found', 404);
    }
    const userJson = user.toJSON();
    delete userJson.password;
    return userJson;
  }

  async getAllUsers(filters: UserFilterOptions) {
    const { rows, count } = await this.userRepository.findAll(filters);
    const users = rows.map((user) => {
      const userJson = user.toJSON();
      delete userJson.password;
      return userJson;
    });

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
      throw new AppError('User not found', 404);
    }

    // Check unique email if email is updated
    if (data.email && data.email !== user.email) {
      const existingEmail = await this.userRepository.findByEmail(data.email);
      if (existingEmail) {
        throw new AppError('User with this email already exists', 400);
      }
    }

    // Hash password if updated
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
      throw new AppError('User not found', 404);
    }

    await this.userRepository.delete(user_id);
    return { message: 'User deleted successfully' };
  }
}
