import { UniqueConstraintError } from 'sequelize';
import { Transaction } from 'sequelize';
import { MembershipRepository } from '../repositories/membership.repository';
import { CreateMembershipDTO, UpdateMembershipDTO } from '../dto/membership.dto';
import { MembershipFilterOptions, MembershipStatus } from '../types/membership.types';
import { MEMBERSHIP_CONSTANTS } from '../constants/membership.constants';
import { AppError } from '../../../shared/middlewares/error.middleware';
import { IMembership } from '../interfaces/membership.interface';
import { sequelize } from '../../../shared/database/sequelize';
import { Client } from '../../clients/models/Client.model';
import { Payment } from '../../payments/models/Payment.model';
import { Booking } from '../../bookings/models/Booking.model';
import { AmcPayment } from '../../amc-payments/models/AmcPayment.model';
import { PaymentMode, PaymentStatus, PaymentType } from '../../payments/types/payment.types';
import { round2, uniqueTemp } from '../../../shared/utils/math.util';

export class MembershipService {
  private membershipRepository: MembershipRepository;

  constructor() {
    this.membershipRepository = new MembershipRepository();
  }

  async createMembership(data: CreateMembershipDTO) {
    const client = await Client.findByPk(data.client_id);
    if (!client) throw new AppError(MEMBERSHIP_CONSTANTS.ERRORS.CLIENT_NOT_FOUND, 404);

    if (!data.package_name) {
      throw new AppError('package_name is required', 400);
    }

    const validityYears = data.validity_years ?? 1;
    const nightsPerYear = data.nights_per_year ?? 0;
    const totalNights   = nightsPerYear * validityYears;
    const clean         = data.package_name.replace(/[^A-Za-z]/g, '').toUpperCase();
    const membershipPrefix = (clean.slice(0, 3) || 'MEM').padEnd(3, 'X');

    const total_price    = round2(data.total_price);
    const discount_amount = round2(data.discount_amount ?? 0);
    const down_payment   = round2(data.down_payment ?? 0);

    if (discount_amount > total_price) {
      throw new AppError(MEMBERSHIP_CONSTANTS.ERRORS.DISCOUNT_EXCEEDS_PRICE, 400);
    }

    const net_price = round2(total_price - discount_amount);

    if (down_payment > net_price) {
      throw new AppError(MEMBERSHIP_CONSTANTS.ERRORS.DOWN_PAYMENT_EXCEEDS_NET, 400);
    }

    const outstanding_balance = round2(net_price - down_payment);

    const ref_date = new Date(data.sale_date);
    const end_date = new Date(ref_date);
    end_date.setFullYear(end_date.getFullYear() + validityYears);

    const t = await sequelize.transaction();
    try {
      const tempNumber = uniqueTemp('T', 20);

      const membershipData: Partial<IMembership> = {
        ...(data as any),
        membership_number: tempNumber,
        end_date,
        nights_remaining: totalNights,
        nights_per_year: nightsPerYear,
        validity_years: validityYears,
        total_price,
        discount_amount,
        net_price,
        down_payment,
        outstanding_balance,
        status: MembershipStatus.ACTIVE,
      };

      const newMembership = await this.membershipRepository.create(membershipData, t);
      const membership_number = `${membershipPrefix}-${newMembership.membership_id.toString().padStart(5, '0')}`;
      await newMembership.update({ membership_number }, { transaction: t });

      if (down_payment > 0) {
        const tempPayNum = uniqueTemp('P', 20);
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

      // If an AMC amount is provided, pre-seed one amc_payment row per validity year.
      // Each row starts as unpaid (is_received: false) so admin can mark payment later.
      if (data.amc && data.amc > 0) {
        for (let year = 1; year <= validityYears; year++) {
          await AmcPayment.create({
            client_id: data.client_id,
            membership_id: newMembership.membership_id,
            year_number: year,
            amount: data.amc,
            is_received: false,
          }, { transaction: t });
        }
      }

      await t.commit();
      return this.getMembershipById(newMembership.membership_id);
    } catch (error) {
      await t.rollback();
      if (error instanceof UniqueConstraintError) {
        const field = error.errors?.[0]?.path ?? 'field';
        throw new AppError(`A membership with this ${field} already exists.`, 409);
      }
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

  async getReferralsByClientId(client_id: number) {
    const memberships = await this.membershipRepository.findByClientId(client_id);
    const membershipIds = memberships.map((m) => m.membership_id);

    const referralMemberships = await this.membershipRepository.findReferralsByMembershipIds(membershipIds);
    const referrals = referralMemberships.map((m) => {
      const json = m.toJSON() as any;
      return {
        membership_id: json.membership_id,
        membership_number: json.membership_number,
        status: json.status,
        sale_date: json.sale_date,
        client: json.client
          ? {
              client_id: json.client.client_id,
              first_name: json.client.first_name,
              last_name: json.client.last_name,
              email: json.client.email,
              mobile: json.client.mobile,
            }
          : null,
      };
    });

    const total_referrals = referrals.length;
    const points_per_referral = MEMBERSHIP_CONSTANTS.REFERRAL_POINTS_PER_REFERRAL;
    const total_points = total_referrals * points_per_referral;

    return { referrals, total_referrals, points_per_referral, total_points };
  }

  async updateMembership(membership_id: number, data: UpdateMembershipDTO) {
    const membership = await this.membershipRepository.findById(membership_id);
    if (!membership) {
      throw new AppError(MEMBERSHIP_CONSTANTS.ERRORS.NOT_FOUND, 404);
    }

    const updatedData: any = { ...data };

    if (data.total_price !== undefined || data.discount_amount !== undefined) {
      const total_price    = round2(data.total_price    ?? membership.total_price);
      const discount_amount = round2(data.discount_amount ?? membership.discount_amount);

      if (discount_amount > total_price) {
        throw new AppError(MEMBERSHIP_CONSTANTS.ERRORS.DISCOUNT_EXCEEDS_PRICE, 400);
      }

      const net_price = round2(total_price - discount_amount);
      const paid = round2(membership.net_price - membership.outstanding_balance);
      updatedData.net_price = net_price;
      updatedData.outstanding_balance = round2(Math.max(0, net_price - paid));
    }

    if (data.sale_date) {
      const validity = membership.validity_years ?? 1;
      const end_date = new Date(data.sale_date);
      end_date.setFullYear(end_date.getFullYear() + validity);
      updatedData.end_date = end_date;
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

  async permanentDeleteMembership(membership_id: number) {
    const membership = await this.membershipRepository.findByIdWithDeleted(membership_id);
    if (!membership) throw new AppError(MEMBERSHIP_CONSTANTS.ERRORS.NOT_FOUND, 404);
    if (!membership.deleted_at) throw new AppError('Membership must be soft-deleted before permanent deletion', 400);

    const t = await sequelize.transaction();
    try {
      // bookings and amc_payments have no onDelete on their membership_id FK (defaults to RESTRICT).
      // payments has onDelete: CASCADE so the DB handles it after membership is deleted.
      await Booking.destroy({ where: { membership_id }, force: true, transaction: t });
      await AmcPayment.destroy({ where: { membership_id }, force: true, transaction: t });
      await this.membershipRepository.permanentDelete(membership_id, t);
      await t.commit();
    } catch (err) {
      await t.rollback();
      throw err;
    }
  }

  async adjustOutstandingBalance(membership_id: number, amountDelta: number, transaction?: Transaction) {
    const membership = await this.membershipRepository.findById(membership_id);
    if (!membership) {
      throw new AppError(MEMBERSHIP_CONSTANTS.ERRORS.NOT_FOUND, 404);
    }
    const newBalance = round2(membership.outstanding_balance - amountDelta);
    await this.membershipRepository.update(membership_id, { outstanding_balance: newBalance }, transaction);
  }
}
