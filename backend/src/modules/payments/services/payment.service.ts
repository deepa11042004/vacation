import { PaymentRepository } from '../repositories/payment.repository';
import { CreatePaymentDTO, UpdatePaymentDTO } from '../dto/payment.dto';
import { PaymentFilterOptions, PaymentStatus, PaymentType } from '../types/payment.types';
import { PAYMENT_CONSTANTS } from '../constants/payment.constants';
import { AppError } from '../../../shared/middlewares/error.middleware';
import { IPayment } from '../interfaces/payment.interface';
import { sequelize } from '../../../shared/database/sequelize';
import { MembershipService } from '../../memberships/services/membership.service';
import { MembershipStatus } from '../../memberships/types/membership.types';
import { Membership } from '../../memberships/models/Membership.model';

export class PaymentService {
  private paymentRepository: PaymentRepository;
  private membershipService: MembershipService;

  constructor() {
    this.paymentRepository = new PaymentRepository();
    this.membershipService = new MembershipService();
  }

  async createPayment(data: CreatePaymentDTO) {
    const membership = await Membership.findByPk(data.membership_id);
    if (!membership) {
      throw new AppError(PAYMENT_CONSTANTS.ERRORS.MEMBERSHIP_NOT_FOUND, 404);
    }

    const status = data.status ?? PaymentStatus.PAID;

    // If it's a real incoming payment (not a refund), check it doesn't exceed balance
    if (status === PaymentStatus.PAID && data.payment_type !== PaymentType.REFUND) {
      if (data.amount > membership.outstanding_balance) {
        throw new AppError(PAYMENT_CONSTANTS.ERRORS.EXCEEDS_BALANCE, 400);
      }
    }

    // Refund: can't refund more than total already paid
    if (data.payment_type === PaymentType.REFUND && status === PaymentStatus.PAID) {
      const totalPaid = await this.paymentRepository.sumPaidByMembership(data.membership_id);
      if (data.amount > totalPaid) {
        throw new AppError(PAYMENT_CONSTANTS.ERRORS.REFUND_EXCEEDS_PAID, 400);
      }
    }

    const t = await sequelize.transaction();
    try {
      const tempNum = `T${Date.now()}${Math.random().toString(36).slice(2, 5)}`.slice(0, 20);
      const newPayment = await this.paymentRepository.create(
        { ...(data as Partial<IPayment>), payment_number: tempNum, status },
        t,
      );

      const payment_number = `PAY-${newPayment.payment_id.toString().padStart(6, '0')}`;
      await newPayment.update({ payment_number }, { transaction: t });

      // Update membership outstanding_balance for PAID payments
      if (status === PaymentStatus.PAID) {
        // Refunds increase the outstanding balance (money going back to client)
        const delta = data.payment_type === PaymentType.REFUND ? -data.amount : data.amount;
        await this.membershipService.adjustOutstandingBalance(data.membership_id, delta, t);
      }

      await t.commit();
      return this.getPaymentById(newPayment.payment_id);
    } catch (error) {
      await t.rollback();
      throw error;
    }
  }

  async getPaymentById(payment_id: number) {
    const payment = await this.paymentRepository.findById(payment_id);
    if (!payment) {
      throw new AppError(PAYMENT_CONSTANTS.ERRORS.NOT_FOUND, 404);
    }
    return payment.toJSON();
  }

  async getAllPayments(filters: PaymentFilterOptions) {
    const { rows, count } = await this.paymentRepository.findAll(filters);
    return {
      payments: rows.map((p) => p.toJSON()),
      total: count,
      page: filters.page || 1,
      limit: filters.limit || 10,
    };
  }

  async getPaymentsByMembership(membership_id: number) {
    const { rows } = await this.paymentRepository.findAll({ membership_id, limit: 100 });
    return rows.map((p) => p.toJSON());
  }

  async getPaymentsByClient(client_id: number) {
    const { rows, count } = await this.paymentRepository.findAll({ client_id, limit: 100 });
    return {
      payments: rows.map((p) => p.toJSON()),
      total: count,
    };
  }

  async updatePayment(payment_id: number, data: UpdatePaymentDTO) {
    const payment = await this.paymentRepository.findById(payment_id);
    if (!payment) {
      throw new AppError(PAYMENT_CONSTANTS.ERRORS.NOT_FOUND, 404);
    }
    if (payment.status === PaymentStatus.CANCELLED) {
      throw new AppError(PAYMENT_CONSTANTS.ERRORS.ALREADY_CANCELLED, 400);
    }

    // If amount changes on a PAID record, rebalance the membership outstanding
    if (data.amount && payment.status === PaymentStatus.PAID) {
      const oldAmount = parseFloat(String(payment.amount));
      const newAmount = data.amount;
      const diff = newAmount - oldAmount;
      const t = await sequelize.transaction();
      try {
        await this.paymentRepository.update(payment_id, data);
        await this.membershipService.adjustOutstandingBalance(payment.membership_id, diff, t);
        await t.commit();
      } catch (error) {
        await t.rollback();
        throw error;
      }
    } else {
      await this.paymentRepository.update(payment_id, data);
    }

    return this.getPaymentById(payment_id);
  }

  async cancelPayment(payment_id: number) {
    const payment = await this.paymentRepository.findById(payment_id);
    if (!payment) {
      throw new AppError(PAYMENT_CONSTANTS.ERRORS.NOT_FOUND, 404);
    }
    if (payment.status === PaymentStatus.CANCELLED) {
      throw new AppError(PAYMENT_CONSTANTS.ERRORS.ALREADY_CANCELLED, 400);
    }

    const t = await sequelize.transaction();
    try {
      await this.paymentRepository.updateStatus(payment_id, PaymentStatus.CANCELLED, t);

      // If the payment was PAID, restore the outstanding balance
      if (payment.status === PaymentStatus.PAID) {
        const restoreAmount = payment.payment_type === PaymentType.REFUND
          ? -parseFloat(String(payment.amount))
          : parseFloat(String(payment.amount));
        await this.membershipService.adjustOutstandingBalance(payment.membership_id, -restoreAmount, t);
      }

      await t.commit();
      return this.getPaymentById(payment_id);
    } catch (error) {
      await t.rollback();
      throw error;
    }
  }
}
