# React Dashboard Frontend

Production‑ready React frontend for the dashboard application.

Key features:
- JWT login with protected routes
- Sidebar navigation with active highlighting
- CRUD for Users and Reports with validation, pagination, search, and feedback
- Charts using Chart.js and Recharts (API‑driven)
- Axios API layer with interceptors and error normalization
- Responsive modular layout
- Docker image served via Nginx with SPA routing support

## Requirements
- Node.js 18+
- Backend API reachable via `REACT_APP_API_BASE_URL` (CORS enabled on backend)

## Environment variables
Copy `.env.example` to `.env` and adjust:
- REACT_APP_API_BASE_URL
- REACT_APP_SITE_URL
- REACT_APP_DEFAULT_THEME

## Scripts
- npm start — dev server on port 3000 (includes OpenSSL legacy provider workaround)
- npm test — run unit/component tests in CI mode
- npm run build — production build
- npm run lint — run eslint
- npm run cy:open — open Cypress runner
- npm run cy:run — run Cypress e2e tests headlessly
- npm run test:e2e — start app and run Cypress e2e (uses start-server-and-test)

CI tips:
- Use `npm ci` before build for deterministic installs.

## Development
1. `npm install`
2. `cp .env.example .env` and set REACT_APP_API_BASE_URL to your backend (default http://localhost:8000)
3. `npm start` then open http://localhost:3000

## Testing

Unit/Component (Jest + RTL):
- npm test

End-to-End (Cypress):
- Start dev server in one terminal: npm start
- In another terminal:
  - Interactive runner: npm run cy:open
  - Headless: npm run cy:run
- One-shot in CI (headless, non-interactive): npm run test:e2e

Notes:
- E2E tests mock backend APIs via cy.intercept; no backend is required for running Cypress locally/CI.
- Tests cover: login/logout, protected routes, sidebar navigation, CRUD UI for users/reports, charts rendering, form validation, and error messaging.

## API integration and Auth
- Base URL via `REACT_APP_API_BASE_URL`.
- JWT token stored in localStorage under `token` and attached as `Authorization: Bearer <token>`.
- Expected endpoints: POST /login, CRUD for `/users` and `/reports`, GET `/charts/data`.
- Handle CORS in backend accordingly.

## Docker
Build:
- docker build -t dashboard-frontend --build-arg REACT_APP_API_BASE_URL=http://localhost:8000 .

Troubleshooting build error "(0 , _schemaUtils.validate) is not a function":
- Root cause: schema-utils v4+ exposes validate differently; terser-webpack-plugin@5 expects v3 API.
- Resolution in this repo:
  - package.json "overrides" explicitly pins: ajv@6.12.6, ajv-keywords@3.5.2, schema-utils@3.3.0, terser-webpack-plugin@5.3.10, and targets nested packages to force schema-utils@3.
  - .npmrc sets legacy-peer-deps=true to avoid peer resolution conflicts in CI.
- Force a clean install so overrides take effect:
  - rm -rf node_modules package-lock.json
  - npm cache clean --force
  - npm ci --legacy-peer-deps
- The repo includes scripts/patch-lock.js which coerces package-lock to compatible versions automatically on prepare.
- You can verify resolved versions:
  - npm run check:tooling
- Then build:
  - npm run build

Auto-fix:
- The script scripts/fix-tooling.js runs during prebuild to enforce CRA5-compatible versions (terser-webpack-plugin@5, schema-utils@3, ajv@6, ajv-keywords@3).
- If it reports a mismatch even after attempt, run:
  - rm -rf node_modules package-lock.json && npm cache clean --force
  - npm ci --legacy-peer-deps
  - npm run build

Run:
- docker run -p 3000:3000 dashboard-frontend

Nginx serves on port 3000; SPA routing handled in nginx.conf.

## Project structure
- src/auth — auth provider (AuthContext, login/logout, token handling)
- src/layout — dashboard shell and sidebar (DashboardLayout)
- src/pages — Login, Users, Reports, Charts
- src/services — API client (axios with interceptors)
- src/utils — utility placeholders

## Notes
- Backend must provide JWT auth and secure CRUD endpoints.
- Ensure HTTPS and secure cookie/storage policies in production environments as needed.
