import {
  Table, Column, Model, DataType,
  PrimaryKey, AutoIncrement, Default,
  AllowNull, Unique, CreatedAt, UpdatedAt, DeletedAt,
} from 'sequelize-typescript';

export enum StaffStatus {
  ACTIVE   = 'ACTIVE',
  INACTIVE = 'INACTIVE',
}

@Table({ tableName: 'staff', modelName: 'Staff', timestamps: true, paranoid: true })
export class Staff extends Model {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  staff_id!: number;

  @Unique
  @AllowNull(false)
  @Column(DataType.STRING(30))
  employee_id!: string;

  @AllowNull(false)
  @Column(DataType.STRING(255))
  full_name!: string;

  @Unique
  @AllowNull(false)
  @Column(DataType.STRING(255))
  email!: string;

  @AllowNull(false)
  @Column(DataType.STRING(20))
  phone!: string;

  @AllowNull(true)
  @Column(DataType.STRING(255))
  designation?: string | null;

  @AllowNull(true)
  @Column(DataType.STRING(255))
  department?: string | null;

  @AllowNull(true)
  @Column(DataType.DATEONLY)
  joining_date?: Date | null;

  @Default(StaffStatus.ACTIVE)
  @Column(DataType.ENUM(...Object.values(StaffStatus)))
  status!: StaffStatus;

  @CreatedAt
  @Column(DataType.DATE)
  created_at!: Date;

  @UpdatedAt
  @Column(DataType.DATE)
  updated_at!: Date;

  @DeletedAt
  @Column(DataType.DATE)
  deleted_at?: Date | null;
}
