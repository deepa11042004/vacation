import {
  Table,
  Column,
  Model,
  DataType,
  PrimaryKey,
  AutoIncrement,
  Default,
  Unique,
  ForeignKey,
  BelongsTo,
  CreatedAt,
  UpdatedAt,
  AllowNull,
} from 'sequelize-typescript';
import { Client } from '../../clients/models/Client.model';
import { Membership } from '../../memberships/models/Membership.model';
import { IPayment } from '../interfaces/payment.interface';
import { PaymentMode, PaymentStatus, PaymentType } from '../types/payment.types';

@Table({
  tableName: 'payments',
  timestamps: true,
  paranoid: false, // payments are never soft-deleted; cancelled via status
})
export class Payment extends Model<IPayment, Partial<IPayment>> implements IPayment {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  payment_id!: number;

  @Unique
  @AllowNull(false)
  @Column(DataType.STRING(20))
  payment_number!: string;

  @ForeignKey(() => Membership)
  @AllowNull(false)
  @Column(DataType.INTEGER)
  membership_id!: number;

  @BelongsTo(() => Membership, { foreignKey: 'membership_id', onDelete: 'RESTRICT', onUpdate: 'CASCADE' })
  membership?: Membership;

  @ForeignKey(() => Client)
  @AllowNull(false)
  @Column(DataType.INTEGER)
  client_id!: number;

  @BelongsTo(() => Client, { foreignKey: 'client_id', onDelete: 'RESTRICT', onUpdate: 'CASCADE' })
  client?: Client;

  @AllowNull(false)
  @Column(DataType.ENUM(...Object.values(PaymentType)))
  payment_type!: PaymentType;

  @AllowNull(false)
  @Column(DataType.DECIMAL(12, 2))
  amount!: number;

  @AllowNull(false)
  @Column(DataType.DATEONLY)
  payment_date!: Date;

  @AllowNull(true)
  @Column(DataType.DATEONLY)
  due_date?: Date | null;

  @AllowNull(false)
  @Column(DataType.ENUM(...Object.values(PaymentMode)))
  payment_mode!: PaymentMode;

  @AllowNull(true)
  @Column(DataType.STRING(100))
  transaction_ref?: string | null;

  @AllowNull(true)
  @Column(DataType.STRING(100))
  bank_name?: string | null;

  @Default(PaymentStatus.PAID)
  @AllowNull(false)
  @Column(DataType.ENUM(...Object.values(PaymentStatus)))
  status!: PaymentStatus;

  @AllowNull(true)
  @Column(DataType.TEXT)
  remarks?: string | null;

  @AllowNull(true)
  @Column(DataType.INTEGER)
  created_by?: number | null;

  @AllowNull(true)
  @Column(DataType.INTEGER)
  updated_by?: number | null;

  @CreatedAt
  @Column(DataType.DATE)
  created_at!: Date;

  @UpdatedAt
  @Column(DataType.DATE)
  updated_at!: Date;
}
