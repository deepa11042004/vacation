import { Transaction } from 'sequelize';
import { ClientOfferRepository } from '../repositories/client-offer.repository';
import { ClientOffer } from '../models/ClientOffer.model';

export interface CreateOfferInput {
  offer_name: string;
  valid_until?: string | null;
}

const repo = new ClientOfferRepository();

export class ClientOfferService {
  async getByClientId(client_id: number): Promise<ClientOffer[]> {
    return repo.findByClientId(client_id);
  }

  async addOffer(client_id: number, input: CreateOfferInput): Promise<ClientOffer> {
    return repo.create({ client_id, offer_name: input.offer_name, valid_until: input.valid_until ?? null });
  }

  async bulkAdd(client_id: number, offers: CreateOfferInput[], transaction?: Transaction): Promise<void> {
    if (!offers.length) return;
    const rows = offers.map(o => ({
      client_id,
      offer_name: o.offer_name,
      valid_until: o.valid_until ?? null,
    }));
    await repo.bulkCreate(rows, transaction);
  }

  async deleteOffer(offer_id: number): Promise<void> {
    await repo.delete(offer_id);
  }
}
