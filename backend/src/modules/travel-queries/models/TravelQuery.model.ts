import {
  Table, Column, Model, DataType,
  PrimaryKey, AutoIncrement, AllowNull, Default,
  CreatedAt, UpdatedAt,
} from 'sequelize-typescript';
import { ITravelQuery, TravelQueryType, TravelQueryStatus } from '../interfaces/travel-query.interface';

@Table({ tableName: 'travel_queries', modelName: 'TravelQuery', timestamps: true, paranoid: false })
export class TravelQuery extends Model<ITravelQuery, Partial<ITravelQuery>> implements ITravelQuery {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  query_id!: number;

  @AllowNull(false)
  @Column(DataType.ENUM(...Object.values(TravelQueryType)))
  query_type!: TravelQueryType;

  @AllowNull(false)
  @Default(TravelQueryStatus.NEW)
  @Column(DataType.ENUM(...Object.values(TravelQueryStatus)))
  status!: TravelQueryStatus;

  @AllowNull(false)
  @Column(DataType.STRING(50))
  card_number!: string;

  @AllowNull(true)
  @Default(null)
  @Column(DataType.INTEGER)
  client_id?: number | null;

  @AllowNull(true)
  @Default(null)
  @Column(DataType.JSON)
  details?: Record<string, unknown> | null;

  @AllowNull(true)
  @Default(null)
  @Column(DataType.TEXT)
  admin_notes?: string | null;

  @CreatedAt
  @Column(DataType.DATE)
  created_at!: Date;

  @UpdatedAt
  @Column(DataType.DATE)
  updated_at!: Date;
}
