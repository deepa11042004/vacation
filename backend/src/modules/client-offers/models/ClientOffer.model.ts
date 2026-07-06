import {
  Table,
  Column,
  Model,
  DataType,
  PrimaryKey,
  AutoIncrement,
  AllowNull,
  Default,
  CreatedAt,
  UpdatedAt,
  DeletedAt,
  ForeignKey,
  BelongsTo,
} from 'sequelize-typescript';
import { IClientOffer } from '../interfaces/client-offer.interface';
import { Client } from '../../clients/models/Client.model';

@Table({
  tableName: 'client_offers',
  modelName: 'ClientOffer',
  timestamps: true,
  paranoid: true,
})
export class ClientOffer extends Model<IClientOffer, Partial<IClientOffer>> implements IClientOffer {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  offer_id!: number;

  @ForeignKey(() => Client)
  @AllowNull(false)
  @Column(DataType.INTEGER)
  client_id!: number;

  @AllowNull(false)
  @Column(DataType.STRING(255))
  offer_name!: string;

  @AllowNull(true)
  @Default(null)
  @Column(DataType.DATEONLY)
  valid_until?: string | null;

  @AllowNull(false)
  @Default(false)
  @Column(DataType.BOOLEAN)
  is_redeemed!: boolean;

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
}
