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
import { IItineraryImage } from '../interfaces/itinerary.interface';
import { Itinerary } from './Itinerary.model';
import { resolveUrl } from '@/shared/utils/media-url.util';

@Table({
  tableName: 'itinerary_images',
  modelName: 'ItineraryImage',
  timestamps: true,
})
export class ItineraryImage extends Model<IItineraryImage, Partial<IItineraryImage>> implements IItineraryImage {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  image_id!: number;

  @ForeignKey(() => Itinerary)
  @AllowNull(false)
  @Column(DataType.INTEGER)
  itinerary_id!: number;

  @BelongsTo(() => Itinerary, { foreignKey: 'itinerary_id', onDelete: 'CASCADE', onUpdate: 'CASCADE' })
  itinerary!: Itinerary;

  @AllowNull(false)
  @Column({
    type: DataType.TEXT,
    get(this: ItineraryImage) {
      const val = this.getDataValue('image_path' as never) as string | null | undefined;
      if (!val) return null;
      if (/^https?:\/\//i.test(val)) return val;
      if (val.startsWith('/')) return resolveUrl(val);
      return resolveUrl(`/uploads/itineraries/${val}`);
    },
  })
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
