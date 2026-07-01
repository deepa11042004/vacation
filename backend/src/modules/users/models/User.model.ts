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
  CreatedAt,
  UpdatedAt,
  DeletedAt,
  AllowNull,
} from 'sequelize-typescript';
import { Client } from '../../clients/models/Client.model';
import { IUser } from '../interfaces/user.interface';
import { UserRole, UserStatus } from '../types/user.types';

@Table({
  tableName: 'users',
  timestamps: true,
  paranoid: true,
})
export class User extends Model<IUser, Partial<IUser>> implements IUser {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  user_id!: number;

  @ForeignKey(() => Client)
  @AllowNull(true)
  @Column(DataType.INTEGER)
  client_id?: number | null;

  @BelongsTo(() => Client, { foreignKey: 'client_id', onDelete: 'SET NULL', onUpdate: 'CASCADE' })
  client?: Client | null;

  @Unique
  @AllowNull(false)
  @Column(DataType.STRING(100))
  email!: string;

  @AllowNull(false)
  @Column(DataType.STRING(255))
  password!: string;

  @Default(UserRole.AGENT)
  @AllowNull(false)
  @Column(DataType.ENUM(...Object.values(UserRole)))
  role!: UserRole;

  @Default(UserStatus.ACTIVE)
  @AllowNull(false)
  @Column(DataType.ENUM(...Object.values(UserStatus)))
  status!: UserStatus;

  @AllowNull(true)
  @Column(DataType.TEXT)
  refresh_token?: string | null;

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
}
