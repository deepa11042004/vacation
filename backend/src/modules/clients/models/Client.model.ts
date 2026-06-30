import {
  Table,
  Column,
  Model,
  DataType,
  PrimaryKey,
  IsUUID,
  Default,
  Unique,
  CreatedAt,
  UpdatedAt,
  DeletedAt,
  AllowNull,
} from 'sequelize-typescript';
import { IClient } from '../interfaces/client.interface';
import { ClientStatus, Gender } from '../types/client.types';

@Table({
  tableName: 'clients',
  timestamps: true,
  paranoid: true, // Enables soft deletes (deleted_at)
})
export class Client extends Model<IClient, Partial<IClient>> implements IClient {
  @IsUUID(4)
  @PrimaryKey
  @Default(DataType.UUIDV4)
  @Column(DataType.UUID)
  client_id!: string;

  @Unique
  @Column(DataType.STRING(20))
  client_code!: string;

  @AllowNull(false)
  @Column(DataType.STRING(50))
  first_name!: string;

  @AllowNull(true)
  @Column(DataType.STRING(50))
  middle_name?: string;

  @AllowNull(false)
  @Column(DataType.STRING(50))
  last_name!: string;

  @AllowNull(false)
  @Column(DataType.ENUM(...Object.values(Gender)))
  gender!: Gender;

  @AllowNull(true)
  @Column(DataType.DATEONLY)
  date_of_birth?: Date;

  @Unique
  @AllowNull(false)
  @Column(DataType.STRING(15))
  mobile!: string;

  @AllowNull(true)
  @Column(DataType.STRING(15))
  alternate_mobile?: string;

  @Unique
  @AllowNull(false)
  @Column(DataType.STRING(100))
  email!: string;

  @AllowNull(true)
  @Column(DataType.STRING(255))
  password?: string;

  @AllowNull(false)
  @Column(DataType.STRING(5))
  country_code!: string;

  @AllowNull(true)
  @Column(DataType.STRING(255))
  profile_photo?: string;

  @Default(ClientStatus.ACTIVE)
  @AllowNull(false)
  @Column(DataType.ENUM(...Object.values(ClientStatus)))
  status!: ClientStatus;

  @Default(false)
  @AllowNull(false)
  @Column(DataType.BOOLEAN)
  email_verified!: boolean;

  @Default(false)
  @AllowNull(false)
  @Column(DataType.BOOLEAN)
  mobile_verified!: boolean;

  @AllowNull(true)
  @Column(DataType.UUID)
  created_by?: string;

  @AllowNull(true)
  @Column(DataType.UUID)
  updated_by?: string;

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
