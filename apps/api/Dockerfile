# ============================================
# Dockerfile da api (NestJS) em monorepo Turborepo + pnpm
#
# Faça o build SEMPRE a partir da raiz do repositório:
#   docker build -f apps/api/Dockerfile -t portifolio-api .
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
# Stage 2: prepare (turbo prune isola só o que a api precisa)
# ============================================
FROM base AS prepare

# Mantenha igual à versão do turbo que está no pnpm-lock.yaml do repositório.
ARG TURBO_VERSION=2.11.10
RUN npm install -g turbo@${TURBO_VERSION}

COPY . .

# "api" é o campo name do apps/api/package.json.
# Gera /app/out com json/ (só package.json), full/ (código) e o lockfile podado.
RUN turbo prune api --docker

# ============================================
# Stage 3: builder (instala tudo e compila com o nest build)
# ============================================
FROM base AS builder

# Dependências primeiro: só reinstala quando elas mudam.
COPY --from=prepare /app/out/json/ .
COPY --from=prepare /app/out/pnpm-lock.yaml ./pnpm-lock.yaml
COPY pnpm-workspace.yaml .npmrc* ./

# sharing=locked: este estágio e o prod-deps usam o mesmo cache do pnpm
# e podem rodar em paralelo.
RUN --mount=type=cache,target=/pnpm/store,sharing=locked \
    pnpm install --frozen-lockfile --store-dir /pnpm/store

# Código-fonte e build (o nest build gera apps/api/dist).
COPY --from=prepare /app/out/full/ .

RUN pnpm turbo run build --filter=api

# ============================================
# Stage 4: prod-deps (só as dependências de produção)
# Fica de fora: CLI do Nest, TypeScript, Vitest, Prisma CLI, oxlint.
# ============================================
FROM base AS prod-deps

COPY --from=prepare /app/out/json/ .
COPY --from=prepare /app/out/pnpm-lock.yaml ./pnpm-lock.yaml
COPY pnpm-workspace.yaml .npmrc* ./

RUN --mount=type=cache,target=/pnpm/store,sharing=locked \
    pnpm install --frozen-lockfile --prod --store-dir /pnpm/store

# ============================================
# Stage 5: runner (só o necessário para rodar)
# ============================================
FROM node:${NODE_VERSION} AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=3001

# Os arquivos abaixo ficam somente leitura: o app não escreve em disco.

# package.json da api: o "type": "module" faz o Node tratar dist/*.js como ESM.
COPY --from=builder /app/apps/api/package.json ./apps/api/package.json

# No pnpm, o node_modules do app só tem links para o da raiz (.pnpm),
# então os dois precisam ir juntos, na mesma estrutura.
COPY --from=prod-deps /app/node_modules ./node_modules
COPY --from=prod-deps /app/apps/api/node_modules ./apps/api/node_modules

# Código compilado (inclui dist/prisma/contract.json)
COPY --from=builder /app/apps/api/dist ./apps/api/dist

# Usuário sem root, por segurança
USER node

EXPOSE 3001

CMD ["node", "apps/api/dist/main.js"]