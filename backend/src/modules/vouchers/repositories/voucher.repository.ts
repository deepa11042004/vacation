import { Op, QueryTypes, WhereOptions } from 'sequelize';
import { Voucher } from '../models/Voucher.model';
import { IVoucher, IGetAllVouchersQuery } from '../interfaces/voucher.interface';
import { VoucherStatus } from '../types/voucher.types';
import { sequelize } from '../../../shared/database/sequelize';

export class VoucherRepository {
  async create(data: Partial<IVoucher>): Promise<Voucher> {
    return Voucher.create(data as any);
  }

  async findByVoucherNumber(voucherNumber: string): Promise<Voucher | null> {
    return Voucher.findOne({
      where: { voucher_number: voucherNumber },
    });
  }

  async findById(voucherId: number): Promise<Voucher | null> {
    return Voucher.findByPk(voucherId);
  }

  async findAll(query: IGetAllVouchersQuery): Promise<{ rows: Voucher[]; count: number }> {
    const page = Math.max(1, query.page || 1);
    const limit = Math.min(100, Math.max(1, query.limit || 10));
    const offset = (page - 1) * limit;

    const where: WhereOptions = {};

    if (query.search) {
      const searchPattern = `%${query.search.trim()}%`;
      where[Op.or as any] = [
        { voucher_number: { [Op.like]: searchPattern } },
        { applicant: { [Op.like]: searchPattern } },
        { email: { [Op.like]: searchPattern } },
        { phone: { [Op.like]: searchPattern } },
      ];
    }

    if (query.voucher_type) {
      where.voucher_type = query.voucher_type;
    }

    if (query.status) {
      where.status = query.status;
    }

    if (query.from_date && query.to_date) {
      where.issue_date = {
        [Op.between]: [query.from_date, query.to_date],
      };
    } else if (query.from_date) {
      where.issue_date = {
        [Op.gte]: query.from_date,
      };
    } else if (query.to_date) {
      where.issue_date = {
        [Op.lte]: query.to_date,
      };
    }

    const { rows, count } = await Voucher.findAndCountAll({
      where,
      limit,
      offset,
      order: [['created_at', 'DESC']],
    });

    return { rows, count };
  }

  /**
   * Atomically updates a voucher to REDEEMED only if it is currently ACTIVE and not expired.
   * Returns the number of affected rows (1 if successful, 0 if already redeemed, expired, or invalid).
   */
  async atomicRedeem(voucherNumber: string): Promise<number> {
    const today = new Date().toISOString().slice(0, 10);
    const [, affectedCount] = await sequelize.query(
      `UPDATE vouchers 
       SET status = 'REDEEMED', 
           redeemed_at = NOW(), 
           updated_at = NOW() 
       WHERE voucher_number = :voucherNumber 
         AND status = 'ACTIVE' 
         AND expiry_date >= :today`,
      {
        replacements: {
          voucherNumber,
          today,
        },
        type: QueryTypes.UPDATE,
      }
    );

    return typeof affectedCount === 'number' ? affectedCount : 0;
  }

  async markExpiredVouchers(): Promise<number> {
    const today = new Date().toISOString().slice(0, 10);
    const [, affectedCount] = await sequelize.query(
      `UPDATE vouchers 
       SET status = 'EXPIRED', 
           updated_at = NOW() 
       WHERE status = 'ACTIVE' 
         AND expiry_date < :today`,
      {
        replacements: { today },
        type: QueryTypes.UPDATE,
      }
    );

    return typeof affectedCount === 'number' ? affectedCount : 0;
  }
}
