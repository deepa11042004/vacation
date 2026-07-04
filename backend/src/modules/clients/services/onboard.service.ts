import { UniqueConstraintError } from 'sequelize';
import { sequelize } from '../../../shared/database/sequelize';
import { Client } from '../models/Client.model';
import { ClientAddress } from '../models/ClientAddress.model';
import { Membership } from '../../memberships/models/Membership.model';
import { Payment } from '../../payments/models/Payment.model';
import { UserService, UserRole } from '../../users';
import { AppError } from '../../../shared/middlewares/error.middleware';
import { CLIENT_CONSTANTS } from '../constants/client.constants';
import { MembershipDSA, MembershipStatus, PaymentMode as MembershipPaymentMode } from '../../memberships/types/membership.types';
import { PaymentType, PaymentStatus, PaymentMode } from '../../payments/types/payment.types';
import { IClient } from '../interfaces/client.interface';
import { IClientAddress } from '../interfaces/client-address.interface';

export interface OnboardMembershipInput {
  package_name: string;
  validity_years: number;
  nights_per_year: number;
  sale_date: string;
  start_date: string;
  total_price: number;
  discount_amount: number;
  down_payment: number;
  payment_mode: MembershipPaymentMode;
  transaction_ref?: string | null;
  bank_name?: string | null;
  dsa?: MembershipDSA | null;
  reference_by?: string | null;
  remarks?: string | null;
}

export interface OnboardClientDTO {
  client: Partial<IClient>;
  address?: Partial<IClientAddress>;
  membership: OnboardMembershipInput;
}

function round2(n: number): number {
  return parseFloat(n.toFixed(2));
}

function uniqueTemp(prefix: string, maxLen: number): string {
  const rand = Math.random().toString(36).slice(2, 7).toUpperCase();
  return `${prefix}${Date.now()}${rand}`.slice(0, maxLen);
}

export class OnboardService {
  private userService: UserService;

  constructor() {
    this.userService = new UserService();
  }

  async onboardClient(data: OnboardClientDTO) {
    const { client: clientData, address: addrData, membership: memData } = data;

    // Pre-validate uniqueness before opening transaction
    const existingEmail = await Client.findOne({ where: { email: clientData.email } });
    if (existingEmail) throw new AppError(CLIENT_CONSTANTS.ERRORS.EMAIL_EXISTS, 400);

    const existingMobile = await Client.findOne({ where: { mobile: clientData.mobile } });
    if (existingMobile) throw new AppError(CLIENT_CONSTANTS.ERRORS.MOBILE_EXISTS, 400);

    // Pre-calculate membership values (fail fast before opening transaction)
    const validityYears = memData.validity_years ?? 1;
    const nightsPerYear = memData.nights_per_year ?? 0;
    const totalNights = nightsPerYear * validityYears;

    const clean = memData.package_name.replace(/[^A-Za-z]/g, '').toUpperCase();
    const membershipPrefix = (clean.slice(0, 3) || 'MEM').padEnd(3, 'X');

    const total_price = round2(memData.total_price);
    const discount_amount = round2(memData.discount_amount ?? 0);
    const down_payment = round2(memData.down_payment ?? 0);

    if (discount_amount > total_price) {
      throw new AppError('Discount amount exceeds total price', 400);
    }
    const net_price = round2(total_price - discount_amount);
    if (down_payment > net_price) {
      throw new AppError('Down payment exceeds net price', 400);
    }
    const outstanding_balance = round2(net_price - down_payment);

    const start_date = new Date(memData.start_date);
    const end_date = new Date(start_date);
    end_date.setFullYear(end_date.getFullYear() + validityYears);

    const t = await sequelize.transaction();
    try {
      // ── Step 1: Create client ──────────────────────────────────
      const newClient = await Client.create(clientData as IClient, { transaction: t });

      // ── Step 2: Create login account ───────────────────────────
      await this.userService.createUser(
        {
          email: newClient.email,
          password: newClient.mobile,
          role: UserRole.CLIENT,
          client_id: newClient.client_id,
        },
        t,
      );

      // ── Step 3: Create address (if any field is filled) ────────
      const hasAddress = addrData && (
        addrData.primary_address || addrData.primary_state || addrData.primary_pincode
      );
      if (hasAddress) {
        await ClientAddress.create(
          { ...addrData, client_id: newClient.client_id } as IClientAddress,
          { transaction: t },
        );
      }

      // ── Step 4: Create membership ──────────────────────────────
      const tempMembershipNumber = uniqueTemp('T', 20);
      const newMembership = await Membership.create(
        {
          client_id: newClient.client_id,
          package_id: null,
          package_name: memData.package_name,
          membership_number: tempMembershipNumber,
          sale_date: memData.sale_date,
          start_date: memData.start_date,
          end_date,
          nights_remaining: totalNights,
          nights_per_year: nightsPerYear,
          validity_years: validityYears,
          total_price,
          discount_amount,
          net_price,
          payment_mode: memData.payment_mode,
          down_payment,
          outstanding_balance,
          dsa: memData.dsa ?? null,
          reference_by: memData.reference_by ?? null,
          remarks: memData.remarks ?? null,
          status: MembershipStatus.ACTIVE,
        } as any,
        { transaction: t },
      );

      const membership_number = `${membershipPrefix}-${newMembership.membership_id.toString().padStart(5, '0')}`;
      await newMembership.update({ membership_number }, { transaction: t });

      // ── Step 5: Create down payment (if > 0) ──────────────────
      if (down_payment > 0) {
        const tempPayNum = uniqueTemp('P', 20);
        const newPayment = await Payment.create(
          {
            payment_number: tempPayNum,
            membership_id: newMembership.membership_id,
            client_id: newClient.client_id,
            payment_type: PaymentType.DOWN_PAYMENT,
            amount: down_payment,
            payment_date: memData.sale_date,
            payment_mode: memData.payment_mode as unknown as PaymentMode,
            transaction_ref: memData.transaction_ref ?? null,
            bank_name: memData.bank_name ?? null,
            status: PaymentStatus.PAID,
            remarks: 'Down payment at onboarding',
          } as any,
          { transaction: t },
        );

        const payment_number = `PAY-${newPayment.payment_id.toString().padStart(6, '0')}`;
        await newPayment.update({ payment_number }, { transaction: t });
      }

      // ── All steps succeeded — commit ───────────────────────────
      await t.commit();

      return {
        client_id: newClient.client_id,
        membership_id: newMembership.membership_id,
        membership_number,
      };
    } catch (error) {
      await t.rollback();

      // Convert DB unique constraint violations into friendly AppErrors
      if (error instanceof UniqueConstraintError) {
        const field = error.errors?.[0]?.path ?? 'field';
        const label =
          field === 'email' ? 'email address' :
          field === 'mobile' ? 'mobile number' :
          field === 'membership_number' ? 'membership number' :
          field === 'payment_number' ? 'payment number' : field;
        throw new AppError(`A record with this ${label} already exists.`, 409);
      }

      throw error;
    }
  }
}
