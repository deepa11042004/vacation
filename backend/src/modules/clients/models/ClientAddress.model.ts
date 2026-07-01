import {
  Table,
  Column,
  Model,
  DataType,
  PrimaryKey,
  AutoIncrement,
  ForeignKey,
  BelongsTo,
  CreatedAt,
  UpdatedAt,
  AllowNull,
} from 'sequelize-typescript';
import { IClientAddress } from '../interfaces/client-address.interface';
import type { Client } from './Client.model';

@Table({
  tableName: 'client_addresses',
  timestamps: true,
})
export class ClientAddress extends Model<IClientAddress, Partial<IClientAddress>> implements IClientAddress {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  address_id!: number;

  @ForeignKey(() => (global as any).models.Client)
  @AllowNull(false)
  @Column(DataType.STRING(20))
  client_code!: string;

  @BelongsTo(() => (global as any).models.Client, { targetKey: 'client_code' })
  client!: Client;

  @AllowNull(true)
  @Column(DataType.TEXT)
  primary_address?: string | null;

  @AllowNull(true)
  @Column(DataType.TEXT)
  secondary_address?: string | null;

  @AllowNull(true)
  @Column(DataType.STRING(100))
  primary_state?: string | null;

  @AllowNull(true)
  @Column(DataType.STRING(100))
  secondary_state?: string | null;

  @AllowNull(true)
  @Column(DataType.STRING(20))
  primary_pincode?: string | null;

  @AllowNull(true)
  @Column(DataType.STRING(20))
  secondary_pincode?: string | null;

  @CreatedAt
  @Column(DataType.DATE)
  created_at!: Date;

  @UpdatedAt
  @Column(DataType.DATE)
  updated_at!: Date;
}

if (!(global as any).models) {
  (global as any).models = {};
}
(global as any).models.ClientAddress = ClientAddress;
