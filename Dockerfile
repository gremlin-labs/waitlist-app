# ---- Dependencies ----
FROM oven/bun:1 AS deps
WORKDIR /app

# Copy package files
COPY package.json bun.lock ./

# Install dependencies
RUN bun install --frozen-lockfile

# ---- Builder ----
FROM oven/bun:1 AS builder
WORKDIR /app

# Copy dependencies from deps stage
COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Build the Next.js application
ENV NEXT_TELEMETRY_DISABLED=1
RUN bun run build

# ---- Runner ----
FROM oven/bun:1 AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# Create non-root user for security
RUN groupadd --system --gid 1001 nodejs && \
    useradd --system --uid 1001 --gid nodejs nextjs

# Copy package files and dependencies for running scripts (drizzle, etc.)
COPY --from=builder /app/package.json ./package.json
COPY --from=deps /app/node_modules ./node_modules

# Copy drizzle config and database schema
COPY --from=builder /app/drizzle.config.ts ./drizzle.config.ts
COPY --from=builder /app/src/db ./src/db

# Copy scripts directory for admin/management commands
COPY --from=builder /app/scripts ./scripts

# Copy public assets
COPY --from=builder /app/public ./public

# Copy standalone build output
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

# Switch to non-root user
USER nextjs

# Expose Next.js default port
EXPOSE 3000

ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

# Start the Next.js server
# The standalone server.js includes the Discord bot via instrumentation.ts
CMD ["bun", "server.js"]
