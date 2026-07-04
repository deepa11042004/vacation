import { QueryTypes } from 'sequelize';
import { ClientRepository } from '../repositories/client.repository';
import { CreateClientDTO, UpdateClientDTO } from '../dto/client.dto';
import { ClientFilterOptions } from '../types/client.types';
import { CLIENT_CONSTANTS } from '../constants/client.constants';
import { AppError } from '../../../shared/middlewares/error.middleware';
import { IClient } from '../interfaces/client.interface';
import { IClientAddress } from '../interfaces/client-address.interface';
import { ClientAddress } from '../models/ClientAddress.model';
import { sequelize } from '../../../shared/database/sequelize';
import { UserService, UserRole } from '../../users';

export class ClientService {
  private clientRepository: ClientRepository;
  private userService: UserService;

  constructor() {
    this.clientRepository = new ClientRepository();
    this.userService = new UserService();
  }

  async createClient(data: CreateClientDTO) {
    const existingEmail = await this.clientRepository.findByEmail(data.email);
    if (existingEmail) {
      throw new AppError(CLIENT_CONSTANTS.ERRORS.EMAIL_EXISTS, 400);
    }

    const existingMobile = await this.clientRepository.findByMobile(data.mobile);
    if (existingMobile) {
      throw new AppError(CLIENT_CONSTANTS.ERRORS.MOBILE_EXISTS, 400);
    }

    const t = await sequelize.transaction();
    try {
      const newClient = await this.clientRepository.create(
        data as Partial<IClient>,
        t,
      );

      // Auto-create login account within the same transaction.
      // If user creation fails the entire operation rolls back — no orphaned client.
      await this.userService.createUser(
        {
          email: newClient.email,
          password: newClient.mobile,
          role: UserRole.CLIENT,
          client_id: newClient.client_id,
        },
        t,
      );

      await t.commit();
      return newClient.toJSON();
    } catch (error) {
      await t.rollback();
      throw error;
    }
  }

  async getClientById(client_id: number) {
    const client = await this.clientRepository.findById(client_id);
    if (!client) {
      throw new AppError(CLIENT_CONSTANTS.ERRORS.NOT_FOUND, 404);
    }
    return client.toJSON();
  }

  async getAllClients(filters: ClientFilterOptions) {
    const { rows, count } = await this.clientRepository.findAll(filters);

    const clientIds = rows.map(c => c.client_id);
    const memMap = new Map<number, string>();
    if (clientIds.length > 0) {
      const mems = await sequelize.query<{ client_id: number; membership_number: string }>(
        `SELECT client_id, membership_number FROM memberships
         WHERE client_id IN (:clientIds) AND deleted_at IS NULL
         ORDER BY created_at ASC`,
        { replacements: { clientIds }, type: QueryTypes.SELECT },
      );
      for (const m of mems) {
        if (!memMap.has(m.client_id)) memMap.set(m.client_id, m.membership_number);
      }
    }

    const clients = rows.map(c => ({
      ...c.toJSON(),
      membership_number: memMap.get(c.client_id) ?? null,
    }));

    return {
      clients,
      total: count,
      page: filters.page || 1,
      limit: filters.limit || 10,
    };
  }

  async updateClient(client_id: number, data: UpdateClientDTO) {
    const client = await this.clientRepository.findById(client_id);
    if (!client) {
      throw new AppError(CLIENT_CONSTANTS.ERRORS.NOT_FOUND, 404);
    }

    if (data.email && data.email !== client.email) {
      const existingEmail = await this.clientRepository.findByEmail(data.email);
      if (existingEmail) {
        throw new AppError(CLIENT_CONSTANTS.ERRORS.EMAIL_EXISTS, 400);
      }
    }

    if (data.mobile && data.mobile !== client.mobile) {
      const existingMobile = await this.clientRepository.findByMobile(data.mobile);
      if (existingMobile) {
        throw new AppError(CLIENT_CONSTANTS.ERRORS.MOBILE_EXISTS, 400);
      }
    }

    await this.clientRepository.update(client_id, data);
    return this.getClientById(client_id);
  }

  async softDeleteClient(client_id: number) {
    const client = await this.clientRepository.findById(client_id);
    if (!client) {
      throw new AppError(CLIENT_CONSTANTS.ERRORS.NOT_FOUND, 404);
    }

    await this.clientRepository.delete(client_id);
  }

  async getAddress(client_id: number) {
    const existing = await ClientAddress.findOne({ where: { client_id } });
    return existing ? existing.toJSON() : null;
  }

  async upsertAddress(client_id: number, data: Partial<IClientAddress>) {
    const client = await this.clientRepository.findById(client_id);
    if (!client) throw new AppError(CLIENT_CONSTANTS.ERRORS.NOT_FOUND, 404);
    const existing = await ClientAddress.findOne({ where: { client_id } });
    if (existing) {
      await existing.update(data);
      return existing.toJSON();
    }
    const created = await ClientAddress.create({ ...data, client_id } as IClientAddress);
    return created.toJSON();
  }

  async restoreClient(client_id: number) {
    const client = await this.clientRepository.findByIdWithDeleted(client_id);
    if (!client) {
      throw new AppError(CLIENT_CONSTANTS.ERRORS.NOT_FOUND, 404);
    }

    if (!client.deleted_at) {
      throw new AppError('Client is not deleted', 400);
    }

    await this.clientRepository.restore(client_id);
  }
}
