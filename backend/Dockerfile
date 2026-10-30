# ========================================================
# 1. Build Stage (TypeScript Compilation & Prisma Generate)
# ========================================================
FROM node:20-alpine AS builder

WORKDIR /app

# Install OpenSSL & libc6-compat (diperlukan untuk Prisma Engine di Alpine)
RUN apk add --no-cache openssl libc6-compat

# Copy package manifest & Prisma schema
COPY package*.json ./
COPY prisma ./prisma/

# Install semua dependensi (termasuk devDependencies)
RUN npm ci

# Generate Prisma Client
RUN npx prisma generate

# Copy tsconfig dan source code
COPY tsconfig.json ./
COPY src ./src/

# Compile TypeScript ke folder dist/
RUN npm run build

# ========================================================
# 2. Production Runner Stage (Lightweight Image)
# ========================================================
FROM node:20-alpine AS runner

WORKDIR /app

# Install runtime dependencies (OpenSSL untuk Prisma, curl untuk healthcheck)
RUN apk add --no-cache openssl libc6-compat curl

ENV NODE_ENV=production
ENV PORT=5000

# Copy file package dan schema
COPY package*.json ./
COPY prisma ./prisma/

# Install dependencies produksi serta tsx & prisma untuk kebutuhan auto-seed/migrate
RUN npm ci --omit=dev && npm install --no-save tsx@4.19.2 prisma@5.22.0

# Copy hasil build dan Prisma client dari tahap builder
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules/@prisma ./node_modules/@prisma
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma

# Copy dan berikan izin eksekusi script entrypoint
COPY docker-entrypoint.sh ./
RUN sed -i 's/\r$//' ./docker-entrypoint.sh && chmod +x ./docker-entrypoint.sh

EXPOSE 5000

ENTRYPOINT ["./docker-entrypoint.sh"]
CMD ["node", "dist/server.js"]
