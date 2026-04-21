FROM node:20-alpine AS base
RUN npm install -g pnpm@9.0.0 turbo

# 1. Builder: Contexto completo para evitar errores de workspace
FROM base AS builder
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Copiamos todo el monorepo (fuente de verdad)
COPY . .

# Instalación robusta ignorando lockfile corrupto si es necesario
RUN pnpm install --no-frozen-lockfile

# Build enfocado
RUN pnpm turbo build --filter=api...

# 2. Runner: Imagen ligera de producción
FROM base AS runner
WORKDIR /app

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nestjs
USER nestjs

# Copiamos solo lo necesario para correr la app
COPY --from=builder /app/apps/api/package.json ./package.json
COPY --from=builder /app/apps/api/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/apps/api/node_modules ./apps/api/node_modules

EXPOSE 3001
CMD ["node", "dist/main"]
