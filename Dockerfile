# syntax=docker/dockerfile:1

# Stage 1: Base image from Nexus
FROM 10.100.19.15:1009/node:20-alpine AS base
WORKDIR /app

# Stage 2: Install dependencies
FROM base AS deps
RUN apk add --no-cache libc6-compat

COPY package.json package-lock.json* ./
COPY .npmrc ./

RUN npm ci --ignore-scripts
RUN npm rebuild

RUN rm -f .npmrc

# Stage 3: Build the application
FROM base AS builder
WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY . .

ENV NEXT_TELEMETRY_DISABLED=1
ENV NODE_ENV=production

RUN npm run build

# Stage 4: Production runner
FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

RUN apk add --no-cache wget curl libc6-compat

RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs

COPY --from=builder --chown=nextjs:nodejs /app/package.json ./package.json
COPY --from=builder --chown=nextjs:nodejs /app/package-lock.json ./package-lock.json
COPY --from=builder --chown=nextjs:nodejs /app/next.config.* ./
COPY --from=builder --chown=nextjs:nodejs /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next ./.next
COPY --from=builder --chown=nextjs:nodejs /app/node_modules ./node_modules

USER nextjs

EXPOSE 1001

ENV PORT=1001
ENV HOSTNAME="0.0.0.0"

CMD ["npm", "run", "start"]