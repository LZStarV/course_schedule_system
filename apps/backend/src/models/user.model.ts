import {
  Table,
  Column,
  Model,
  DataType,
} from 'sequelize-typescript';

@Table({
  tableName: 'users',
  timestamps: true,
  underscored: true,
})
export class User extends Model<User> {
  @Column({ type: DataType.UUID, primaryKey: true })
  id!: string;

  @Column({ type: DataType.STRING })
  username!: string;

  @Column({ type: DataType.STRING })
  email!: string;

  @Column({ type: DataType.STRING })
  phone!: string;

  @Column({ type: DataType.STRING })
  real_name!: string;

  @Column({ type: DataType.STRING })
  avatar_url!: string;

  @Column({ type: DataType.STRING })
  gender!: string;

  @Column({ type: DataType.DATE })
  birth_date!: Date;

  @Column({ type: DataType.STRING })
  student_id!: string;

  @Column({ type: DataType.STRING })
  teacher_id!: string;

  @Column({ type: DataType.UUID })
  department_id!: string;

  @Column({ type: DataType.STRING })
  major!: string;

  @Column({ type: DataType.INTEGER })
  grade!: number;

  @Column({ type: DataType.STRING })
  class_name!: string;

  @Column({ type: DataType.STRING })
  role!: string;

  @Column({ type: DataType.STRING })
  status!: string;

  @Column({ type: DataType.STRING })
  password_hash!: string;

  @Column({ type: DataType.DATE })
  last_login_at!: Date;

  @Column({ type: DataType.INTEGER })
  failed_login_attempts!: number;

  @Column({ type: DataType.DATE })
  locked_until!: Date;

  @Column({ type: DataType.UUID })
  created_by!: string;

  @Column({ type: DataType.UUID })
  updated_by!: string;
}
