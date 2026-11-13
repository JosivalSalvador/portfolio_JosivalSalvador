import { Module, ValidationPipe, MiddlewareConsumer } from '@nestjs/common';
import { APP_GUARD, APP_PIPE, APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { HealthModule } from './modules/health/health.module.js';
import { HttpExceptionFilter } from './common/filters/http-exception/http-exception.filter.js';
import { LoggerMiddleware } from './common/middleware/logger/logger.middleware.js';
import { LoggingInterceptor } from './common/interceptors/logging/logging.interceptor.js';
import { RedisModule } from './redis/redis.module.js';
import { ConfigModule } from '@nestjs/config';
import { validate } from './config/env.validation.js';
import { UsuariosModule } from './modules/usuarios/usuarios.module.js';
import { PerfilModule } from './modules/perfil/perfil.module.js';


@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validate,
    }),
    ThrottlerModule.forRoot({
      throttlers: [{ ttl: 60000, limit: 100 }],
    }),
    HealthModule,
    RedisModule,
    UsuariosModule,
    PerfilModule,
  ],
  providers: [
    { provide: APP_GUARD, useClass: ThrottlerGuard },
    { provide: APP_FILTER, useClass: HttpExceptionFilter },
    {
      provide: APP_PIPE,
      useFactory: () => {
        return new ValidationPipe({
          whitelist: true,
          forbidNonWhitelisted: true,
          transform: true,
          transformOptions: {
            enableImplicitConversion: true,
          },
        });
      },
    },
    { provide: APP_INTERCEPTOR, useClass: LoggingInterceptor },

  ],
})

export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LoggerMiddleware).forRoutes('*');
  }
}