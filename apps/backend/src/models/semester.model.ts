import {
  Table,
  Column,
  Model,
  DataType,
} from 'sequelize-typescript';

@Table({
  tableName: 'semesters',
  timestamps: false,
  underscored: true,
})
export class Semester extends Model<Semester> {
  @Column({ type: DataType.UUID, primaryKey: true })
  id!: string;
  @Column({ type: DataType.STRING }) name!: string;
  @Column({ type: DataType.STRING }) academic_year!: string;
  @Column({ type: DataType.DATE }) start_date!: Date;
  @Column({ type: DataType.DATE }) end_date!: Date;
  @Column({ type: DataType.DATE })
  selection_start_date?: Date;
  @Column({ type: DataType.DATE })
  selection_end_date?: Date;
  @Column({ type: DataType.STRING }) status!: string;
  @Column({ type: DataType.BOOLEAN }) is_current!: boolean;
  @Column({ type: DataType.DATE }) created_at?: Date;
  @Column({ type: DataType.DATE }) updated_at?: Date;
}
