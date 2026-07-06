import { AmcPayment } from '../models/AmcPayment.model';
import { IAmcPayment } from '../interfaces/amc-payment.interface';

export class AmcPaymentRepository {
  async findByClientId(client_id: number): Promise<AmcPayment[]> {
    return AmcPayment.findAll({
      where: { client_id },
      order: [['year_number', 'ASC']],
    });
  }

  async findByClientAndYear(client_id: number, year_number: number): Promise<AmcPayment | null> {
    return AmcPayment.findOne({ where: { client_id, year_number } });
  }

  async create(data: Partial<IAmcPayment>): Promise<AmcPayment> {
    return AmcPayment.create(data);
  }

  async update(amc_payment_id: number, data: Partial<IAmcPayment>): Promise<void> {
    await AmcPayment.update(data, { where: { amc_payment_id } });
  }
}
