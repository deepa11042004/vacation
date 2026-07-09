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
import { ILocation } from '../interfaces/location.interface';
import { LocationType, LocationStatus } from '../types/location.types';
import type { Hotel } from '../../hotels/models/Hotel.model';

@Table({
  tableName: 'locations',
  modelName: 'Location',
  timestamps: true,
  paranoid: true,
})
export class Location extends Model<ILocation, Partial<ILocation>> implements ILocation {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  location_id!: number;

  @Unique
  @AllowNull(false)
  @Column(DataType.STRING(20))
  location_code!: string;

  @Unique
  @AllowNull(false)
  @Column(DataType.STRING(100))
  location_name!: string;

  @AllowNull(false)
  @Column(DataType.STRING(100))
  country!: string;

  @AllowNull(false)
  @Column(DataType.ENUM(...Object.values(LocationType)))
  type!: LocationType;

  @AllowNull(true)
  @Column(DataType.TEXT)
  map_link?: string | null;

  @AllowNull(true)
  @Column(DataType.TEXT)
  location_image?: string | null;

  @AllowNull(true)
  @Column(DataType.TEXT)
  description?: string | null;

  @AllowNull(true)
  @Column(DataType.JSON)
  famous_sightseens?: string[] | null;

  @Default(false)
  @AllowNull(false)
  @Column(DataType.BOOLEAN)
  is_online!: boolean;

  @Default(LocationStatus.ACTIVE)
  @AllowNull(false)
  @Column(DataType.ENUM(...Object.values(LocationStatus)))
  status!: LocationStatus;

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
  @HasMany(() => require('../../hotels/models/Hotel.model').Hotel, { foreignKey: 'location_id', onDelete: 'RESTRICT', onUpdate: 'CASCADE' })
  hotels?: Hotel[];
}
