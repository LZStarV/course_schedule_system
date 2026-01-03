import { Injectable, Inject } from '@nestjs/common';
import { StatsTeachingService } from './stats-teaching.service';

@Injectable()
export class StatsTeachingController {
  constructor(
    @Inject(StatsTeachingService)
    private readonly service: StatsTeachingService
  ) {}
  async get(
    _params: Record<string, unknown>,
    context?: Record<string, unknown>
  ) {
    return await this.service.get(context);
  }

  async details(
    _params: Record<string, unknown>,
    context?: Record<string, unknown>
  ) {
    return await this.service.details(context);
  }
}
