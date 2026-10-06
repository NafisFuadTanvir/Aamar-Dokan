# ─────────────────────────────────────────────────────────────────────────────
# Multi-stage Dockerfile for Amar Dokan (Next.js 14 + Prisma + PostgreSQL)
# Optimized for minimal footprint and maximum security
# ─────────────────────────────────────────────────────────────────────────────

# ── Stage 1: Dependencies ────────────────────────────────────────────────────
FROM node:20-alpine AS deps
# libc6-compat + openssl: Prisma & general compat
# python3 make g++: required by node-gyp to compile argon2 native addon for musl/Alpine
RUN apk add --no-cache libc6-compat openssl python3 make g++
WORKDIR /app

COPY package.json package-lock.json ./
RUN npm ci --legacy-peer-deps

# ── Stage 2: Builder ─────────────────────────────────────────────────────────
FROM node:20-alpine AS builder
RUN apk add --no-cache libc6-compat openssl
WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Generate Prisma Client with Alpine musl target
RUN npx prisma generate

# Build Next.js in standalone mode
ENV NEXT_TELEMETRY_DISABLED=1
ENV NODE_ENV=production
RUN npm run build

# ── Stage 3: Runner ──────────────────────────────────────────────────────────
FROM node:20-alpine AS runner
WORKDIR /app

RUN apk add --no-cache libc6-compat openssl dos2unix

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copy static assets and standalone server
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder /app/node_modules/@prisma ./node_modules/@prisma
# Prisma CLI (v5 — matches project deps) for the entrypoint db push
COPY --from=builder /app/node_modules/.bin/prisma ./node_modules/.bin/prisma
COPY --from=builder /app/node_modules/prisma ./node_modules/prisma
# argon2 native addon — compiled for linux/musl in the deps stage
COPY --from=builder /app/node_modules/argon2 ./node_modules/argon2
COPY --from=builder /app/node_modules/node-gyp-build ./node_modules/node-gyp-build

# Create an entrypoint startup script
COPY docker-entrypoint.sh ./
RUN dos2unix docker-entrypoint.sh && chmod +x docker-entrypoint.sh

RUN chown -R nextjs:nodejs /app

USER nextjs

EXPOSE 3000

ENTRYPOINT ["./docker-entrypoint.sh"]
CMD ["node", "server.js"]
