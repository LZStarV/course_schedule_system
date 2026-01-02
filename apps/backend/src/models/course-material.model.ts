import {
  Table,
  Column,
  Model,
  DataType,
} from 'sequelize-typescript';

@Table({
  tableName: 'course_materials',
  timestamps: false,
  underscored: true,
})
export class CourseMaterial extends Model<CourseMaterial> {
  @Column({ type: DataType.UUID, primaryKey: true })
  id!: string;

  @Column({ type: DataType.UUID })
  course_id!: string;

  @Column({ type: DataType.STRING })
  file_name!: string;

  @Column({ type: DataType.TEXT })
  file_url!: string;

  @Column({ type: DataType.STRING })
  file_type!: string;

  @Column({ type: DataType.INTEGER })
  file_size!: number;

  @Column({ type: DataType.STRING })
  category?: string;

  @Column({ type: DataType.TEXT })
  description?: string;

  @Column({ type: DataType.STRING })
  permissions?: string;

  @Column({ type: DataType.UUID })
  uploaded_by?: string;

  @Column({ type: DataType.DATE })
  created_at?: Date;

  @Column({ type: DataType.DATE })
  updated_at?: Date;
}
