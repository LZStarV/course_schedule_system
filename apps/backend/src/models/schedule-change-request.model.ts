import {
  Table,
  Column,
  Model,
  DataType,
} from 'sequelize-typescript';

@Table({
  tableName: 'schedule_change_requests',
  timestamps: false,
  underscored: true,
})
export class ScheduleChangeRequest extends Model<ScheduleChangeRequest> {
  @Column({ type: DataType.UUID, primaryKey: true })
  id!: string;
  @Column({ type: DataType.UUID }) course_id!: string;
  @Column({ type: DataType.UUID }) teacher_id?: string;
  @Column({ type: DataType.INTEGER })
  old_day_of_week?: number;
  @Column({ type: DataType.TIME }) old_start_time?: string;
  @Column({ type: DataType.TIME }) old_end_time?: string;
  @Column({ type: DataType.INTEGER })
  new_day_of_week!: number;
  @Column({ type: DataType.TIME }) new_start_time!: string;
  @Column({ type: DataType.TIME }) new_end_time!: string;
  @Column({ type: DataType.TEXT }) reason?: string;
  @Column({ type: DataType.STRING }) status!: string;
  @Column({ type: DataType.DATE }) reviewed_at?: Date;
  @Column({ type: DataType.UUID }) reviewed_by?: string;
  @Column({ type: DataType.DATE }) created_at?: Date;
}
