import {
  Table,
  Column,
  Model,
  DataType,
  ForeignKey,
  BelongsTo,
} from 'sequelize-typescript';
import { Course } from './course.model';

@Table({
  tableName: 'class_schedules',
  timestamps: false,
  underscored: true,
})
export class ClassSchedule extends Model<ClassSchedule> {
  @Column({ type: DataType.UUID, primaryKey: true })
  id!: string;
  @ForeignKey(() => Course)
  @Column({ type: DataType.UUID })
  course_id!: string;
  @Column({ type: DataType.INTEGER }) weekday!: number;
  @Column({ type: DataType.TIME }) start_time!: string;
  @Column({ type: DataType.TIME }) end_time!: string;
  @Column({ type: DataType.TEXT }) location?: string;
  @Column({ type: DataType.BOOLEAN }) is_active!: boolean;

  @BelongsTo(() => Course, 'course_id')
  course?: Course;
}
