import { Transaction } from 'sequelize';
import { ClientOffer } from '../models/ClientOffer.model';
import { IClientOffer } from '../interfaces/client-offer.interface';

export class ClientOfferRepository {
  async findByClientId(client_id: number): Promise<ClientOffer[]> {
    return ClientOffer.findAll({
      where: { client_id },
      order: [['created_at', 'ASC']],
    });
  }

  async create(data: Partial<IClientOffer>, transaction?: Transaction): Promise<ClientOffer> {
    return ClientOffer.create(data, { transaction });
  }

  async bulkCreate(rows: Partial<IClientOffer>[], transaction?: Transaction): Promise<ClientOffer[]> {
    return ClientOffer.bulkCreate(rows as IClientOffer[], { transaction });
  }

  async delete(offer_id: number): Promise<number> {
    return ClientOffer.destroy({ where: { offer_id } });
  }
}
