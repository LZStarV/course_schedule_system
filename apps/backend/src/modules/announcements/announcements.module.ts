import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { AnnouncementsController } from './announcements.controller';
import { AnnouncementsService } from './announcements.service';
import { CourseAnnouncement } from '../../models/course-announcement.model';

@Module({
  imports: [
    SequelizeModule.forFeature([CourseAnnouncement]),
  ],
  providers: [
    AnnouncementsService,
    AnnouncementsController,
  ],
})
export class AnnouncementsModule {}
