import { Test, TestingModule } from '@nestjs/testing';
import { ServiceUnavailableException } from '@nestjs/common';
import { HealthController } from './health.controller.js';
import { HealthService } from './health.service.js';
import type { HealthReport } from './entities/health.entity.js';

describe('HealthController', () => {
  let controller: HealthController;

  const healthService = { check: vi.fn() };

  beforeEach(async () => {
    vi.resetAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      controllers: [HealthController],
      providers: [{ provide: HealthService, useValue: healthService }],
    }).compile();

    controller = module.get<HealthController>(HealthController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  it('devolve o relatório do service quando tudo responde', async () => {
    const report: HealthReport = {
      status: 'ok',
      services: { database: 'up', redis: 'up' },
    };
    healthService.check.mockResolvedValue(report);

    await expect(controller.check()).resolves.toBe(report);
  });

  it('propaga o 503 do service', async () => {
    const error = new ServiceUnavailableException({
      status: 'error',
      services: { database: 'up', redis: 'down' },
    });
    healthService.check.mockRejectedValue(error);

    await expect(controller.check()).rejects.toBe(error);
  });
});