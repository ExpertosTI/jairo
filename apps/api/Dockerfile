FROM node:20-alpine AS base
RUN npm install -g pnpm@9.0.0 turbo

# 1. Builder
FROM base AS builder
RUN apk add --no-cache libc6-compat
WORKDIR /app
COPY . .
RUN pnpm install --no-frozen-lockfile
RUN pnpm turbo build --filter=api...

# 2. Runner: Instalación limpia de producción para evitar symlinks rotos
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nestjs
USER nestjs

# Copiamos solo los archivos de configuración y el build
COPY --from=builder /app/apps/api/package.json ./package.json
COPY --from=builder /app/apps/api/dist ./dist
COPY --from=builder /app/pnpm-workspace.yaml ./pnpm-workspace.yaml
COPY --from=builder /app/packages/database/package.json ./packages/database/package.json
COPY --from=builder /app/packages/database/schema.ts ./packages/database/schema.ts

# Instalamos SOLO dependencias de producción (Esto crea los symlinks correctos)
RUN pnpm install --prod --no-frozen-lockfile

EXPOSE 3001
CMD ["node", "dist/main"]
