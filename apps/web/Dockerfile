FROM node:20-alpine AS base
RUN npm install -g pnpm@9.0.0 turbo

# 1. Builder
FROM base AS builder
RUN apk add --no-cache libc6-compat
WORKDIR /app
COPY . .
RUN pnpm install --no-frozen-lockfile
RUN pnpm turbo build --filter=web...

# 2. Runner
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs
USER nextjs

COPY --from=builder /app/apps/web/public ./apps/web/public
COPY --from=builder /app/apps/web/.next/standalone ./
COPY --from=builder /app/apps/web/.next/static ./apps/web/.next/static

EXPOSE 3000
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

# En standalone de Next.js, las dependencias ya vienen empaquetadas en node_modules dentro de standalone
# Pero por seguridad con PNPM, nos aseguramos de que el servidor corra el comando correcto
CMD ["node", "apps/web/server.js"]
