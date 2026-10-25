import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Reflector } from '@nestjs/core';
import { IS_PUBLIC_KEY } from '../../decorators/public/public.decorator.js';
import type { RequestWithUser } from '../../interfaces/request-with-user/request-with-user.interface.js';

@Injectable()
export class ApiKeyGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly configService: ConfigService,
  ) {}

  canActivate(context: ExecutionContext): boolean {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    if (isPublic) {
      return true;
    }

    const req = context.switchToHttp().getRequest<RequestWithUser>();
    const apiKey = req.header('x-api-key');

    if (apiKey !== this.configService.getOrThrow<string>('API_KEY')) {
      throw new UnauthorizedException('API key inválida ou ausente');
    }

    req.user = { id: 1 };
    return true;
  }
}