# Build stage
FROM node:18-alpine AS build
WORKDIR /app
ENV CI=true
COPY package.json package-lock.json* yarn.lock* pnpm-lock.yaml* .npmrc* ./
RUN set -eux; \
    if [ -f package-lock.json ]; then npm ci --legacy-peer-deps; \
    elif [ -f yarn.lock ]; then yarn install --frozen-lockfile; \
    elif [ -f pnpm-lock.yaml ]; then corepack enable && pnpm i --frozen-lockfile; \
    else npm i --legacy-peer-deps; fi
COPY . .
ARG REACT_APP_API_BASE_URL
ARG REACT_APP_SITE_URL
ARG REACT_APP_DEFAULT_THEME
ENV REACT_APP_API_BASE_URL=$REACT_APP_API_BASE_URL
ENV REACT_APP_SITE_URL=$REACT_APP_SITE_URL
ENV REACT_APP_DEFAULT_THEME=$REACT_APP_DEFAULT_THEME
RUN npm run build

# Run stage
FROM nginx:1.25-alpine
COPY --from=build /app/build /usr/share/nginx/html
# Nginx config to support SPA routing
RUN rm -f /etc/nginx/conf.d/default.conf
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 3000
CMD ["nginx", "-g", "daemon off;"]
