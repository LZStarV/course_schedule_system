import {
  Table,
  Column,
  Model,
  DataType,
} from 'sequelize-typescript';

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
  @Column({ type: DataType.UUID })
  course_id!: string;
  @Column({ type: DataType.STRING })
  category?: string;
  @Column({ type: DataType.DATE })
  created_at?: Date;
}
