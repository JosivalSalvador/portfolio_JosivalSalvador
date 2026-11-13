import { NestFactory } from '@nestjs/core';
import { ConfigService } from '@nestjs/config';
import { Logger } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { apiReference } from '@scalar/nestjs-api-reference';
import { AppModule } from './app.module.js';
import type { EnvironmentVariables } from './config/env.validation.js';
import compression from 'compression';

async function bootstrap() {
  const origins = ['http://localhost:4200', 'https://meusite.com'];
  const app = await NestFactory.create(AppModule);
  const config = app.get<ConfigService<EnvironmentVariables, true>>(ConfigService);

  const document = SwaggerModule.createDocument(
    app,
    new DocumentBuilder().setTitle('API').setVersion('1.0').build(),
  );
  app.use('/docs', apiReference({ content: document }));

  app.useSecurityHeaders();
  app.enableCsrfProtection({ trustedOrigins: origins });
  app.enableCors({ origin: origins, credentials: true });
  app.use(compression());
  app.enableShutdownHooks();
  await app.listen(config.get('PORT', { infer: true }));
}

bootstrap().catch((error: unknown) => {
  Logger.error(error, 'Bootstrap');
  process.exit(1);
});