import {
  Table, Column, Model, DataType,
  PrimaryKey, AutoIncrement, AllowNull, Default,
  CreatedAt, UpdatedAt, DeletedAt,
  ForeignKey, BelongsTo,
} from 'sequelize-typescript';
import { IBooking, NightType, BookingStatus } from '../interfaces/booking.interface';
import { Client } from '../../clients/models/Client.model';
import { Membership } from '../../memberships/models/Membership.model';

@Table({ tableName: 'bookings', modelName: 'Booking', timestamps: true, paranoid: true })
export class Booking extends Model<IBooking, Partial<IBooking>> implements IBooking {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  booking_id!: number;

  @ForeignKey(() => Client)
  @AllowNull(false)
  @Column(DataType.INTEGER)
  client_id!: number;

  @ForeignKey(() => Membership)
  @AllowNull(false)
  @Column(DataType.INTEGER)
  membership_id!: number;

  @AllowNull(true)
  @Default(null)
  @Column(DataType.STRING(100))
  assist_by?: string | null;

  @AllowNull(true)
  @Default(null)
  @Column(DataType.STRING(20))
  contact_number?: string | null;

  @AllowNull(false)
  @Column(DataType.DATEONLY)
  check_in!: string;

  @AllowNull(false)
  @Column(DataType.DATEONLY)
  check_out!: string;

  @AllowNull(false)
  @Default(1)
  @Column(DataType.INTEGER)
  nights!: number;

  @AllowNull(false)
  @Default(1)
  @Column(DataType.INTEGER)
  no_of_rooms!: number;

  @AllowNull(false)
  @Default(1)
  @Column(DataType.INTEGER)
  no_of_adults!: number;

  @AllowNull(false)
  @Default(0)
  @Column(DataType.INTEGER)
  children!: number;

  @AllowNull(true)
  @Default(null)
  @Column(DataType.STRING(200))
  booking_type?: string | null;

  @AllowNull(false)
  @Column(DataType.STRING(200))
  hotel_name!: string;

  @AllowNull(true)
  @Default(null)
  @Column(DataType.TEXT)
  hotel_address?: string | null;

  @AllowNull(true)
  @Default(null)
  @Column(DataType.STRING(30))
  hotel_contact?: string | null;

  @AllowNull(true)
  @Default(null)
  @Column(DataType.STRING(100))
  confirmation_number?: string | null;

  @AllowNull(true)
  @Default(null)
  @Column(DataType.DECIMAL(12, 2))
  booking_amount?: number | null;

  @AllowNull(true)
  @Default(null)
  @Column(DataType.STRING(100))
  room_category?: string | null;

  @AllowNull(true)
  @Default(null)
  @Column(DataType.TEXT)
  remark?: string | null;

  @AllowNull(false)
  @Default(NightType.MEMBERSHIP)
  @Column(DataType.ENUM(...Object.values(NightType)))
  night_type!: NightType;

  @AllowNull(true)
  @Default(null)
  @Column(DataType.JSON)
  redeemed_offer_ids?: number[] | null;

  @AllowNull(false)
  @Default(0)
  @Column(DataType.DECIMAL(12, 2))
  amount_paid_by_client!: number;

  @AllowNull(true)
  @Default(null)
  @Column(DataType.TEXT)
  note?: string | null;

  @AllowNull(false)
  @Default(BookingStatus.CONFIRMED)
  @Column(DataType.ENUM(...Object.values(BookingStatus)))
  status!: BookingStatus;

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

  @BelongsTo(() => Membership)
  membership?: Membership;
}
