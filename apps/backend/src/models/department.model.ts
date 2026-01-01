import {
  Table,
  Column,
  Model,
  DataType,
} from 'sequelize-typescript';

@Table({
  tableName: 'departments',
  timestamps: true,
  underscored: true,
})
export class Department extends Model<Department> {
  @Column({ type: DataType.UUID, primaryKey: true })
  id!: string;

  @Column({ type: DataType.STRING })
  code!: string;

  @Column({ type: DataType.STRING })
  name!: string;

  @Column({ type: DataType.STRING })
  full_name!: string;

  @Column({ type: DataType.TEXT })
  description!: string;

  @Column({ type: DataType.UUID })
  parent_id!: string;

  @Column({ type: DataType.INTEGER })
  level!: number;

  @Column({ type: DataType.STRING })
  path!: string;

  @Column({ type: DataType.STRING })
  contact_person!: string;

  @Column({ type: DataType.STRING })
  contact_phone!: string;

  @Column({ type: DataType.STRING })
  contact_email!: string;

  @Column({ type: DataType.STRING })
  location!: string;

  @Column({ type: DataType.STRING })
  status!: string;

  @Column({ type: DataType.INTEGER })
  display_order!: number;

  @Column({ type: DataType.UUID })
  created_by!: string;

  @Column({ type: DataType.UUID })
  updated_by!: string;
}
