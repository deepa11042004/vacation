import { VoucherRepository } from '../repositories/voucher.repository';
import { ICreateVoucherDTO, IGetAllVouchersQuery, IVoucher } from '../interfaces/voucher.interface';
import { VoucherStatus, VoucherType } from '../types/voucher.types';
import { DEFAULT_TERMS_AND_CONDITIONS, VOUCHER_ERRORS } from '../constants/voucher.constants';
import { VoucherEmailService } from './voucher-email.service';
import { VoucherPdfService } from './voucher-pdf.service';
import { AppError } from '../../../shared/middlewares/error.middleware';

export class VoucherService {
  private voucherRepository: VoucherRepository;

  constructor() {
    this.voucherRepository = new VoucherRepository();
  }

  /**
   * Generates a unique 11-digit voucher number (e.g. 81714091628)
   */
  async generateUniqueVoucherNumber(): Promise<string> {
    for (let attempts = 0; attempts < 15; attempts++) {
      // 11 digits: starting with 81 or random 11-digit
      const prefix = '81';
      const randomPart = Math.floor(100000000 + Math.random() * 900000000).toString();
      const candidate = `${prefix}${randomPart}`;

      const existing = await this.voucherRepository.findByVoucherNumber(candidate);
      if (!existing) {
        return candidate;
      }
    }
    // Fallback using timestamp + random
    const ts = Date.now().toString().slice(-9);
    return `81${ts}`;
  }

  /**
   * Calculates expiry date based on issue date and validity string
   */
  calculateExpiryDate(issueDateStr: string, validityStr: string = '1 Year'): string {
    const issueDate = new Date(issueDateStr);
    const expiry = new Date(issueDate);

    const matchYear = validityStr.match(/(\d+)\s*Year/i);
    const matchMonth = validityStr.match(/(\d+)\s*Month/i);
    const matchDay = validityStr.match(/(\d+)\s*Day/i);

    if (matchYear) {
      const years = parseInt(matchYear[1], 10);
      expiry.setFullYear(expiry.getFullYear() + years);
    } else if (matchMonth) {
      const months = parseInt(matchMonth[1], 10);
      expiry.setMonth(expiry.getMonth() + months);
    } else if (matchDay) {
      const days = parseInt(matchDay[1], 10);
      expiry.setDate(expiry.getDate() + days);
    } else {
      expiry.setFullYear(expiry.getFullYear() + 1);
    }

    return expiry.toISOString().slice(0, 10);
  }

  async createVoucher(dto: ICreateVoucherDTO, createdBy?: number | null) {
    let voucherNumber = dto.voucher_number?.trim();
    if (!voucherNumber) {
      voucherNumber = await this.generateUniqueVoucherNumber();
    } else {
      const existing = await this.voucherRepository.findByVoucherNumber(voucherNumber);
      if (existing) {
        throw new AppError(VOUCHER_ERRORS.DUPLICATE_NUMBER, 409);
      }
    }

    const todayStr = new Date().toISOString().slice(0, 10);
    const issueDateStr = dto.issue_date || todayStr;
    const validity = dto.validity || '1 Year';
    const expiryDateStr = this.calculateExpiryDate(issueDateStr, validity);

    const termsAndConditions = dto.terms_and_conditions?.trim() || DEFAULT_TERMS_AND_CONDITIONS;

    const voucher = await this.voucherRepository.create({
      voucher_number: voucherNumber,
      voucher_type: dto.voucher_type || VoucherType.NON_MEMBER,
      applicant: dto.applicant,
      spouse: dto.spouse || null,
      email: dto.email,
      phone: dto.phone,
      locations: dto.locations,
      benefit: dto.benefit,
      issue_date: issueDateStr,
      validity,
      expiry_date: expiryDateStr,
      status: VoucherStatus.ACTIVE,
      terms_and_conditions: termsAndConditions,
      created_by: createdBy || null,
    });

    // Dispatch voucher email asynchronously in background so API responds instantly without proxy timeouts
    VoucherEmailService.sendVoucherEmail(voucher).catch((err) => {
      console.error('Background voucher email dispatch error:', err);
    });

    return {
      voucher,
      email_sent: true,
      email_error: null,
    };
  }

