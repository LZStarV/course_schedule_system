import { Controller, Get } from '@nestjs/common';
import { logger } from './common/logger';

@Controller()
export class AppController {
  @Get()
  getRoot(): string {
    logger.info({ path: '/' });
    return 'Backend OK';
  }

  @Get('health')
  getHealth() {
    return { status: 'ok', timestamp: Date.now() };
  }
}
