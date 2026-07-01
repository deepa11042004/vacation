import { Op, Transaction } from 'sequelize';
import { Client } from '../models/Client.model';
import { UpdateClientDTO } from '../dto/client.dto';
import { ClientFilterOptions } from '../types/client.types';
import { IClient } from '../interfaces/client.interface';

const MAX_LIMIT = 100;

export class ClientRepository {
  async create(data: Partial<IClient>, transaction?: Transaction): Promise<Client> {
    return await Client.create(data, { transaction });
  }

  async findById(client_id: number): Promise<Client | null> {
    return await Client.findByPk(client_id);
  }

  async findByIdWithDeleted(client_id: number): Promise<Client | null> {
    return await Client.findByPk(client_id, { paranoid: false });
  }

  async findByEmail(email: string): Promise<Client | null> {
    return await Client.findOne({ where: { email } });
  }

  async findByMobile(mobile: string): Promise<Client | null> {
    return await Client.findOne({ where: { mobile } });
  }

  async findAll(filters: ClientFilterOptions = {}): Promise<{ rows: Client[]; count: number }> {
    const { search, status, page = 1, limit = 10 } = filters;
    const cappedLimit = Math.min(limit, MAX_LIMIT);
    const offset = (page - 1) * cappedLimit;

    const where: any = {};

    if (status) {
      where.status = status;
    }

    if (search) {
      where[Op.or] = [
        { first_name: { [Op.like]: `%${search}%` } },
        { last_name: { [Op.like]: `%${search}%` } },
        { email: { [Op.like]: `%${search}%` } },
        { mobile: { [Op.like]: `%${search}%` } },
        { client_code: { [Op.like]: `%${search}%` } },
      ];
    }

    return await Client.findAndCountAll({
      where,
      limit: cappedLimit,
      offset,
      order: [['created_at', 'DESC']],
    });
  }

  async update(client_id: number, data: UpdateClientDTO): Promise<[number, Client[]]> {
    return await Client.update(data, {
      where: { client_id },
      returning: true,
    });
  }

  async delete(client_id: number): Promise<number> {
    return await Client.destroy({
      where: { client_id },
    });
  }

  async restore(client_id: number): Promise<void> {
    await Client.restore({
      where: { client_id },
    });
  }
}
