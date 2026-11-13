import { Controller, Get } from '@nestjs/common';
import { HealthService } from './health.service.js';
import type { HealthReport } from './entities/health.entity.js';

@Controller('health')
export class HealthController {
  constructor(private readonly healthService: HealthService) {}

  @Get()
  check(): Promise<HealthReport> {
    return this.healthService.check();
  }
}