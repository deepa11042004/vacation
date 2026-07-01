import { Op } from 'sequelize';
import { Client } from '../models/Client.model';
import { UpdateClientDTO } from '../dto/client.dto';
import { ClientFilterOptions } from '../types/client.types';
import { IClient } from '../interfaces/client.interface';

export class ClientRepository {
  async create(data: Partial<IClient>): Promise<Client> {
    return await Client.create(data);
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

  async findLastClient(): Promise<Client | null> {
    return await Client.findOne({
      order: [['client_id', 'DESC']],
      paranoid: false,
    });
  }

  async findAll(filters: ClientFilterOptions = {}): Promise<{ rows: Client[]; count: number }> {
    const { search, status, page = 1, limit = 10 } = filters;
    const offset = (page - 1) * limit;

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
      limit,
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
