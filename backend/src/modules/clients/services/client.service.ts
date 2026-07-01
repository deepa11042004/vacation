import { ClientRepository } from '../repositories/client.repository';
import { CreateClientDTO, UpdateClientDTO } from '../dto/client.dto';
import { ClientFilterOptions } from '../types/client.types';
import { CLIENT_CONSTANTS } from '../constants/client.constants';
import { AppError } from '../../../shared/middlewares/error.middleware';
import { IClient } from '../interfaces/client.interface';
import { sequelize } from '../../../shared/database/sequelize';

export class ClientService {
  private clientRepository: ClientRepository;

  constructor() {
    this.clientRepository = new ClientRepository();
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
      // Use a unique temp code — replaced atomically inside the transaction
      const tempCode = `T${Date.now()}${Math.random().toString(36).slice(2, 8)}`.slice(0, 20);
      const newClient = await this.clientRepository.create(
        { ...(data as Partial<IClient>), client_code: tempCode },
        t,
      );

      // Derive code from the DB-assigned auto-increment PK — no race condition possible
      const client_code = `CLI-${newClient.client_id.toString().padStart(6, '0')}`;
      await newClient.update({ client_code }, { transaction: t });
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
    const clients = rows.map((client) => client.toJSON());

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
