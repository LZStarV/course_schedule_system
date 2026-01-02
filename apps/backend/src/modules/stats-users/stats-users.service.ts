import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { User } from '../../models/user.model';

@Injectable()
export class StatsUsersService {
  constructor(
    @InjectModel(User)
    private readonly userModel: typeof User
  ) {}
  async get() {
    const student = await this.userModel.count({
      where: { role: 'STUDENT' } as any,
    });
    const teacher = await this.userModel.count({
      where: { role: 'TEACHER' } as any,
    });
    const admin = await this.userModel.count({
      where: { role: 'ADMIN' } as any,
    });
    return { student, teacher, admin };
  }
}
