import { Injectable, Inject } from '@nestjs/common';
import { StatsUsersService } from './stats-users.service';

@Injectable()
export class StatsUsersController {
  constructor(
    @Inject(StatsUsersService)
    private readonly service: StatsUsersService
  ) {}
  async get() {
    return await this.service.get();
  }
}
