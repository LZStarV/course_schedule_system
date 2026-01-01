import {
  Table,
  Column,
  Model,
  DataType,
} from 'sequelize-typescript';

@Table({
  tableName: 'enrollments',
  timestamps: true,
  underscored: true,
})
export class Enrollment extends Model<Enrollment> {
  @Column({ type: DataType.UUID, primaryKey: true })
  id!: string;

  @Column({ type: DataType.UUID })
  student_id!: string;

  @Column({ type: DataType.UUID })
  course_id!: string;

  @Column({ type: DataType.UUID })
  section_id!: string;

  @Column({ type: DataType.STRING })
  academic_year!: string;

  @Column({ type: DataType.STRING })
  semester!: string;

  @Column({ type: DataType.STRING })
  status!: string;

  @Column({ type: DataType.INTEGER })
  selection_round!: number;

  @Column({ type: DataType.STRING })
  selection_method!: string;

  @Column({ type: DataType.DATE })
  enrolled_at!: Date;

  @Column({ type: DataType.DATE })
  confirmed_at!: Date;

  @Column({ type: DataType.DATE })
  withdrawn_at!: Date;

  @Column({ type: DataType.DATE })
  completed_at!: Date;

  @Column({ type: DataType.STRING })
  grade!: string;

  @Column({ type: DataType.DECIMAL })
  score!: number;

  @Column({ type: DataType.DECIMAL })
  gpa_points!: number;

  @Column({ type: DataType.TEXT })
  teacher_comment!: string;

  @Column({ type: DataType.TEXT })
  student_feedback!: string;

  @Column({ type: DataType.INET })
  ip_address!: string;

  @Column({ type: DataType.TEXT })
  user_agent!: string;
}
