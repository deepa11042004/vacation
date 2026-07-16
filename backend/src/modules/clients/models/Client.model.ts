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
  DeletedAt,
  AllowNull,
  HasOne,
  Unique,
} from 'sequelize-typescript';
import { IClient } from '../interfaces/client.interface';
import { ClientStatus, Gender } from '../types/client.types';
import type { ClientAddress } from './ClientAddress.model';

@Table({
  tableName: 'clients',
  modelName: 'Client',
  timestamps: true,
  paranoid: true,
})
export class Client extends Model<IClient, Partial<IClient>> implements IClient {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  client_id!: number;

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
  @Default('+91')
  @Column(DataType.STRING(10))
  country_code!: string;

  @AllowNull(true)
  @Column(DataType.STRING(255))
  profile_photo?: string | null;

  @Default(ClientStatus.ACTIVE)
  @AllowNull(false)
  @Column(DataType.ENUM(...Object.values(ClientStatus)))
  status!: ClientStatus;

  @Default(false)
  @AllowNull(false)
  @Column(DataType.BOOLEAN)
  is_welcome_mail_sent!: boolean;

  @AllowNull(true)
  @Column(DataType.DATEONLY)
  marriage_anniversary?: Date | null;

  @AllowNull(true)
  @Column(DataType.STRING(100))
  spouse_name?: string | null;

  @AllowNull(true)
  @Column(DataType.INTEGER)
  birthday_mail_sent_year?: number | null;

  @AllowNull(true)
  @Column(DataType.INTEGER)
  anniversary_mail_sent_year?: number | null;

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

  // eslint-disable-next-line @typescript-eslint/no-require-imports
  @HasOne(() => require('./ClientAddress.model').ClientAddress, { foreignKey: 'client_id' })
  address?: ClientAddress | null;
}
