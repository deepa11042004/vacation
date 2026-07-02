import { Transaction } from 'sequelize';
import { MembershipRepository } from '../repositories/membership.repository';
import { CreateMembershipDTO, UpdateMembershipDTO } from '../dto/membership.dto';
import { MembershipFilterOptions, MembershipStatus } from '../types/membership.types';
import { MEMBERSHIP_CONSTANTS } from '../constants/membership.constants';
import { AppError } from '../../../shared/middlewares/error.middleware';
import { IMembership } from '../interfaces/membership.interface';
import { sequelize } from '../../../shared/database/sequelize';
import { Client } from '../../clients/models/Client.model';
import { Package } from '../../packages/models/Package.model';
import { Payment } from '../../payments/models/Payment.model';
import { PaymentMode, PaymentStatus, PaymentType } from '../../payments/types/payment.types';
import { PackageCategory, PackageStatus } from '../../packages/types/package.types';

const CARD_PREFIX: Record<PackageCategory, string> = {
  [PackageCategory.SILVER]: 'SIL',
  [PackageCategory.GOLD]: 'GLD',
  [PackageCategory.PLATINUM]: 'PLT',
};

export class MembershipService {
  private membershipRepository: MembershipRepository;

  constructor() {
    this.membershipRepository = new MembershipRepository();
  }

  async createMembership(data: CreateMembershipDTO) {
    // Validate client
    const client = await Client.findByPk(data.client_id);
    if (!client) {
      throw new AppError(MEMBERSHIP_CONSTANTS.ERRORS.CLIENT_NOT_FOUND, 404);
    }

    // Validate package is active
    const pkg = await Package.findByPk(data.package_id);
    if (!pkg || pkg.status !== PackageStatus.ACTIVE) {
      throw new AppError(MEMBERSHIP_CONSTANTS.ERRORS.PACKAGE_NOT_FOUND, 404);
    }

    const discount_amount = data.discount_amount ?? 0;
    const down_payment = data.down_payment ?? 0;

    if (discount_amount > data.total_price) {
      throw new AppError(MEMBERSHIP_CONSTANTS.ERRORS.DISCOUNT_EXCEEDS_PRICE, 400);
    }

    const net_price = data.total_price - discount_amount;

    if (down_payment > net_price) {
      throw new AppError(MEMBERSHIP_CONSTANTS.ERRORS.DOWN_PAYMENT_EXCEEDS_NET, 400);
    }

    // Calculate end_date from start_date + package validity_years
    const start_date = new Date(data.start_date);
    const end_date = new Date(start_date);
    end_date.setFullYear(end_date.getFullYear() + pkg.validity_years);

    const outstanding_balance = net_price - down_payment;

    const t = await sequelize.transaction();
    try {
      const tempNumber = `T${Date.now()}`.slice(0, 20);

      const membershipData: Partial<IMembership> = {
        ...(data as any),
        membership_number: tempNumber,
        end_date,
        nights_remaining: pkg.total_nights,
        nights_per_year: pkg.nights_per_year,
        discount_amount,
        net_price,
        down_payment,
        outstanding_balance,
        status: MembershipStatus.ACTIVE,
      };

      const newMembership = await this.membershipRepository.create(membershipData, t);
      const membership_number = `${CARD_PREFIX[pkg.category]}-${newMembership.membership_id.toString().padStart(5, '0')}`;
      await newMembership.update({ membership_number }, { transaction: t });

      // Auto-create a DOWN_PAYMENT record if down_payment > 0
      if (down_payment > 0) {
        const tempPayNum = `T${Date.now()}${Math.random().toString(36).slice(2, 5)}`.slice(0, 20);
        const paymentRecord = await Payment.create({
          payment_number: tempPayNum,
          membership_id: newMembership.membership_id,
          client_id: data.client_id,
          payment_type: PaymentType.DOWN_PAYMENT,
          amount: down_payment,
          payment_date: data.sale_date,
          payment_mode: data.payment_mode as unknown as PaymentMode,
          status: PaymentStatus.PAID,
          remarks: 'Auto-created down payment at membership creation',
          created_by: data.created_by ?? null,
        }, { transaction: t });

        const payment_number = `PAY-${paymentRecord.payment_id.toString().padStart(6, '0')}`;
        await paymentRecord.update({ payment_number }, { transaction: t });
      }

      await t.commit();
      return this.getMembershipById(newMembership.membership_id);
    } catch (error) {
      await t.rollback();
      throw error;
    }
  }

  async getMembershipById(membership_id: number) {
    const membership = await this.membershipRepository.findById(membership_id);
    if (!membership) {
      throw new AppError(MEMBERSHIP_CONSTANTS.ERRORS.NOT_FOUND, 404);
    }
    return membership.toJSON();
  }

  async getAllMemberships(filters: MembershipFilterOptions) {
    const { rows, count } = await this.membershipRepository.findAll(filters);
    return {
      memberships: rows.map((m) => m.toJSON()),
      total: count,
      page: filters.page || 1,
      limit: filters.limit || 10,
    };
  }

