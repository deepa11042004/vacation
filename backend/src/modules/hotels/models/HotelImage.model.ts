import {
  Table,
  Column,
  Model,
  DataType,
  PrimaryKey,
  AutoIncrement,
  ForeignKey,
  BelongsTo,
  Default,
  CreatedAt,
  UpdatedAt,
  AllowNull,
} from 'sequelize-typescript';
import { IHotelImage } from '../interfaces/hotel.interface';
import { Hotel } from './Hotel.model';

@Table({
  tableName: 'hotel_images',
  timestamps: true,
})
export class HotelImage extends Model<IHotelImage, Partial<IHotelImage>> implements IHotelImage {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  image_id!: number;

  @ForeignKey(() => Hotel)
  @AllowNull(false)
  @Column(DataType.INTEGER)
  hotel_id!: number;

  @BelongsTo(() => Hotel, { foreignKey: 'hotel_id', onDelete: 'CASCADE', onUpdate: 'CASCADE' })
  hotel!: Hotel;

  @AllowNull(false)
  @Column(DataType.TEXT)
  image_path!: string;

  @Default(0)
  @AllowNull(false)
  @Column(DataType.INTEGER)
  sort_order!: number;

  @CreatedAt
  @Column(DataType.DATE)
  created_at!: Date;

  @UpdatedAt
  @Column(DataType.DATE)
  updated_at!: Date;
}
