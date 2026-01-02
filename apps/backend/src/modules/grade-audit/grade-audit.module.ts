import { Module } from '@nestjs/common';
import { SequelizeModule } from '@nestjs/sequelize';
import { GradeAuditController } from './grade-audit.controller';
import { GradeAuditService } from './grade-audit.service';
import { GradeAudit } from '../../models/grade-audit.model';
import { Enrollment } from '../../models/enrollment.model';

@Module({
  imports: [
    SequelizeModule.forFeature([GradeAudit, Enrollment]),
  ],
  providers: [GradeAuditService, GradeAuditController],
})
export class GradeAuditModule {}
