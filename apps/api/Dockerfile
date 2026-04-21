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
WORKDIR /app

ENV NODE_ENV=production

# Copiamos archivos como root para poder instalar
COPY --from=builder /app/apps/api/package.json ./package.json
COPY --from=builder /app/apps/api/dist ./dist
COPY --from=builder /app/pnpm-workspace.yaml ./pnpm-workspace.yaml
COPY --from=builder /app/packages/database/package.json ./packages/database/package.json
COPY --from=builder /app/packages/database/schema.ts ./packages/database/schema.ts

# Instalamos dependencias como root
RUN pnpm install --prod --no-frozen-lockfile

# Creamos el usuario y cambiamos permisos AL FINAL
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nestjs && \
    chown -R nestjs:nodejs /app

USER nestjs

EXPOSE 3001
CMD ["node", "dist/main"]
