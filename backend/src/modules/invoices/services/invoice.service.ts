import { InvoiceRepository } from '../repositories/invoice.repository';
import { IInvoice } from '../interfaces/invoice.interface';
import { InvoiceFilterOptions } from '../types/invoice.types';
import { AppError } from '../../../shared/middlewares/error.middleware';

export class InvoiceService {
  private invoiceRepository: InvoiceRepository;

  constructor() {
    this.invoiceRepository = new InvoiceRepository();
  }

  async createInvoice(data: Partial<IInvoice>) {
    const invoice = await this.invoiceRepository.create(data);
    return invoice.toJSON() as IInvoice;
  }

  async getInvoiceById(invoice_id: number) {
    const invoice = await this.invoiceRepository.findById(invoice_id);
    if (!invoice) throw new AppError('Invoice not found', 404);
    return invoice.toJSON() as IInvoice;
  }

  async getAllInvoices(filters: InvoiceFilterOptions) {
    const { rows, count } = await this.invoiceRepository.findAll(filters);
    return {
      invoices: rows.map(r => r.toJSON() as IInvoice),
      total: count,
      page: filters.page ?? 1,
      limit: filters.limit ?? 20,
    };
  }

  async deleteInvoice(invoice_id: number) {
    const invoice = await this.invoiceRepository.findById(invoice_id);
    if (!invoice) throw new AppError('Invoice not found', 404);
    if (invoice.deleted_at) throw new AppError('Invoice already deleted', 400);
    await this.invoiceRepository.softDelete(invoice_id);
  }

  async restoreInvoice(invoice_id: number) {
    const invoice = await this.invoiceRepository.findById(invoice_id);
    if (!invoice) throw new AppError('Invoice not found', 404);
    if (!invoice.deleted_at) throw new AppError('Invoice is not deleted', 400);
    await this.invoiceRepository.restore(invoice_id);
  }
}
