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
  HasOne,
} from 'sequelize-typescript';
import { IClient } from '../interfaces/client.interface';
import { ClientStatus, DSAType, Gender } from '../types/client.types';
import type { ClientAddress } from './ClientAddress.model';

@Table({
  tableName: 'clients',
  timestamps: true,
  paranoid: true, // Enables soft deletes (deleted_at)
})
export class Client extends Model<IClient, Partial<IClient>> implements IClient {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  client_id!: number;

  @Unique
  @Column(DataType.STRING(20))
  client_code!: string;

  @AllowNull(true)
  @Column(DataType.STRING(10))
  title?: string | null;

  @AllowNull(false)
  @Column(DataType.STRING(50))
  first_name!: string;

  @AllowNull(true)
  @Column(DataType.STRING(50))
  middle_name?: string | null;

  @AllowNull(false)
  @Column(DataType.STRING(50))
  last_name!: string;

  @AllowNull(false)
  @Column(DataType.ENUM(...Object.values(Gender)))
  gender!: Gender;

  @AllowNull(true)
  @Column(DataType.DATEONLY)
  date_of_birth?: Date | null;

  @Unique
  @AllowNull(false)
  @Column(DataType.STRING(15))
  mobile!: string;

  @AllowNull(true)
  @Column(DataType.STRING(15))
  alternate_mobile?: string | null;

  @Unique
  @AllowNull(false)
  @Column(DataType.STRING(100))
  email!: string;

  @AllowNull(false)
  @Column(DataType.STRING(5))
  country_code!: string;

  @AllowNull(true)
  @Column(DataType.STRING(255))
  profile_photo?: string | null;

  @Default(ClientStatus.ACTIVE)
  @AllowNull(false)
  @Column(DataType.ENUM(...Object.values(ClientStatus)))
  status!: ClientStatus;

  @AllowNull(true)
  @Column(DataType.STRING(100))
  sales_consultant?: string | null;

  @AllowNull(true)
  @Column(DataType.STRING(100))
  take_over_manager?: string | null;

  @AllowNull(true)
  @Default(null)
  @Column(DataType.ENUM(...Object.values(DSAType)))
  dsa?: DSAType | null;

  @AllowNull(true)
  @Column(DataType.STRING(100))
  reference_by?: string | null;

  @AllowNull(true)
  @Column(DataType.DATEONLY)
  marriage_anniversary?: Date | null;

  @AllowNull(true)
  @Column(DataType.STRING(100))
  spouse_name?: string | null;

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

  @HasOne(() => (global as any).models.ClientAddress, { foreignKey: 'client_id' })
  address?: ClientAddress | null;
}

if (!(global as any).models) {
  (global as any).models = {};
}
(global as any).models.Client = Client;
