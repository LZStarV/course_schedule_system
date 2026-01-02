import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/sequelize';
import { SystemConfig } from '../../models/system-config.model';

@Injectable()
export class SystemSettingsService {
  constructor(
    @InjectModel(SystemConfig)
    private readonly cfgModel: typeof SystemConfig
  ) {}

  async getAll(category?: string) {
    const where: any = {};
    if (category) where.category = category;
    const rows = await this.cfgModel.findAll({ where });
    return { data: rows };
  }

  async update(config_key: string, config_value: any) {
    await this.cfgModel.update(
      { config_value, updated_at: new Date() } as any,
      { where: { config_key } }
    );
    return { ok: true };
  }
}
