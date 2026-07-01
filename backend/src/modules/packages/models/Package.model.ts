import {
  Table,
  Column,
  Model,
  DataType,
  PrimaryKey,
  AutoIncrement,
  Default,
  Unique,
  CreatedAt,
  UpdatedAt,
  DeletedAt,
  AllowNull,
} from 'sequelize-typescript';
import { IPackage } from '../interfaces/package.interface';
import { PackageCategory, PackageStatus, UnitType } from '../types/package.types';

@Table({
  tableName: 'packages',
  timestamps: true,
  paranoid: true,
})
export class Package extends Model<IPackage, Partial<IPackage>> implements IPackage {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  package_id!: number;

  @Unique
  @AllowNull(false)
  @Column(DataType.STRING(20))
  package_code!: string;

  @AllowNull(false)
  @Column(DataType.STRING(150))
  name!: string;

  @AllowNull(false)
  @Column(DataType.ENUM(...Object.values(PackageCategory)))
  category!: PackageCategory;

  @AllowNull(false)
  @Column(DataType.INTEGER)
  validity_years!: number;

  @AllowNull(false)
  @Column(DataType.INTEGER)
  total_nights!: number;

  @AllowNull(false)
  @Column(DataType.INTEGER)
  nights_per_year!: number;

  @AllowNull(false)
  @Column(DataType.ENUM(...Object.values(UnitType)))
  unit_type!: UnitType;

  @Default(2)
  @AllowNull(false)
  @Column(DataType.INTEGER)
  max_adults!: number;

  @Default(1)
  @AllowNull(false)
  @Column(DataType.INTEGER)
  max_children!: number;

  @AllowNull(false)
  @Column(DataType.DECIMAL(12, 2))
  base_price!: number;

  @AllowNull(false)
  @Column(DataType.DECIMAL(10, 2))
  amc_amount!: number;

  @AllowNull(true)
  @Column(DataType.TEXT)
  description?: string | null;

  @Default(PackageStatus.ACTIVE)
  @AllowNull(false)
  @Column(DataType.ENUM(...Object.values(PackageStatus)))
  status!: PackageStatus;

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
