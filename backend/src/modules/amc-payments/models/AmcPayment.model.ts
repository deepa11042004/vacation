import {
  Table, Column, Model, DataType,
  PrimaryKey, AutoIncrement, AllowNull, Default,
  CreatedAt, UpdatedAt, DeletedAt,
  ForeignKey, BelongsTo,
} from 'sequelize-typescript';
import { IAmcPayment } from '../interfaces/amc-payment.interface';
import { Client } from '../../clients/models/Client.model';
import { Membership } from '../../memberships/models/Membership.model';

@Table({ tableName: 'amc_payments', modelName: 'AmcPayment', timestamps: true, paranoid: true })
export class AmcPayment extends Model<IAmcPayment, Partial<IAmcPayment>> implements IAmcPayment {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  amc_payment_id!: number;

  @ForeignKey(() => Client)
  @AllowNull(false)
  @Column(DataType.INTEGER)
  client_id!: number;

  @ForeignKey(() => Membership)
  @AllowNull(false)
  @Column(DataType.INTEGER)
  membership_id!: number;

  @AllowNull(false)
  @Column(DataType.INTEGER)
  year_number!: number;

  @AllowNull(true)
  @Default(null)
  @Column(DataType.DECIMAL(12, 2))
  amount?: number | null;

  @AllowNull(false)
  @Default(false)
  @Column(DataType.BOOLEAN)
  is_received!: boolean;

  @AllowNull(true)
  @Default(null)
  @Column(DataType.DATEONLY)
  payment_date?: string | null;

  @AllowNull(true)
  @Default(null)
  @Column(DataType.STRING(100))
  payment_mode?: string | null;

  @CreatedAt
  @Column(DataType.DATE)
  created_at!: Date;

  @UpdatedAt
  @Column(DataType.DATE)
  updated_at!: Date;

  @DeletedAt
  @Column(DataType.DATE)
  deleted_at?: Date | null;

  @BelongsTo(() => Client)
  client?: Client;

  @BelongsTo(() => Membership)
  membership?: Membership;
}
