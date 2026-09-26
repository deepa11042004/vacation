import {
  Table, Column, Model, DataType,
  PrimaryKey, AutoIncrement, AllowNull, Default,
  CreatedAt, UpdatedAt,
} from 'sequelize-typescript';
import { IEnquiry, EnquiryStatus } from '../interfaces/enquiry.interface';

@Table({ tableName: 'enquiries', modelName: 'Enquiry', timestamps: true, paranoid: false })
export class Enquiry extends Model<IEnquiry, Partial<IEnquiry>> implements IEnquiry {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  id!: number;

  @AllowNull(false)
  @Column(DataType.STRING(100))
  name!: string;

  @AllowNull(false)
  @Column(DataType.STRING(20))
  mobile!: string;

  @AllowNull(true)
  @Column(DataType.STRING(100))
  city?: string | null;

  @AllowNull(true)
  @Column(DataType.STRING(20))
  age?: string | null;

  @AllowNull(false)
  @Column(DataType.STRING(150))
  email!: string;

  @AllowNull(true)
  @Column(DataType.STRING(150))
  hotel_name?: string | null;

  @AllowNull(true)
  @Column(DataType.TEXT)
  query?: string | null;

  @AllowNull(true)
  @Column(DataType.STRING(50))
  check_in?: string | null;

  @AllowNull(true)
  @Column(DataType.STRING(50))
  check_out?: string | null;

  @AllowNull(true)
  @Column(DataType.STRING(50))
  guests?: string | null;

  @AllowNull(false)
  @Default(EnquiryStatus.NEW)
  @Column(DataType.ENUM(...Object.values(EnquiryStatus)))
  status!: EnquiryStatus;

  @AllowNull(true)
  @Column(DataType.TEXT)
  notes?: string | null;

  @CreatedAt
  @Column(DataType.DATE)
  created_at!: Date;

  @UpdatedAt
  @Column(DataType.DATE)
  updated_at!: Date;
}
