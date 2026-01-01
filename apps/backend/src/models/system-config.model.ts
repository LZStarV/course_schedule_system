import {
  Table,
  Column,
  Model,
  DataType,
} from 'sequelize-typescript';

@Table({
  tableName: 'system_configs',
  timestamps: true,
  underscored: true,
})
export class SystemConfig extends Model<SystemConfig> {
  @Column({ type: DataType.UUID, primaryKey: true })
  id!: string;

  @Column({ type: DataType.STRING })
  config_key!: string;

  @Column({ type: DataType.STRING })
  module!: string;

  @Column({ type: DataType.STRING })
  category!: string;

  @Column({ type: DataType.JSONB })
  config_value!: any;

  @Column({ type: DataType.STRING })
  value_type!: string;

  @Column({ type: DataType.TEXT })
  description!: string;

  @Column({ type: DataType.INTEGER })
  version!: number;

  @Column({ type: DataType.STRING })
  scope!: string;

  @Column({ type: DataType.BOOLEAN })
  is_encrypted!: boolean;

  @Column({ type: DataType.BOOLEAN })
  is_public!: boolean;
}
