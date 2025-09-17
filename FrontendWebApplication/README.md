# Kavia Dashboard Frontend

React-based dashboard UI with authentication, protected routes, CRUD for Users and Reports, and charts using Recharts.

## Quick start

1. Copy env:
   cp .env.example .env
   Edit REACT_APP_API_BASE_URL to point to the backend (default http://localhost:8000).

2. Install and run:
   npm install
   npm start

3. Build:
   npm run build

## Features
- JWT login, persistent session, logout
- Protected routes with React Router v6
- Sidebar navigation (Overview, Reports, Users)
- CRUD screens with validation and feedback
- Search and pagination
- Charts: Line, Bar, Pie (Recharts)
- Accessible loading and error messages
- Responsive, modular layout and theme toggle (light/dark)

## Environment variables
- REACT_APP_API_BASE_URL: Backend API base URL
- REACT_APP_SITE_URL: Used for auth redirects when needed

## Structure
- src/services/api.js: API client and JWT storage
- src/context/AuthContext.js: Auth state
- src/routes/ProtectedRoute.js: Route guard
- src/layout/DashboardLayout.js: Shell with sidebar/topbar
- src/pages/LoginPage.js: Login
- src/pages/DashboardHome.js: Overview with charts
- src/pages/ReportsPage.js: Reports CRUD
- src/pages/UsersPage.js: Users CRUD

## Notes
- Backend endpoints expected:
  - POST /auth/login -> { access_token }
  - GET /dashboard -> { metrics: {users, reports} }
  - GET /charts/data -> { line, bar, pie }
  - /users and /reports: GET (with ?page, page_size, q), POST, PUT /:id, DELETE /:id
- Add Authorization: Bearer <token> header is handled by the client automatically.

