import {
  Table,
  Column,
  Model,
  DataType,
  PrimaryKey,
  AutoIncrement,
  Default,
  Unique,
  HasMany,
  CreatedAt,
  UpdatedAt,
  DeletedAt,
  AllowNull,
} from 'sequelize-typescript';
import { IItinerary } from '../interfaces/itinerary.interface';
import { ItineraryType, ItineraryStatus, ItineraryScheduleItem } from '../types/itinerary.types';
import type { ItineraryImage } from './ItineraryImage.model';
import { resolveUrl } from '@/shared/utils/media-url.util';

@Table({
  tableName: 'itineraries',
  modelName: 'Itinerary',
  timestamps: true,
  paranoid: true,
})
export class Itinerary extends Model<IItinerary, Partial<IItinerary>> implements IItinerary {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  itinerary_id!: number;

  @Unique
  @AllowNull(false)
  @Column(DataType.STRING(150))
  slug!: string;

  @AllowNull(false)
  @Column(DataType.STRING(255))
  name!: string;

  @AllowNull(false)
  @Column(DataType.STRING(255))
  destination!: string;

  @AllowNull(false)
  @Column(DataType.ENUM(...Object.values(ItineraryType)))
  type!: ItineraryType;

  @AllowNull(true)
  @Column(DataType.STRING(100))
  category?: string | null;

  @AllowNull(true)
  @Column(DataType.STRING(100))
  badge?: string | null;

  @AllowNull(true)
  @Column(DataType.STRING(50))
  duration?: string | null;

  @Default(1)
  @AllowNull(false)
  @Column(DataType.INTEGER)
  days!: number;

  @Default(0)
  @AllowNull(false)
  @Column(DataType.INTEGER)
  nights!: number;

  @AllowNull(true)
  @Column(DataType.STRING(150))
  best_time?: string | null;

  @AllowNull(true)
  @Column({
    type: DataType.TEXT,
    get(this: Itinerary) {
      const val = this.getDataValue('image' as never) as string | null | undefined;
      if (!val) return null;
      if (/^https?:\/\//i.test(val)) return val;
      if (val.startsWith('/')) return resolveUrl(val);
      return resolveUrl(`/uploads/itineraries/${val}`);
    },
  })
  image?: string | null;

  @AllowNull(true)
  @Column(DataType.TEXT)
  short_desc?: string | null;

  @AllowNull(true)
  @Column(DataType.JSON)
  highlights?: string[] | null;

  @AllowNull(true)
  @Column(DataType.JSON)
  inclusions?: string[] | null;

  @AllowNull(true)
  @Column(DataType.JSON)
  schedule?: ItineraryScheduleItem[] | null;

  @Default(ItineraryStatus.ACTIVE)
  @AllowNull(false)
  @Column(DataType.ENUM(...Object.values(ItineraryStatus)))
  status!: ItineraryStatus;

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
  @HasMany(() => require('./ItineraryImage.model').ItineraryImage, { foreignKey: 'itinerary_id', onDelete: 'CASCADE', onUpdate: 'CASCADE' })
  gallery?: ItineraryImage[];
}
