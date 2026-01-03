import { Injectable, Inject } from '@nestjs/common';
import { StatsSystemService } from './stats-system.service';

@Injectable()
export class StatsSystemController {
  constructor(
    @Inject(StatsSystemService)
    private readonly service: StatsSystemService
  ) {}
  async get() {
    return await this.service.get();
  }

  async details() {
    return await this.service.details();
  }
}
