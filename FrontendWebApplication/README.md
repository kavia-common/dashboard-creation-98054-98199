# React Dashboard Frontend

This is the production-ready React frontend for the dashboard application. It provides:
- JWT login and protected routes
- Sidebar navigation with active highlighting
- CRUD for Users and Reports with validation, pagination, search, and feedback
- Charts using Chart.js and Recharts with API-driven data
- Axios-based API layer with error handling
- Responsive modular layout
- Docker image served via Nginx

## Requirements
- Node.js 18+
- Backend API reachable via `REACT_APP_API_BASE_URL`

## Environment variables
Copy `.env.example` to `.env` and adjust:
- REACT_APP_API_BASE_URL
- REACT_APP_SITE_URL
- REACT_APP_DEFAULT_THEME

## Scripts
- npm start — dev server on port 3000
- npm test — run tests in CI mode
- npm run build — production build

In CI environments, prefer:
- npm ci
before running build to ensure dependencies (like react-router-dom) are installed deterministically.

## Development
1. `npm install`
2. `cp .env.example .env` and set correct API base URL
3. `npm start`

## API integration
The API base URL is configured via `REACT_APP_API_BASE_URL`. JWT token is stored in localStorage and attached as `Authorization: Bearer <token>`.

## Docker
Build:
- docker build -t dashboard-frontend --build-arg REACT_APP_API_BASE_URL=http://localhost:8000 .

Run:
- docker run -p 3000:3000 dashboard-frontend

Nginx is configured for SPA routing and serves on port 3000.

## Project structure
- src/auth — auth provider
- src/layout — dashboard shell and sidebar
- src/pages — Login, Users, Reports, Charts
- src/services — API client

## Notes
- This project expects the backend to expose endpoints: POST /login, GET/POST/PUT/DELETE for /users and /reports, GET /charts/data.
- Handle CORS on the backend accordingly.
