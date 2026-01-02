import {
  Table,
  Column,
  Model,
  DataType,
} from 'sequelize-typescript';

@Table({
  tableName: 'course_announcements',
  timestamps: false,
  underscored: true,
})
export class CourseAnnouncement extends Model<CourseAnnouncement> {
  @Column({ type: DataType.UUID, primaryKey: true })
  id!: string;
  @Column({ type: DataType.UUID }) course_id!: string;
  @Column({ type: DataType.STRING }) title!: string;
  @Column({ type: DataType.TEXT }) content!: string;
  @Column({ type: DataType.STRING }) category?: string;
  @Column({ type: DataType.STRING }) status!: string;
  @Column({ type: DataType.DATE }) published_at?: Date;
  @Column({ type: DataType.DATE }) created_at?: Date;
  @Column({ type: DataType.DATE }) updated_at?: Date;
}
