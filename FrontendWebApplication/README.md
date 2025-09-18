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
- npm start — dev server on port 3000
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
  If you encounter build errors related to ajv/ajv-keywords, ensure no conflicting overrides are present in package.json. This project relies on react-scripts to manage those transitive versions.

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
