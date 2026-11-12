import { Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { CacheModule } from '@nestjs/cache-manager';
import { createKeyv } from '@keyv/redis';
import type { EnvironmentVariables } from '../config/env.validation.js';

@Module({
  imports: [
    CacheModule.registerAsync({
      isGlobal: true,
      inject: [ConfigService],
      useFactory: (config: ConfigService<EnvironmentVariables, true>) => ({
        stores: [createKeyv(config.get('REDIS_URL', { infer: true }))],
      }),
    }),
  ],
})
export class RedisModule {}