  async getMembershipsByClientId(client_id: number) {
    const memberships = await this.membershipRepository.findByClientId(client_id);
    return memberships.map((m) => m.toJSON());
  }

  async updateMembership(membership_id: number, data: UpdateMembershipDTO) {
    const membership = await this.membershipRepository.findById(membership_id);
    if (!membership) {
      throw new AppError(MEMBERSHIP_CONSTANTS.ERRORS.NOT_FOUND, 404);
    }

    // Recalculate net_price and outstanding_balance if price fields changed
    const updatedData: any = { ...data };
    if (data.total_price !== undefined || data.discount_amount !== undefined) {
      const total_price = data.total_price ?? membership.total_price;
      const discount_amount = data.discount_amount ?? membership.discount_amount;

      if (discount_amount > total_price) {
        throw new AppError(MEMBERSHIP_CONSTANTS.ERRORS.DISCOUNT_EXCEEDS_PRICE, 400);
      }

      const net_price = total_price - discount_amount;
      // Adjust outstanding balance proportionally (keep what's been paid the same)
      const paid = membership.net_price - membership.outstanding_balance;
      updatedData.net_price = net_price;
      updatedData.outstanding_balance = Math.max(0, net_price - paid);
    }

    // Recalculate end_date if start_date changes
    if (data.start_date) {
      const pkg = await Package.findByPk(membership.package_id);
      if (pkg) {
        const end_date = new Date(data.start_date);
        end_date.setFullYear(end_date.getFullYear() + pkg.validity_years);
        updatedData.end_date = end_date;
      }
    }

    await this.membershipRepository.update(membership_id, updatedData);
    return this.getMembershipById(membership_id);
  }

  async cancelMembership(membership_id: number, reason: string, updated_by?: number | null) {
    const membership = await this.membershipRepository.findById(membership_id);
    if (!membership) {
      throw new AppError(MEMBERSHIP_CONSTANTS.ERRORS.NOT_FOUND, 404);
    }
    if (membership.status === MembershipStatus.CANCELLED) {
      throw new AppError(MEMBERSHIP_CONSTANTS.ERRORS.ALREADY_CANCELLED, 400);
    }
    await this.membershipRepository.update(membership_id, {
      status: MembershipStatus.CANCELLED,
      cancellation_reason: reason,
      updated_by,
    });
  }

  async suspendMembership(membership_id: number, updated_by?: number | null) {
    const membership = await this.membershipRepository.findById(membership_id);
    if (!membership) {
      throw new AppError(MEMBERSHIP_CONSTANTS.ERRORS.NOT_FOUND, 404);
    }
    if (membership.status !== MembershipStatus.ACTIVE) {
      throw new AppError('Only ACTIVE memberships can be suspended', 400);
    }
    await this.membershipRepository.update(membership_id, {
      status: MembershipStatus.SUSPENDED,
      updated_by,
    });
  }

  async reactivateMembership(membership_id: number, updated_by?: number | null) {
    const membership = await this.membershipRepository.findById(membership_id);
    if (!membership) {
      throw new AppError(MEMBERSHIP_CONSTANTS.ERRORS.NOT_FOUND, 404);
    }
    if (membership.status !== MembershipStatus.SUSPENDED) {
      throw new AppError(MEMBERSHIP_CONSTANTS.ERRORS.NOT_SUSPENDED, 400);
    }
    await this.membershipRepository.update(membership_id, {
      status: MembershipStatus.ACTIVE,
      updated_by,
    });
  }

  async softDeleteMembership(membership_id: number) {
    const membership = await this.membershipRepository.findById(membership_id);
    if (!membership) {
      throw new AppError(MEMBERSHIP_CONSTANTS.ERRORS.NOT_FOUND, 404);
    }
    await this.membershipRepository.delete(membership_id);
  }

  async restoreMembership(membership_id: number) {
    const membership = await this.membershipRepository.findByIdWithDeleted(membership_id);
    if (!membership) {
      throw new AppError(MEMBERSHIP_CONSTANTS.ERRORS.NOT_FOUND, 404);
    }
    if (!membership.deleted_at) {
      throw new AppError('Membership is not deleted', 400);
    }
    await this.membershipRepository.restore(membership_id);
  }

  // Called by payment service after recording a payment — adjusts outstanding balance
  async adjustOutstandingBalance(membership_id: number, amountDelta: number, transaction?: Transaction) {
    const membership = await this.membershipRepository.findById(membership_id);
    if (!membership) {
      throw new AppError(MEMBERSHIP_CONSTANTS.ERRORS.NOT_FOUND, 404);
    }
    const newBalance = parseFloat((membership.outstanding_balance - amountDelta).toFixed(2));
    await this.membershipRepository.update(membership_id, { outstanding_balance: newBalance }, transaction);
  }
}
