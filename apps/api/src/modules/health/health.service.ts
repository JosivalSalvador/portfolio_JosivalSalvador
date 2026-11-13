import {
  Injectable,
  Logger,
  ServiceUnavailableException,
} from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service.js';
import { RedisService } from '../../redis/redis.service.js';
import type {
  HealthReport,
  ServiceName,
  ServiceStatus,
} from './entities/health.entity.js';

const CHECK_TIMEOUT_MS = 2000;

@Injectable()
export class HealthService {
  private readonly logger = new Logger(HealthService.name);

  constructor(
    private readonly prisma: PrismaService,
    private readonly redis: RedisService,
  ) {}

  async check(): Promise<HealthReport> {
    const [database, redis] = await Promise.all([
      this.run('database', () => this.pingDatabase()),
      this.run('redis', () => this.pingRedis()),
    ]);

    const services: Record<ServiceName, ServiceStatus> = { database, redis };
    const failed = (Object.keys(services) as ServiceName[]).filter(
      (name) => services[name] === 'down',
    );
    const report: HealthReport = {
      status: failed.length > 0 ? 'error' : 'ok',
      services,
    };

    if (failed.length > 0) {
      throw new ServiceUnavailableException({
        ...report,
        message: `Serviços indisponíveis: ${failed.join(', ')}`,
      });
    }

    return report;
  }

  private async pingDatabase(): Promise<void> {
    // O id 0 nunca existe: a busca só prova que o banco responde.
    await this.prisma.db.orm.public.User.first({ id: 0 });
  }

  private async pingRedis(): Promise<void> {
    await this.redis.client.ping();
  }

  private async run(
    name: ServiceName,
    ping: () => Promise<void>,
  ): Promise<ServiceStatus> {
    try {
      await this.withTimeout(ping());
      return 'up';
    } catch (error) {
      const reason = error instanceof Error ? error.message : String(error);
      this.logger.warn(`Health check de ${name} falhou: ${reason}`);
      return 'down';
    }
  }

  private withTimeout<T>(promise: Promise<T>): Promise<T> {
    let timer: NodeJS.Timeout | undefined;
    const timeout = new Promise<never>((_, reject) => {
      timer = setTimeout(
        () => reject(new Error(`timeout de ${CHECK_TIMEOUT_MS}ms`)),
        CHECK_TIMEOUT_MS,
      );
    });

    return Promise.race([promise, timeout]).finally(() => clearTimeout(timer));
  }
}