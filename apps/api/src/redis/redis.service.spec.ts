import { Test, TestingModule } from '@nestjs/testing';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { Inject, Injectable, Logger, Module } from '@nestjs/common';
import type { MockInstance } from 'vitest';
import { createClient } from '@redis/client';
import { RedisService } from './redis.service.js';
import { RedisModule } from './redis.module.js';

vi.mock('@redis/client', () => ({ createClient: vi.fn() }));

const url = 'redis://:senha@localhost:6379';

// Módulo de teste que importa o RedisModule, como o HealthModule faz.
@Injectable()
class Consumer {
  constructor(@Inject(RedisService) readonly redis: RedisService) {}
}

@Module({ imports: [RedisModule], providers: [Consumer] })
class ConsumerModule {}

describe('RedisService', () => {
  let service: RedisService;
  let logError: MockInstance;

  const client = {
    on: vi.fn(),
    connect: vi.fn(),
    close: vi.fn(),
    destroy: vi.fn(),
    isOpen: true,
    isReady: true,
  };
  const config = { get: vi.fn() };

  beforeEach(async () => {
    vi.resetAllMocks();
    client.isOpen = true;
    client.isReady = true;
    client.connect.mockResolvedValue(client);
    client.close.mockResolvedValue(undefined);
    config.get.mockReturnValue(url);
    vi.mocked(createClient).mockReturnValue(client as never);
    logError = vi.spyOn(Logger.prototype, 'error').mockImplementation(() => undefined);

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        RedisService,
        { provide: ConfigService, useValue: config },
      ],
    }).compile();

    service = module.get<RedisService>(RedisService);
  });

  afterEach(() => {
    logError.mockRestore();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('cria o cliente com a REDIS_URL da configuração', () => {
    expect(config.get).toHaveBeenCalledWith('REDIS_URL', { infer: true });
    expect(createClient).toHaveBeenCalledWith({ url });
  });

  it('expõe o cliente criado', () => {
    expect(service.client).toBe(client);
  });

  it('registra um listener de erro que loga sem lançar', () => {
    const [event, handler] = client.on.mock.calls[0] as [
      string,
      (error: unknown) => void,
    ];

    expect(event).toBe('error');
    expect(() => handler(new Error('socket closed'))).not.toThrow();
    expect(logError).toHaveBeenCalledWith(
      expect.stringContaining('socket closed'),
    );
  });

  describe('onModuleInit', () => {
    it('conecta o cliente', () => {
      service.onModuleInit();

      expect(client.connect).toHaveBeenCalledTimes(1);
    });

    it('loga e não lança quando a conexão inicial falha', async () => {
      client.connect.mockRejectedValue(new Error('ECONNREFUSED'));

      expect(() => service.onModuleInit()).not.toThrow();

      await vi.waitFor(() =>
        expect(logError).toHaveBeenCalledWith(
          expect.stringContaining('ECONNREFUSED'),
        ),
      );
    });
  });

  describe('onModuleDestroy', () => {
    it('fecha a conexão com close() quando o cliente está pronto', async () => {
      await service.onModuleDestroy();

      expect(client.close).toHaveBeenCalledTimes(1);
      expect(client.destroy).not.toHaveBeenCalled();
    });

    it('usa destroy() quando o cliente está aberto mas não está pronto', async () => {
      client.isReady = false;

      await service.onModuleDestroy();

      expect(client.destroy).toHaveBeenCalledTimes(1);
      expect(client.close).not.toHaveBeenCalled();
    });

    it('não faz nada quando o cliente já está fechado', async () => {
      client.isOpen = false;
      client.isReady = false;

      await service.onModuleDestroy();

      expect(client.close).not.toHaveBeenCalled();
      expect(client.destroy).not.toHaveBeenCalled();
    });
  });
});

describe('RedisModule', () => {
  it('disponibiliza o RedisService para quem o importa', async () => {
    vi.mocked(createClient).mockReturnValue({ on: vi.fn() } as never);

    const module: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          isGlobal: true,
          ignoreEnvFile: true,
          load: [() => ({ REDIS_URL: url })],
        }),
        ConsumerModule,
      ],
    }).compile();

    expect(module.get(Consumer).redis).toBeInstanceOf(RedisService);
  });
});