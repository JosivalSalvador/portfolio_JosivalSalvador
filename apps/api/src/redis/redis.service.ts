import {
  Injectable,
  Logger,
  type OnModuleDestroy,
  type OnModuleInit,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { createClient } from '@keyv/redis';
import type { EnvironmentVariables } from '../config/env.validation.js';

@Injectable()
export class RedisService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(RedisService.name);

  readonly client: ReturnType<typeof createClient>;

  constructor(config: ConfigService<EnvironmentVariables, true>) {
    this.client = createClient({
      url: config.get('REDIS_URL', { infer: true }),
    });

    // Sem listener de 'error', o cliente derruba a api quando o Redis cai.
    this.client.on('error', (error: unknown) => {
      this.logger.error(`Conexão com o Redis: ${this.reasonOf(error)}`);
    });
  }

  onModuleInit(): void {
    // Sem await de propósito: se o Redis estiver fora no boot, a api sobe
    // mesmo assim e o cliente reconecta sozinho. O estado aparece no /health.
    this.client.connect().catch((error: unknown) => {
      this.logger.error(`Falha ao conectar no Redis: ${this.reasonOf(error)}`);
    });
  }

  async onModuleDestroy(): Promise<void> {
    if (!this.client.isOpen) return;

    // close() espera os comandos pendentes, que com o Redis fora nunca terminam.
    if (this.client.isReady) await this.client.close();
    else this.client.destroy();
  }

  private reasonOf(error: unknown): string {
    return error instanceof Error ? error.message : String(error);
  }
}