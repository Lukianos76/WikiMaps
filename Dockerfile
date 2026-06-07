# syntax=docker/dockerfile:1

# ─────────────────────────────────────────────
# Stage 1 — Build (export statique Next.js → /out)
# ─────────────────────────────────────────────
FROM node:20-alpine AS builder
WORKDIR /app

# Couche de dépendances cacheable
COPY package.json package-lock.json ./
RUN npm ci

# Build
COPY . .
RUN npm run build

# ─────────────────────────────────────────────
# Stage 2 — Serve (Nginx sert le build statique)
# ─────────────────────────────────────────────
FROM nginx:alpine AS runner
COPY --from=builder /app/out /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
