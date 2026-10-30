# ========================================================
# 1. Base Stage
# ========================================================
FROM node:20-alpine AS base

# Install libc6-compat (kompatibilitas Alpine Linux)
RUN apk add --no-cache libc6-compat

WORKDIR /app

# ========================================================
# 2. Dependencies Stage
# ========================================================
FROM base AS deps

COPY package*.json ./
RUN npm ci

# ========================================================
# 3. Builder Stage (Next.js Standalone Build)
# ========================================================
FROM base AS builder

COPY --from=deps /app/node_modules ./node_modules
COPY . .

ENV NEXT_TELEMETRY_DISABLED=1
ENV NODE_ENV=production

# Compile Next.js dengan output standalone
RUN npm run build

# ========================================================
# 4. Production Runner Stage (Minimal Image Size)
# ========================================================
FROM base AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

# Buat non-root user untuk keamanan container
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs

# Copy aset publik dan hasil output standalone
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

CMD ["node", "server.js"]
