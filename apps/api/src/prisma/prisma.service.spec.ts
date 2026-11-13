import { Test, TestingModule } from '@nestjs/testing';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { Inject, Injectable, Module } from '@nestjs/common';
import { PrismaService } from './prisma.service.js';
import { PrismaModule } from './prisma.module.js';
import { createDb } from './db.js';

vi.mock('./db.js', () => ({ createDb: vi.fn() }));

const url = 'postgresql://usuario:senha@localhost:5432/teste';

// Módulo de teste que importa o PrismaModule, como o UsersModule faz.
@Injectable()
class Consumer {
  constructor(@Inject(PrismaService) readonly prisma: PrismaService) {}
}

@Module({ imports: [PrismaModule], providers: [Consumer] })
class ConsumerModule {}

describe('PrismaService', () => {
  let service: PrismaService;

  const db = { close: vi.fn() };
  const config = { get: vi.fn() };

  beforeEach(async () => {
    vi.resetAllMocks();
    db.close.mockResolvedValue(undefined);
    config.get.mockReturnValue(url);
    vi.mocked(createDb).mockReturnValue(db as never);

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PrismaService,
        { provide: ConfigService, useValue: config },
      ],
    }).compile();

    service = module.get<PrismaService>(PrismaService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('cria o db com a DATABASE_URL da configuração', () => {
    expect(config.get).toHaveBeenCalledWith('DATABASE_URL', { infer: true });
    expect(createDb).toHaveBeenCalledWith(url);
  });

  it('expõe o db criado', () => {
    expect(service.db).toBe(db);
  });

  it('fecha a conexão ao encerrar o módulo', async () => {
    await service.onModuleDestroy();

    expect(db.close).toHaveBeenCalledTimes(1);
  });
});

describe('PrismaModule', () => {
  it('disponibiliza o PrismaService para quem o importa', async () => {
    vi.mocked(createDb).mockReturnValue({ close: vi.fn() } as never);

    const module: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          isGlobal: true,
          ignoreEnvFile: true,
          load: [() => ({ DATABASE_URL: url })],
        }),
        ConsumerModule,
      ],
    }).compile();

    expect(module.get(Consumer).prisma).toBeInstanceOf(PrismaService);
  });
});