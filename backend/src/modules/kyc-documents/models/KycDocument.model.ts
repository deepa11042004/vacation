import {
  Table, Column, Model, DataType,
  PrimaryKey, AutoIncrement, AllowNull,
  CreatedAt, UpdatedAt, DeletedAt,
  ForeignKey, BelongsTo,
} from 'sequelize-typescript';
import { Client } from '../../clients/models/Client.model';
import { resolveUrl } from '@/shared/utils/media-url.util';

export interface IKycDocument {
  kyc_document_id: number;
  client_id: number;
  title: string;
  file_name: string;
  file_path: string;
  created_at?: Date;
  updated_at?: Date;
  deleted_at?: Date | null;
}

@Table({ tableName: 'kyc_documents', modelName: 'KycDocument', timestamps: true, paranoid: true })
export class KycDocument extends Model<IKycDocument, Partial<IKycDocument>> implements IKycDocument {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  kyc_document_id!: number;

  @ForeignKey(() => Client)
  @AllowNull(false)
  @Column(DataType.INTEGER)
  client_id!: number;

  @AllowNull(false)
  @Column(DataType.STRING(255))
  title!: string;

  @AllowNull(false)
  @Column(DataType.STRING(255))
  file_name!: string;

  @AllowNull(false)
  @Column({
    type: DataType.STRING(500),
    get(this: KycDocument) {
      return resolveUrl(this.getDataValue('file_path' as never));
    },
  })
  file_path!: string;

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
}
