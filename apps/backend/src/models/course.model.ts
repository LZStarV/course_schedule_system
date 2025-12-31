import {
  Table,
  Column,
  Model,
  DataType,
  ForeignKey,
  BelongsTo,
} from 'sequelize-typescript';
import { Department } from './department.model';
import { User } from './user.model';

@Table({
  tableName: 'courses',
  timestamps: true,
  underscored: true,
})
export class Course extends Model<Course> {
  @Column({ type: DataType.UUID, primaryKey: true })
  id!: string;

  @Column({ type: DataType.STRING })
  course_code!: string;

  @Column({ type: DataType.STRING })
  course_number?: string;

  @Column({ type: DataType.STRING })
  name!: string;

  @Column({ type: DataType.STRING })
  english_name?: string;

  @Column({ type: DataType.DECIMAL })
  credit!: number;

  @Column({ type: DataType.INTEGER })
  credit_hours!: number;

  @Column({ type: DataType.STRING })
  course_type!: string;

  @ForeignKey(() => Department)
  @Column({ type: DataType.UUID })
  department_id!: string;

  @ForeignKey(() => User)
  @Column({ type: DataType.UUID })
  teacher_id!: string;

  @Column({ type: DataType.STRING })
  academic_year!: string;

  @Column({ type: DataType.STRING })
  semester!: string;

  @Column({ type: DataType.INTEGER })
  capacity!: number;

  @Column({ type: DataType.INTEGER })
  min_quota!: number;

  @Column({ type: DataType.INTEGER })
  enrolled_count!: number;

  @Column({ type: DataType.STRING })
  status!: string;

  @Column({ type: DataType.JSONB })
  schedule!: any;

  @Column({ type: DataType.STRING })
  location_type!: string;

  @Column({ type: DataType.JSONB })
  location_details?: any;

  @Column({ type: DataType.TEXT })
  description?: string;

  @Column({ type: DataType.TEXT })
  objectives?: string;

  @Column({ type: DataType.TEXT })
  syllabus?: string;

  @Column({ type: DataType.TEXT })
  assessment_method?: string;

  @Column({ type: DataType.TEXT })
  textbook_reference?: string;

  @Column({ type: DataType.JSONB })
  attachments?: any;

  @Column({ type: DataType.JSONB })
  restrictions?: any;

  @Column({ type: DataType.INTEGER })
  view_count?: number;

  @Column({ type: DataType.INTEGER })
  favorite_count?: number;

  @Column({ type: DataType.TEXT })
  review_notes?: string;

  @Column({ type: DataType.DATE })
  reviewed_at?: Date;

  @Column({ type: DataType.UUID })
  reviewed_by?: string;

  @Column({ type: DataType.DATE })
  published_at?: Date;

  @BelongsTo(() => Department, 'department_id')
  department?: Department;

  @BelongsTo(() => User, 'teacher_id')
  teacher?: User;
}
