import {
  Table, Column, Model, DataType, PrimaryKey, AutoIncrement,
  Default, AllowNull, ForeignKey, BelongsTo, CreatedAt, UpdatedAt, DeletedAt,
} from 'sequelize-typescript';
import { Client } from '../../clients/models/Client.model';
import { IInvoice } from '../interfaces/invoice.interface';

@Table({ tableName: 'invoices', modelName: 'Invoice', timestamps: true, paranoid: true })
export class Invoice extends Model<IInvoice, Partial<IInvoice>> implements IInvoice {
  @PrimaryKey @AutoIncrement @Column(DataType.INTEGER)
  invoice_id!: number;

  @AllowNull(false) @Column(DataType.STRING(50))
  invoice_no!: string;

  @AllowNull(false) @Default('invoice') @Column(DataType.ENUM('invoice', 'tax'))
  invoice_type!: 'invoice' | 'tax';

  @ForeignKey(() => Client) @AllowNull(false) @Column(DataType.INTEGER)
  client_id!: number;

  @BelongsTo(() => Client, { foreignKey: 'client_id', onDelete: 'RESTRICT', onUpdate: 'CASCADE' })
  client?: Client;

  @AllowNull(false) @Column(DataType.STRING(200))
  client_name!: string;

  @AllowNull(false) @Default('') @Column(DataType.STRING(50))
  card_number!: string;

  @AllowNull(false) @Column(DataType.STRING(200))
  email!: string;

  @AllowNull(false) @Default('') @Column(DataType.STRING(50))
  phone!: string;

  @AllowNull(false) @Default('') @Column(DataType.TEXT)
  address!: string;

  @AllowNull(false) @Default('') @Column(DataType.STRING(100))
  state!: string;

  @AllowNull(true) @Default(null) @Column(DataType.STRING(50))
  client_gst!: string | null;

  @AllowNull(false) @Default('CASH') @Column(DataType.STRING(30))
  payment_mode!: string;

  @AllowNull(false) @Default('Cash') @Column(DataType.STRING(50))
  payment_type!: string;

  @AllowNull(false) @Default('') @Column(DataType.STRING(100))
  transaction_id!: string;

  @AllowNull(false) @Default('') @Column(DataType.STRING(100))
  bank!: string;

  @AllowNull(false) @Default('') @Column(DataType.STRING(100))
  card_cheque_no!: string;

  @AllowNull(false) @Column(DataType.DECIMAL(12, 2))
  amount!: string;

  @AllowNull(false) @Default('Holiday Package (Sheet Attached For Details)') @Column(DataType.TEXT)
  description!: string;

  @AllowNull(false) @Column(DataType.DATEONLY)
  issue_date!: string;

  @AllowNull(true) @Default(null) @Column(DataType.INTEGER)
  created_by!: number | null;

  @CreatedAt @Column(DataType.DATE) created_at!: Date;
  @UpdatedAt @Column(DataType.DATE) updated_at!: Date;
  @DeletedAt @Column(DataType.DATE) deleted_at!: Date | null;
}
