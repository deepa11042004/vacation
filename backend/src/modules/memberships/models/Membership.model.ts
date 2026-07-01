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
  DeletedAt,
  AllowNull,
} from 'sequelize-typescript';
import { Client } from '../../clients/models/Client.model';
import { Package } from '../../packages/models/Package.model';
import { User } from '../../users/models/User.model';
import { IMembership } from '../interfaces/membership.interface';
import { MembershipDSA, MembershipStatus, PaymentMode } from '../types/membership.types';

@Table({
  tableName: 'memberships',
  timestamps: true,
  paranoid: true,
})
export class Membership extends Model<IMembership, Partial<IMembership>> implements IMembership {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  membership_id!: number;

  @Unique
  @AllowNull(false)
  @Column(DataType.STRING(20))
  membership_number!: string;

  @ForeignKey(() => Client)
  @AllowNull(false)
  @Column(DataType.INTEGER)
  client_id!: number;

  @BelongsTo(() => Client, { foreignKey: 'client_id', onDelete: 'RESTRICT', onUpdate: 'CASCADE' })
  client?: Client;

  @ForeignKey(() => Package)
  @AllowNull(false)
  @Column(DataType.INTEGER)
  package_id!: number;

  @BelongsTo(() => Package, { foreignKey: 'package_id', onDelete: 'RESTRICT', onUpdate: 'CASCADE' })
  package?: Package;

  @AllowNull(false)
  @Column(DataType.DATEONLY)
  sale_date!: Date;

  @AllowNull(false)
  @Column(DataType.DATEONLY)
  start_date!: Date;

  @AllowNull(false)
  @Column(DataType.DATEONLY)
  end_date!: Date;

  @AllowNull(false)
  @Column(DataType.INTEGER)
  nights_remaining!: number;

  @AllowNull(false)
  @Column(DataType.INTEGER)
  nights_per_year!: number;

  @AllowNull(false)
  @Column(DataType.DECIMAL(12, 2))
  total_price!: number;

  @Default(0)
  @AllowNull(false)
  @Column(DataType.DECIMAL(12, 2))
  discount_amount!: number;

  @AllowNull(false)
  @Column(DataType.DECIMAL(12, 2))
  net_price!: number;

  @AllowNull(false)
  @Column(DataType.ENUM(...Object.values(PaymentMode)))
  payment_mode!: PaymentMode;

  @Default(0)
  @AllowNull(false)
  @Column(DataType.DECIMAL(12, 2))
  down_payment!: number;

  @AllowNull(false)
  @Column(DataType.DECIMAL(12, 2))
  outstanding_balance!: number;

  @ForeignKey(() => User)
  @AllowNull(true)
  @Column(DataType.INTEGER)
  sales_consultant_id?: number | null;

  @BelongsTo(() => User, { foreignKey: 'sales_consultant_id', as: 'salesConsultant', onDelete: 'SET NULL', onUpdate: 'CASCADE' })
  salesConsultant?: User | null;

  @ForeignKey(() => User)
  @AllowNull(true)
  @Column(DataType.INTEGER)
  take_over_manager_id?: number | null;

  @BelongsTo(() => User, { foreignKey: 'take_over_manager_id', as: 'takeOverManager', onDelete: 'SET NULL', onUpdate: 'CASCADE' })
  takeOverManager?: User | null;

  @AllowNull(true)
  @Default(null)
  @Column(DataType.ENUM(...Object.values(MembershipDSA)))
  dsa?: MembershipDSA | null;

  @AllowNull(true)
  @Column(DataType.STRING(100))
  reference_by?: string | null;

  @Default(MembershipStatus.ACTIVE)
  @AllowNull(false)
  @Column(DataType.ENUM(...Object.values(MembershipStatus)))
  status!: MembershipStatus;

  @AllowNull(true)
  @Column(DataType.TEXT)
  cancellation_reason?: string | null;

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

  @DeletedAt
  @Column(DataType.DATE)
  deleted_at?: Date | null;
}
