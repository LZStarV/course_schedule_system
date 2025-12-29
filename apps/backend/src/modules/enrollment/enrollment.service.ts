import { Injectable } from '@nestjs/common';
import { InjectModel, InjectConnection } from '@nestjs/sequelize';
import { Sequelize } from 'sequelize-typescript';
import { Enrollment } from '../../models/enrollment.model';
import { redisClient } from '../../config/redis.config';
import { logger } from '../../common/logger';

@Injectable()
export class EnrollmentService {
  constructor(
    @InjectModel(Enrollment) private readonly enrollmentModel: typeof Enrollment,
    @InjectConnection() private readonly sequelize: Sequelize
  ) {}

  async add(params: { courseId: string; sectionId?: string }) {
    logger.info({ courseId: params.courseId, sectionId: params.sectionId });
    const t = await this.sequelize.transaction();
    try {
      const created = await this.enrollmentModel.create(
        {
          course_id: params.courseId,
          student_id: '00000000-0000-0000-0000-000000000003',
          status: 'SELECTED',
        } as any,
        { transaction: t }
      );
      await t.commit();
      logger.info({ enrollmentId: created.id });
      const keys = await redisClient.keys('course:list:*');
      if (keys.length) await redisClient.del(...keys);
      return { enrollmentId: created.id, status: 'SELECTED' };
    } catch (e) {
      await t.rollback();
      logger.error({ error: (e as any)?.message });
      throw e;
    }
  }
}
