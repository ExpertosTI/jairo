FROM node:20-alpine AS base
RUN npm install -g pnpm@9.0.0 turbo

# 1. Builder
FROM base AS builder
RUN apk add --no-cache libc6-compat
WORKDIR /app
COPY . .
RUN pnpm install --no-frozen-lockfile
RUN pnpm turbo build --filter=api...

# 2. Runner: Independencia total del monorepo para ejecución estable
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production

# Copiamos solo el código compilado de la API (que ya incluye el esquema interno)
COPY --from=builder /app/apps/api/package.json ./package.json
COPY --from=builder /app/apps/api/drizzle.config.ts ./drizzle.config.ts
COPY --from=builder /app/apps/api/src ./src
COPY --from=builder /app/apps/api/dist ./dist

# Instalación de producción limpia (Sin symlinks rotos)
RUN pnpm install --prod --no-frozen-lockfile

# Seguridad
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nestjs && \
    chown -R nestjs:nodejs /app

USER nestjs

EXPOSE 3001
CMD ["node", "dist/main"]
