import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { StatsUsersController } from './stats-users.controller';
import { StatsUsersService } from './stats-users.service';
import { User } from '../../models/user.model';

@Module({
  imports: [SequelizeModule.forFeature([User])],
  providers: [StatsUsersService, StatsUsersController],
})
export class StatsUsersModule {}
