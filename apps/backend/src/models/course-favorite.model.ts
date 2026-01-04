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
  tableName: 'course_favorites',
  timestamps: false,
  underscored: true,
})
export class CourseFavorite extends Model<CourseFavorite> {
  @Column({
    type: DataType.UUID,
    primaryKey: true,
    defaultValue: DataType.UUIDV4,
  })
  id!: string;
  @Column({ type: DataType.UUID })
  user_id!: string;
  @ForeignKey(() => Course)
  @Column({ type: DataType.UUID })
  course_id!: string;
  @Column({ type: DataType.STRING })
  category?: string;
  @Column({ type: DataType.DATE })
  created_at?: Date;

  @BelongsTo(() => Course, 'course_id')
  course?: Course;
}
