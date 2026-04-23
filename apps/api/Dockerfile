FROM node:20-alpine AS base
RUN npm install -g pnpm@9.0.0 turbo

# 1. Builder
FROM base AS builder
RUN apk add --no-cache libc6-compat
WORKDIR /app
COPY . .
RUN pnpm install --no-frozen-lockfile
RUN pnpm turbo build --filter=api...

# 2. Runner
FROM base AS runner
WORKDIR /app/apps/api

ENV NODE_ENV=production

# Copiamos la API completa desde el builder
COPY --from=builder /app/apps/api ./

# Instalación de producción limpia
RUN pnpm install --prod --no-frozen-lockfile

# Seguridad
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nestjs && \
    chown -R nestjs:nodejs /app

USER nestjs

EXPOSE 3001
# Apuntamos a la ruta real de NestJS en dist
CMD ["node", "dist/main"]
