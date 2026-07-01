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
  HasMany,
  CreatedAt,
  UpdatedAt,
  DeletedAt,
  AllowNull,
} from 'sequelize-typescript';
import { IHotel } from '../interfaces/hotel.interface';
import { PropertyType, HotelType, HotelStatus } from '../types/hotel.types';
import type { Location } from '../../locations/models/Location.model';
import type { HotelImage } from '@/modules/hotels/models/HotelImage.model';

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

  @Unique
  @Column(DataType.STRING(20))
  hotel_code!: string;

  @ForeignKey(() => (global as any).models.Location)
  @AllowNull(false)
  @Column(DataType.INTEGER)
  location_id!: number;

  @BelongsTo(() => (global as any).models.Location, { foreignKey: 'location_id', onDelete: 'RESTRICT', onUpdate: 'CASCADE' })
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

  @HasMany(() => (global as any).models.HotelImage, { foreignKey: 'hotel_id', onDelete: 'CASCADE', onUpdate: 'CASCADE' })
  images?: HotelImage[];
}

if (!(global as any).models) {
  (global as any).models = {};
}
(global as any).models.Hotel = Hotel;