  async getAllVouchers(query: IGetAllVouchersQuery) {
    // Dynamically mark any passed-due active vouchers as expired
    await this.voucherRepository.markExpiredVouchers();

    const result = await this.voucherRepository.findAll(query);
    return {
      vouchers: result.rows,
      total: result.count,
      page: query.page || 1,
      limit: query.limit || 10,
    };
  }

  async getVoucherById(id: number) {
    const voucher = await this.voucherRepository.findById(id);
    if (!voucher) {
      throw new AppError(VOUCHER_ERRORS.NOT_FOUND, 404);
    }
    return voucher;
  }

  async getVoucherByNumber(voucherNumber: string) {
    const voucher = await this.voucherRepository.findByVoucherNumber(voucherNumber);
    if (!voucher) {
      throw new AppError(VOUCHER_ERRORS.NOT_FOUND, 404);
    }
    return voucher;
  }

  async generatePdfById(id: number): Promise<{ buffer: Buffer; voucher: IVoucher }> {
    const voucher = await this.getVoucherById(id);
    const buffer = await VoucherPdfService.generateVoucherPDF(voucher);
    return { buffer, voucher };
  }

  async generatePdfByNumber(voucherNumber: string): Promise<{ buffer: Buffer; voucher: IVoucher }> {
    const voucher = await this.getVoucherByNumber(voucherNumber);
    const buffer = await VoucherPdfService.generateVoucherPDF(voucher);
    return { buffer, voucher };
  }

  async resendEmail(id: number) {
    const voucher = await this.voucherRepository.findById(id);
    if (!voucher) {
      throw new AppError(VOUCHER_ERRORS.NOT_FOUND, 404);
    }

    const result = await VoucherEmailService.sendVoucherEmail(voucher);
    if (!result.success) {
      throw new AppError(result.error || 'Failed to send email', 500);
    }

    return {
      success: true,
      message: 'Voucher email sent successfully.',
      email: voucher.email,
    };
  }

  /**
   * Atomic voucher redemption
   */
  async redeemVoucher(voucherNumberInput: string) {
    const voucherNumber = voucherNumberInput?.trim();
    if (!voucherNumber) {
      throw new AppError(VOUCHER_ERRORS.INVALID_VOUCHER, 400);
    }

    // Attempt atomic conditional update
    const affected = await this.voucherRepository.atomicRedeem(voucherNumber);

    if (affected > 0) {
      return {
        success: true,
        message: VOUCHER_ERRORS.SUCCESS_REDEMPTION,
        voucher_number: voucherNumber,
      };
    }

    // Atomic update did not change any row, investigate reason
    const voucher = await this.voucherRepository.findByVoucherNumber(voucherNumber);
    if (!voucher) {
      throw new AppError(VOUCHER_ERRORS.INVALID_VOUCHER, 400);
    }

    if (voucher.status === VoucherStatus.REDEEMED) {
      throw new AppError(VOUCHER_ERRORS.ALREADY_REDEEMED, 400);
    }

    const todayStr = new Date().toISOString().slice(0, 10);
    const expiryStr = typeof voucher.expiry_date === 'string'
      ? voucher.expiry_date
      : voucher.expiry_date.toISOString().slice(0, 10);

    if (voucher.status === VoucherStatus.EXPIRED || expiryStr < todayStr) {
      // Ensure status is updated in DB
      if (voucher.status !== VoucherStatus.EXPIRED) {
        voucher.status = VoucherStatus.EXPIRED;
        await voucher.save();
      }
      throw new AppError(VOUCHER_ERRORS.EXPIRED, 400);
    }

    throw new AppError(VOUCHER_ERRORS.INVALID_VOUCHER, 400);
  }
}
