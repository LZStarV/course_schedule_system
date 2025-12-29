import { Table, Column, Model, DataType } from 'sequelize-typescript';

@Table({ tableName: 'users', timestamps: true, underscored: true })
export class User extends Model<User> {
  @Column({ type: DataType.UUID, primaryKey: true })
  id!: string;

  @Column({ type: DataType.STRING })
  username!: string;

  @Column({ type: DataType.STRING })
  role!: string;

  @Column({ type: DataType.STRING })
  password_hash!: string;
}
