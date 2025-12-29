import { Table, Column, Model, DataType } from 'sequelize-typescript';

@Table({ tableName: 'departments', timestamps: true, underscored: true })
export class Department extends Model<Department> {
  @Column({ type: DataType.UUID, primaryKey: true })
  id!: string;

  @Column({ type: DataType.STRING })
  code!: string;

  @Column({ type: DataType.STRING })
  name!: string;
}
