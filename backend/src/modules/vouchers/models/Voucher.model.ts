import {
  Table,
  Column,
  Model,
  DataType,
  PrimaryKey,
  AutoIncrement,
  Default,
  CreatedAt,
  UpdatedAt,
  AllowNull,
  Unique,
  Index,
} from 'sequelize-typescript';
import { IVoucher } from '../interfaces/voucher.interface';
import { VoucherType, VoucherStatus } from '../types/voucher.types';

@Table({
  tableName: 'vouchers',
  modelName: 'Voucher',
  timestamps: true,
})
export class Voucher extends Model<IVoucher, Partial<IVoucher>> implements IVoucher {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  voucher_id!: number;

  @Unique
  @Index('idx_vouchers_voucher_number')
  @AllowNull(false)
  @Column(DataType.STRING(50))
  voucher_number!: string;

  @Default(VoucherType.NON_MEMBER)
  @AllowNull(false)
  @Column(DataType.ENUM(...Object.values(VoucherType)))
  voucher_type!: VoucherType;

  @AllowNull(false)
  @Column(DataType.STRING(100))
  applicant!: string;

  @AllowNull(true)
  @Column(DataType.STRING(100))
  spouse?: string | null;

  @Index('idx_vouchers_email')
  @AllowNull(false)
  @Column(DataType.STRING(150))
  email!: string;

  @Index('idx_vouchers_phone')
  @AllowNull(false)
  @Column(DataType.STRING(20))
  phone!: string;

  @AllowNull(false)
  @Column(DataType.JSON)
  locations!: string[];

  @AllowNull(false)
  @Column(DataType.STRING(150))
  benefit!: string;

  @AllowNull(false)
  @Column(DataType.DATEONLY)
  issue_date!: Date | string;

  @Default('1 Year')
  @AllowNull(false)
  @Column(DataType.STRING(50))
  validity!: string;

  @Index('idx_vouchers_expiry_date')
  @AllowNull(false)
  @Column(DataType.DATEONLY)
  expiry_date!: Date | string;

  @Index('idx_vouchers_status')
  @Default(VoucherStatus.ACTIVE)
  @AllowNull(false)
  @Column(DataType.ENUM(...Object.values(VoucherStatus)))
  status!: VoucherStatus;

  @AllowNull(false)
  @Column(DataType.TEXT)
  terms_and_conditions!: string;

  @AllowNull(true)
  @Column(DataType.DATE)
  redeemed_at?: Date | null;

  @AllowNull(true)
  @Column(DataType.INTEGER)
  created_by?: number | null;

  @CreatedAt
  @Column(DataType.DATE)
  created_at!: Date;

  @UpdatedAt
  @Column(DataType.DATE)
  updated_at!: Date;
}
