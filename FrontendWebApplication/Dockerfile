# syntax=docker/dockerfile:1

# ===========
# 1) Build stage: compile React app
# ===========
FROM node:18-alpine AS build
WORKDIR /app

# Install dependencies first (better layer caching)
COPY package.json package-lock.json* yarn.lock* .npmrc* ./
RUN \
  if [ -f package-lock.json ]; then npm ci; \
  elif [ -f yarn.lock ]; then yarn install --frozen-lockfile; \
  else npm install; fi

# Copy source
COPY . .

# Build react app (env can be passed at build time for public vars)
# REACT_APP_* vars are baked into the build output if provided during build
ARG REACT_APP_API_BASE_URL=http://localhost:8000
ARG REACT_APP_SITE_URL=http://localhost:3000
ENV REACT_APP_API_BASE_URL=${REACT_APP_API_BASE_URL}
ENV REACT_APP_SITE_URL=${REACT_APP_SITE_URL}

RUN npm run build

# ===========
# 2) Runtime stage: Nginx to serve static files
# ===========
FROM nginx:1.25-alpine AS runtime
# Remove default server and add our nginx config
RUN rm -f /etc/nginx/conf.d/default.conf
COPY nginx.conf /etc/nginx/conf.d/app.conf

# Copy build artifacts
COPY --from=build /app/build /usr/share/nginx/html

# Non-root (optional) - keep nginx default user for simplicity
EXPOSE 3000
# Healthcheck based on Nginx serving index.html
HEALTHCHECK --interval=30s --timeout=3s --start-period=10s --retries=3 \
  CMD wget -qO- http://localhost:3000/ || exit 1

CMD ["nginx", "-g", "daemon off;"]
