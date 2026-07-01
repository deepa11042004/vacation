import { Op } from 'sequelize';
import { User } from '../models/User.model';
import { Client } from '../../clients/models/Client.model';
import { UpdateUserDTO } from '../dto/user.dto';
import { UserFilterOptions } from '../types/user.types';
import { IUser } from '../interfaces/user.interface';

export class UserRepository {
  async create(data: Partial<IUser>): Promise<User> {
    return await User.create(data);
  }

  async findById(user_id: number): Promise<User | null> {
    return await User.findByPk(user_id, {
      include: [{ model: Client, as: 'client' }],
    });
  }

  async findByEmail(email: string): Promise<User | null> {
    return await User.findOne({
      where: { email },
      include: [{ model: Client, as: 'client' }],
    });
  }

  async findByIdWithDeleted(user_id: number): Promise<User | null> {
    return await User.findByPk(user_id, { paranoid: false });
  }

  async findAll(filters: UserFilterOptions = {}): Promise<{ rows: User[]; count: number }> {
    const { search, role, status, page = 1, limit = 10 } = filters;
    const offset = (page - 1) * limit;

    const where: any = {};

    if (role) {
      where.role = role;
    }

    if (status) {
      where.status = status;
    }

    if (search) {
      where[Op.or] = [
        { email: { [Op.like]: `%${search}%` } },
      ];
    }

    return await User.findAndCountAll({
      where,
      limit,
      offset,
      order: [['created_at', 'DESC']],
      include: [{ model: Client, as: 'client' }],
    });
  }

  async update(user_id: number, data: UpdateUserDTO): Promise<[number, User[]]> {
    return await User.update(data, {
      where: { user_id },
      returning: true,
    });
  }

  async delete(user_id: number): Promise<number> {
    return await User.destroy({
      where: { user_id },
    });
  }
}
