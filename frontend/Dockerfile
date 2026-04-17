# ─────────────────────────────────────────────────────────────────────────────
# Stage 1 — Build
#   Installs dependencies and produces the optimized static dist/ bundle.
# ─────────────────────────────────────────────────────────────────────────────
FROM node:18-alpine AS builder

WORKDIR /app

# Copy manifests first for better layer caching — dependencies only
# reinstall when package.json / package-lock.json actually change.
COPY package.json package-lock.json* ./

RUN npm ci --silent

# Copy the rest of the source and build
COPY . .

RUN npm run build

# ─────────────────────────────────────────────────────────────────────────────
# Stage 2 — Serve
#   Copies only the compiled static assets into a minimal Nginx image.
#   No Node.js, no source code, no node_modules in the final image.
# ─────────────────────────────────────────────────────────────────────────────
FROM nginx:stable-alpine AS runner

# Remove the default Nginx welcome page
RUN rm -rf /usr/share/nginx/html/*

# Copy compiled assets from the builder stage
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy custom Nginx config (SPA routing + port 3000)
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 3000

CMD ["nginx", "-g", "daemon off;"]
