# ============================================
# Dockerfile do web (Next.js) em monorepo Turborepo + pnpm
#
# Faça o build SEMPRE a partir da raiz do repositório:
#   docker build -f apps/web/Dockerfile -t portifolio-web .
# ============================================

# Versão do Node. A tag "24-slim" pega o 24.x mais recente.
# Para um build 100% reproduzível, fixe a versão completa (24.x.y-slim)
# e atualize de tempos em tempos.
ARG NODE_VERSION=24-slim

# ============================================
# Stage 1: base (Node + pnpm via corepack)
# O pnpm usa a versão do campo "packageManager" do package.json.
# ============================================
FROM node:${NODE_VERSION} AS base

WORKDIR /app

ENV COREPACK_ENABLE_DOWNLOAD_PROMPT=0
RUN corepack enable pnpm

# ============================================
# Stage 2: prepare (turbo prune isola só o que o web precisa)
# ============================================
FROM base AS prepare

# Mantenha igual à versão do turbo que está no pnpm-lock.yaml do repositório.
ARG TURBO_VERSION=2.11.9
RUN npm install -g turbo@${TURBO_VERSION}

COPY . .

# "web" é o campo name do apps/web/package.json.
# Gera /app/out com json/ (só package.json), full/ (código) e o lockfile podado.
RUN turbo prune web --docker

# ============================================
# Stage 3: builder (instala as dependências e builda o Next.js)
# ============================================
FROM base AS builder

# 3.1 Dependências primeiro: só reinstala quando elas mudam.
COPY --from=prepare /app/out/json/ .
COPY --from=prepare /app/out/pnpm-lock.yaml ./pnpm-lock.yaml
COPY pnpm-workspace.yaml .npmrc* ./

RUN --mount=type=cache,target=/pnpm/store \
    pnpm install --frozen-lockfile --store-dir /pnpm/store

# 3.2 Código-fonte e build.
COPY --from=prepare /app/out/full/ .

# NODE_ENV=production só DEPOIS da instalação, senão o pnpm pularia as
# devDependencies (TypeScript, Tailwind) que o build precisa.
ENV NODE_ENV=production

# O Next.js coleta telemetria anônima. Descomente para desativar no build.
# ENV NEXT_TELEMETRY_DISABLED=1

RUN pnpm turbo run build --filter=web

# ============================================
# Stage 4: runner (só o necessário para rodar)
# ============================================
FROM node:${NODE_VERSION} AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

# Descomente para desativar a telemetria em runtime.
# ENV NEXT_TELEMETRY_DISABLED=1

# Arquivos públicos do web
COPY --from=builder --chown=node:node /app/apps/web/public ./apps/web/public

# Permissão correta para o cache de prerender
RUN mkdir -p apps/web/.next && chown node:node apps/web/.next

# Saída standalone do Next.js (reduz o tamanho da imagem)
# https://nextjs.org/docs/app/api-reference/config/next-config-js/output
COPY --from=builder --chown=node:node /app/apps/web/.next/standalone ./
COPY --from=builder --chown=node:node /app/apps/web/.next/static ./apps/web/.next/static

# Para manter o cache de fetch gerado no build disponível na inicialização,
# descomente esta linha:
# COPY --from=builder --chown=node:node /app/apps/web/.next/cache ./apps/web/.next/cache

# Usuário sem root, por segurança
USER node

EXPOSE 3000

# No monorepo o server.js fica dentro de apps/web
CMD ["node", "apps/web/server.js"]