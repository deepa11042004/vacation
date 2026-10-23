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

  async markEmailSent(invoice_id: number) {
    await this.invoiceRepository.update(invoice_id, { is_email_sent: true });
  }

  /** Invoices are never edited or deleted; cancelling is the only way to void one. */
  async cancelInvoice(invoice_id: number, cancelled_by: number | null) {
    const invoice = await this.invoiceRepository.findById(invoice_id);
    if (!invoice) throw new AppError('Invoice not found', 404);
    if (invoice.cancelled_at) throw new AppError('Invoice is already cancelled', 400);
    await this.invoiceRepository.update(invoice_id, { cancelled_at: new Date(), cancelled_by });
  }
}
