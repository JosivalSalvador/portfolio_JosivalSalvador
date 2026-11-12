import { plainToInstance } from 'class-transformer';
import { IsEnum, IsInt, IsUrl, Max, Min, validateSync } from 'class-validator';

enum Environment {
  Development = 'development',
  Test = 'test',
  Production = 'production',
}

export class EnvironmentVariables {
  @IsEnum(Environment)
  NODE_ENV: Environment;

  @IsInt()
  @Min(1)
  @Max(65535)
  PORT: number;

  @IsUrl({
    protocols: ['postgresql', 'postgres'],
    require_protocol: true,
    require_tld: false,
  })
  DATABASE_URL: string;

  @IsUrl({
    protocols: ['redis', 'rediss'],
    require_protocol: true,
    require_tld: false,
  })
  REDIS_URL: string;
}

export function validate(
  config: Record<string, unknown>,
): EnvironmentVariables {
  const validated = plainToInstance(EnvironmentVariables, config, {
    enableImplicitConversion: true,
  });

  const errors = validateSync(validated);

  if (errors.length > 0) {
    const messages = errors.flatMap((error) =>
      Object.values(error.constraints ?? {}),
    );
    throw new Error(`Variáveis de ambiente inválidas:\n${messages.join('\n')}`);
  }

  return validated;
}