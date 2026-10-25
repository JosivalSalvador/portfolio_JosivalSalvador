export function validate(config: Record<string, unknown>) {
  if (typeof config.API_KEY !== 'string' || config.API_KEY === '') {
    throw new Error('A variável de ambiente API_KEY é obrigatória');
  }

  const port = config.PORT === undefined ? 3000 : Number(config.PORT);
  if (!Number.isInteger(port) || port < 1 || port > 65535) {
    throw new Error('PORT deve ser um número inteiro entre 1 e 65535');
  }

  return { ...config, PORT: port };
}