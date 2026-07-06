import {
  Table, Column, Model, DataType,
  PrimaryKey, AutoIncrement, AllowNull,
  CreatedAt, UpdatedAt, DeletedAt,
  ForeignKey, BelongsTo,
} from 'sequelize-typescript';
import { Client } from '../../clients/models/Client.model';

export interface ICallRecording {
  call_recording_id: number;
  client_id: number;
  note: string;
  file_name: string;
  file_path: string;
  created_at?: Date;
  updated_at?: Date;
  deleted_at?: Date | null;
}

@Table({ tableName: 'call_recordings', modelName: 'CallRecording', timestamps: true, paranoid: true })
export class CallRecording extends Model<ICallRecording, Partial<ICallRecording>> implements ICallRecording {
  @PrimaryKey
  @AutoIncrement
  @Column(DataType.INTEGER)
  call_recording_id!: number;

  @ForeignKey(() => Client)
  @AllowNull(false)
  @Column(DataType.INTEGER)
  client_id!: number;

  @AllowNull(false)
  @Column(DataType.STRING(500))
  note!: string;

  @AllowNull(false)
  @Column(DataType.STRING(255))
  file_name!: string;

  @AllowNull(false)
  @Column(DataType.STRING(500))
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
