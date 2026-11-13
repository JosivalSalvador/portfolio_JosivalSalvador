import { Test, TestingModule } from '@nestjs/testing';
import { Logger, ServiceUnavailableException } from '@nestjs/common';
import type { MockInstance } from 'vitest';
import { HealthService } from './health.service.js';
import { PrismaService } from '../../prisma/prisma.service.js';
import { RedisService } from '../../redis/redis.service.js';

describe('HealthService', () => {
  let service: HealthService;
  let warn: MockInstance;

  const first = vi.fn();
  const ping = vi.fn();
  const prisma = { db: { orm: { public: { User: { first } } } } };
  const redis = { client: { ping } };

  beforeEach(async () => {
    vi.resetAllMocks();
    first.mockResolvedValue(null);
    ping.mockResolvedValue('PONG');
    warn = vi.spyOn(Logger.prototype, 'warn').mockImplementation(() => undefined);

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        HealthService,
        { provide: PrismaService, useValue: prisma },
        { provide: RedisService, useValue: redis },
      ],
    }).compile();

    service = module.get<HealthService>(HealthService);
  });

  afterEach(() => {
    vi.useRealTimers();
    warn.mockRestore();
  });

  async function failure(): Promise<ServiceUnavailableException> {
    const error: unknown = await service.check().then(
      () => undefined,
      (reason: unknown) => reason,
    );
    expect(error).toBeInstanceOf(ServiceUnavailableException);
    return error as ServiceUnavailableException;
  }

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('devolve ok quando banco e Redis respondem', async () => {
    await expect(service.check()).resolves.toEqual({
      status: 'ok',
      services: { database: 'up', redis: 'up' },
    });
  });

  it('consulta o banco e envia um PING ao Redis', async () => {
    await service.check();

    expect(first).toHaveBeenCalledWith({ id: 0 });
    expect(ping).toHaveBeenCalledTimes(1);
  });

  it('responde 503 apontando o banco quando ele falha', async () => {
    first.mockRejectedValue(new Error('connection refused'));

    const error = await failure();

    expect(error.getStatus()).toBe(503);
    expect(error.getResponse()).toEqual({
      status: 'error',
      services: { database: 'down', redis: 'up' },
      message: 'Serviços indisponíveis: database',
    });
  });

  it('responde 503 apontando o Redis quando o PING falha', async () => {
    ping.mockRejectedValue(new Error('connection refused'));

    const error = await failure();

    expect(error.getStatus()).toBe(503);
    expect(error.getResponse()).toEqual({
      status: 'error',
      services: { database: 'up', redis: 'down' },
      message: 'Serviços indisponíveis: redis',
    });
  });

  it('responde 503 apontando os dois quando ambos falham', async () => {
    first.mockRejectedValue(new Error('db fora'));
    ping.mockRejectedValue(new Error('redis fora'));

    const error = await failure();

    expect(error.getResponse()).toEqual({
      status: 'error',
      services: { database: 'down', redis: 'down' },
      message: 'Serviços indisponíveis: database, redis',
    });
  });

  it('trata como falha o serviço que não responde dentro do timeout', async () => {
    vi.useFakeTimers();
    first.mockReturnValue(new Promise<never>(() => {}));

    const pending = failure();
    await vi.advanceTimersByTimeAsync(2000);
    const error = await pending;

    expect(error.getResponse()).toEqual({
      status: 'error',
      services: { database: 'down', redis: 'up' },
      message: 'Serviços indisponíveis: database',
    });
    expect(warn).toHaveBeenCalledWith(expect.stringContaining('timeout'));
  });

  it('registra no log o motivo da falha', async () => {
    first.mockRejectedValue(new Error('connection refused'));

    await failure();

    expect(warn).toHaveBeenCalledWith(
      expect.stringMatching(/database.*connection refused/),
    );
  });

  it('não deixa timers pendentes quando os serviços respondem', async () => {
    vi.useFakeTimers();

    await service.check();

    expect(vi.getTimerCount()).toBe(0);
  });
});