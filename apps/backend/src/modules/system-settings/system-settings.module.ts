import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { SystemSettingsController } from './system-settings.controller';
import { SystemSettingsService } from './system-settings.service';
import { SystemConfig } from '../../models/system-config.model';

@Module({
  imports: [SequelizeModule.forFeature([SystemConfig])],
  providers: [
    SystemSettingsService,
    SystemSettingsController,
  ],
})
export class SystemSettingsModule {}
