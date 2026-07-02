import { Op } from 'sequelize';
import { Transaction } from 'sequelize';
import { Payment } from '../models/Payment.model';
import { UpdatePaymentDTO } from '../dto/payment.dto';
import { IPayment } from '../interfaces/payment.interface';
import { PaymentFilterOptions, PaymentStatus, PaymentType } from '../types/payment.types';
import { Membership } from '../../memberships/models/Membership.model';
import { Client } from '../../clients/models/Client.model';

const MAX_LIMIT = 100;

const INCLUDE_ASSOCIATIONS = [
  { model: Membership, as: 'membership', attributes: ['membership_id', 'membership_number'] },
  { model: Client, as: 'client', attributes: ['client_id', 'client_code', 'first_name', 'last_name'] },
];

export class PaymentRepository {
  async create(data: Partial<IPayment>, transaction?: Transaction): Promise<Payment> {
    return await Payment.create(data, { transaction });
  }

  async findById(payment_id: number): Promise<Payment | null> {
    return await Payment.findByPk(payment_id, { include: INCLUDE_ASSOCIATIONS });
  }

  async findAll(filters: PaymentFilterOptions = {}): Promise<{ rows: Payment[]; count: number }> {
    const { membership_id, client_id, payment_type, status, from_date, to_date, page = 1, limit = 10 } = filters;
    const cappedLimit = Math.min(limit, MAX_LIMIT);
    const offset = (page - 1) * cappedLimit;

    const where: any = {};

    if (membership_id) where.membership_id = membership_id;
    if (client_id) where.client_id = client_id;
    if (payment_type) where.payment_type = payment_type;
    if (status) where.status = status;

    if (from_date || to_date) {
      where.payment_date = {};
      if (from_date) where.payment_date[Op.gte] = from_date;
      if (to_date) where.payment_date[Op.lte] = to_date;
    }

    return await Payment.findAndCountAll({
      where,
      include: INCLUDE_ASSOCIATIONS,
      limit: cappedLimit,
      offset,
      order: [['payment_date', 'DESC']],
    });
  }

  async sumPaidByMembership(membership_id: number, transaction?: Transaction): Promise<number> {
    const result = await Payment.sum('amount', {
      where: {
        membership_id,
        status: PaymentStatus.PAID,
        payment_type: { [Op.ne]: PaymentType.REFUND },
      },
      transaction,
    });
    return result || 0;
  }

  async update(payment_id: number, data: UpdatePaymentDTO): Promise<[number, Payment[]]> {
    return await Payment.update(data, {
      where: { payment_id },
      returning: true,
    });
  }

  async updateStatus(payment_id: number, status: PaymentStatus, transaction?: Transaction): Promise<void> {
    await Payment.update({ status }, { where: { payment_id }, transaction });
  }
}
