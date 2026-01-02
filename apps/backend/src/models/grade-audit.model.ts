import {
  Table,
  Column,
  Model,
  DataType,
} from 'sequelize-typescript';

@Table({
  tableName: 'grade_audits',
  timestamps: false,
  underscored: true,
})
export class GradeAudit extends Model<GradeAudit> {
  @Column({ type: DataType.UUID, primaryKey: true })
  id!: string;

  @Column({ type: DataType.UUID })
  enrollment_id!: string;

  @Column({ type: DataType.DECIMAL })
  old_score?: number;

  @Column({ type: DataType.STRING })
  old_grade?: string;

  @Column({ type: DataType.DECIMAL })
  new_score?: number;

  @Column({ type: DataType.STRING })
  new_grade?: string;

  @Column({ type: DataType.TEXT })
  reason?: string;

  @Column({ type: DataType.STRING })
  status!: string;

  @Column({ type: DataType.DATE })
  reviewed_at?: Date;

  @Column({ type: DataType.UUID })
  reviewed_by?: string;

  @Column({ type: DataType.DATE })
  created_at?: Date;
}
