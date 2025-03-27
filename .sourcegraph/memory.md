# Project Memory

## Commands
- Build: `npm run start` (full stack), `npm run build:frontend` (frontend only)
- Test: Backend: `cd backend && npm run test`, Frontend: `cd frontend && npm test -- --testPathPattern=ComponentName` (single test)
- Lint: Not explicitly defined, but could use standard ESLint setup

## Code Style
- React: Functional components with hooks preferred
- Naming: PascalCase for components, camelCase for functions/variables
- Imports: Group React/libraries first, then components, then styles
- CSS: Component-scoped CSS files with matching names (Component.jsx, Component.css)
- Testing: Jest + React Testing Library (frontend), Jest + Supertest (backend)
- Target: 80%+ code coverage

## Tech Stack
- Frontend: React, React Router, Framer Motion, Vite
- Backend: Express.js, PostgreSQL, TypeORM
- ML Service: Python (likely Flask or FastAPI)
- Authentication: JWT
- Testing: Jest, React Testing Library, Cypress (E2E)
- CI/CD: Appears to use Docker for containerization