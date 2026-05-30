# Backend — NestJS + Prisma (SQLite). Built from the monorepo root context
# (docker compose sets context: . , dockerfile: apps/api/Dockerfile).
FROM node:20-bookworm-slim AS build
WORKDIR /app
RUN apt-get update && apt-get install -y --no-install-recommends openssl ca-certificates \
  && rm -rf /var/lib/apt/lists/*

# Install workspace deps first (cached unless manifests change).
COPY package*.json ./
COPY apps/api/package.json apps/api/
COPY apps/web/package.json apps/web/
RUN npm ci

# Build the API.
COPY . .
RUN npx prisma generate --schema apps/api/prisma/schema.prisma
RUN npm run build --workspace @acme/api

# --- Runtime ---
FROM node:20-bookworm-slim AS runner
WORKDIR /app/apps/api
ENV NODE_ENV=production
RUN apt-get update && apt-get install -y --no-install-recommends openssl ca-certificates \
  && rm -rf /var/lib/apt/lists/*

# node_modules is kept so the prisma CLI (migrate) and ts-node seed run at start.
COPY --from=build /app /app
RUN chmod +x /app/apps/api/docker-entrypoint.sh

EXPOSE 3000
ENTRYPOINT ["sh", "/app/apps/api/docker-entrypoint.sh"]
