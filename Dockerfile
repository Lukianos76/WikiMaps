# syntax=docker/dockerfile:1

# ─────────────────────────────────────────────
# Stage 1 — Build (Next.js static export → /out)
# ─────────────────────────────────────────────
FROM node:24-alpine AS builder
WORKDIR /app

# Cacheable dependency layer
COPY package.json package-lock.json ./
RUN npm ci

# Build
COPY . .
RUN npm run build

# ─────────────────────────────────────────────
# Stage 2 — Serve (Nginx serves the static build)
# ─────────────────────────────────────────────
FROM nginx:alpine AS runner
COPY --from=builder /app/out /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
