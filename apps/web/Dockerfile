# Frontend — Vite/React build served by nginx. Built from the monorepo root
# context (docker compose sets context: . , dockerfile: apps/web/Dockerfile).
FROM node:20-bookworm-slim AS build
WORKDIR /app

COPY package*.json ./
COPY apps/api/package.json apps/api/
COPY apps/web/package.json apps/web/
RUN npm ci

COPY . .
# Builds with VITE_API_BASE_URL=/api so the SPA calls the API on the same origin.
RUN npm run build:web:prod

# --- Runtime: static files on nginx ---
FROM nginx:1.27-alpine AS runner
COPY apps/web/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/apps/web/dist /usr/share/nginx/html
EXPOSE 80
