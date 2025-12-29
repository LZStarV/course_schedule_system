import { Table, Column, Model, DataType } from 'sequelize-typescript';

@Table({ tableName: 'enrollments', timestamps: true, underscored: true })
export class Enrollment extends Model<Enrollment> {
  @Column({ type: DataType.UUID, primaryKey: true })
  id!: string;

  @Column({ type: DataType.UUID })
  student_id!: string;

  @Column({ type: DataType.UUID })
  course_id!: string;

  @Column({ type: DataType.STRING })
  status!: string;
}
