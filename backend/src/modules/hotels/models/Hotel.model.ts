import {
  Table,
  Column,
  Model,
  DataType,
  PrimaryKey,
  AutoIncrement,
  Default,
  ForeignKey,
  BelongsTo,
  HasMany,
  CreatedAt,
  UpdatedAt,
  DeletedAt,
  AllowNull,
} from 'sequelize-typescript';
import { IHotel } from '../interfaces/hotel.interface';
import { PropertyType, HotelType, HotelStatus } from '../types/hotel.types';
import type { Location } from '../../locations/models/Location.model';
import type { HotelImage } from './HotelImage.model';

@Table({
  tableName: 'hotels',
  timestamps: true,
  paranoid: true,
})
export class Hotel extends Model<IHotel, Partial<IHotel>> implements IHotel {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  hotel_id!: number;

  // eslint-disable-next-line @typescript-eslint/no-require-imports
  @ForeignKey(() => require('../../locations/models/Location.model').Location)
  @AllowNull(false)
  @Column(DataType.INTEGER)
  location_id!: number;

  // eslint-disable-next-line @typescript-eslint/no-require-imports
  @BelongsTo(() => require('../../locations/models/Location.model').Location, { foreignKey: 'location_id', onDelete: 'RESTRICT', onUpdate: 'CASCADE' })
  location!: Location;

  @AllowNull(false)
  @Column(DataType.STRING(100))
  hotel_name!: string;

  @AllowNull(false)
  @Column(DataType.ENUM(...Object.values(PropertyType)))
  property_type!: PropertyType;

  @AllowNull(false)
  @Column(DataType.ENUM(...Object.values(HotelType)))
  hotel_type!: HotelType;

  @AllowNull(true)
  @Column(DataType.TEXT)
  address?: string | null;

  @AllowNull(true)
  @Column(DataType.TEXT)
  map_link?: string | null;

  @AllowNull(true)
  @Column(DataType.TEXT)
  description?: string | null;

  @Default(HotelStatus.ACTIVE)
  @AllowNull(false)
  @Column(DataType.ENUM(...Object.values(HotelStatus)))
  status!: HotelStatus;

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

  // eslint-disable-next-line @typescript-eslint/no-require-imports
  @HasMany(() => require('./HotelImage.model').HotelImage, { foreignKey: 'hotel_id', onDelete: 'CASCADE', onUpdate: 'CASCADE' })
  images?: HotelImage[];
}
