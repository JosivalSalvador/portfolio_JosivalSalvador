import path from 'node:path';
import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  /* config options here */
  experimental: {
    agentFeedback: true,
  },
  cacheComponents: true,
  partialPrefetching: true,

  // Necessário pro Docker: gera .next/standalone só com o que o app usa.
  output: 'standalone',

  // No monorepo, o rastreamento de arquivos precisa partir da raiz do
  // repositório (duas pastas acima de apps/web). Sem isso, o standalone
  // fica sem as dependências instaladas na raiz.
  outputFileTracingRoot: path.join(__dirname, '../../'),

  turbopack: {
    rules: {
      '*.css': {
        loaders: ['@tailwindcss/turbopack'],
        as: '*.css',
      },
    },
  },
};

export default nextConfig;