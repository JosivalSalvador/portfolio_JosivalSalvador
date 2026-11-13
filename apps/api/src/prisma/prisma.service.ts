import { Injectable, type OnModuleDestroy } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createDb } from './db.js';
import type { EnvironmentVariables } from '../config/env.validation.js';

@Injectable()
export class PrismaService implements OnModuleDestroy {
  readonly db: ReturnType<typeof createDb>;

  constructor(config: ConfigService<EnvironmentVariables, true>) {
    this.db = createDb(config.get('DATABASE_URL', { infer: true }));
  }

  async onModuleDestroy() {
    await this.db.close();
  }
}