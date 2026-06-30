import bcrypt from 'bcrypt';
import { ClientRepository } from '../repositories/client.repository';
import { CreateClientDTO, UpdateClientDTO } from '../dto/client.dto';
import { ClientFilterOptions } from '../types/client.types';
import { CLIENT_CONSTANTS } from '../constants/client.constants';
import { AppError } from '../../../shared/middlewares/error.middleware';
import { IClient } from '../interfaces/client.interface';

export class ClientService {
  private clientRepository: ClientRepository;

  constructor() {
    this.clientRepository = new ClientRepository();
  }

  async createClient(data: CreateClientDTO) {
    // 1. Check unique email
    const existingEmail = await this.clientRepository.findByEmail(data.email);
    if (existingEmail) {
      throw new AppError(CLIENT_CONSTANTS.ERRORS.EMAIL_EXISTS, 400);
    }

    // 2. Check unique mobile
    const existingMobile = await this.clientRepository.findByMobile(data.mobile);
    if (existingMobile) {
      throw new AppError(CLIENT_CONSTANTS.ERRORS.MOBILE_EXISTS, 400);
    }

    // 3. Generate client_code
    const lastClient = await this.clientRepository.findLastClient();
    let newCodeNumber = 1;
    if (lastClient && lastClient.client_code) {
      const parts = lastClient.client_code.split('-');
      if (parts.length === 2) {
        newCodeNumber = parseInt(parts[1], 10) + 1;
      }
    }
    const client_code = `CLI-${newCodeNumber.toString().padStart(6, '0')}`;

    // 4. Hash password if provided
    let password = data.password;
    if (password) {
      const salt = await bcrypt.genSalt(10);
      password = await bcrypt.hash(password, salt);
    }

    // 5. Create
    const clientData: Partial<IClient> = {
      ...data,
      client_code,
      password,
    };

    const newClient = await this.clientRepository.create(clientData);
    
    // Remove password from returned data
    const clientResponse = newClient.toJSON();
    delete clientResponse.password;
    
    return clientResponse;
  }

  async getClientById(client_id: string) {
    const client = await this.clientRepository.findById(client_id);
    if (!client) {
      throw new AppError(CLIENT_CONSTANTS.ERRORS.NOT_FOUND, 404);
    }
    const clientResponse = client.toJSON();
    delete clientResponse.password;
    return clientResponse;
  }

  async getAllClients(filters: ClientFilterOptions) {
    const { rows, count } = await this.clientRepository.findAll(filters);
    
    // Omit passwords
    const clients = rows.map((client) => {
      const clientJson = client.toJSON();
      delete clientJson.password;
      return clientJson;
    });

    return {
      clients,
      total: count,
      page: filters.page || 1,
      limit: filters.limit || 10,
    };
  }

  async updateClient(client_id: string, data: UpdateClientDTO) {
    // 1. Verify existence
    const client = await this.clientRepository.findById(client_id);
    if (!client) {
      throw new AppError(CLIENT_CONSTANTS.ERRORS.NOT_FOUND, 404);
    }

    // 2. Check unique constraints if updating email/mobile
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

    // 3. Hash password if being updated
    let password = data.password;
    if (password) {
      const salt = await bcrypt.genSalt(10);
      password = await bcrypt.hash(password, salt);
      data.password = password;
    }

    await this.clientRepository.update(client_id, data);
    
    return this.getClientById(client_id);
  }

  async softDeleteClient(client_id: string) {
    const client = await this.clientRepository.findById(client_id);
    if (!client) {
      throw new AppError(CLIENT_CONSTANTS.ERRORS.NOT_FOUND, 404);
    }

    await this.clientRepository.delete(client_id);
    return { message: 'Client deleted successfully' };
  }

  async restoreClient(client_id: string) {
    const client = await this.clientRepository.findByIdWithDeleted(client_id);
    if (!client) {
      throw new AppError(CLIENT_CONSTANTS.ERRORS.NOT_FOUND, 404);
    }

    if (!client.deleted_at) {
      throw new AppError('Client is not deleted', 400);
    }

    await this.clientRepository.restore(client_id);
    return { message: 'Client restored successfully' };
  }
}
