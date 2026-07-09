import { Op } from 'sequelize';
import { Invoice } from '../models/Invoice.model';
import { IInvoice } from '../interfaces/invoice.interface';
import { InvoiceFilterOptions } from '../types/invoice.types';

const MAX_LIMIT = 100;

export class InvoiceRepository {
  async create(data: Partial<IInvoice>): Promise<Invoice> {
    return await Invoice.create(data);
  }

  async findById(invoice_id: number): Promise<Invoice | null> {
    return await Invoice.findByPk(invoice_id, { paranoid: false });
  }

  async findAll(filters: InvoiceFilterOptions = {}): Promise<{ rows: Invoice[]; count: number }> {
    const { search, page = 1, limit = 20 } = filters;
    const cappedLimit = Math.min(limit, MAX_LIMIT);
    const offset = (page - 1) * cappedLimit;

    const where: Record<string, unknown> = {};
    if (search) {
      where[Op.or as unknown as string] = [
        { client_name:  { [Op.like]: `%${search}%` } },
        { invoice_no:   { [Op.like]: `%${search}%` } },
        { card_number:  { [Op.like]: `%${search}%` } },
        { email:        { [Op.like]: `%${search}%` } },
      ];
    }

    return await Invoice.findAndCountAll({
      where,
      limit: cappedLimit,
      offset,
      order: [['created_at', 'DESC']],
      paranoid: false,
    });
  }

  async softDelete(invoice_id: number): Promise<number> {
    return await Invoice.destroy({ where: { invoice_id } });
  }

  async restore(invoice_id: number): Promise<void> {
    await Invoice.restore({ where: { invoice_id } });
  }

  async permanentDelete(invoice_id: number): Promise<void> {
    await Invoice.destroy({ where: { invoice_id }, force: true });
  }
}
