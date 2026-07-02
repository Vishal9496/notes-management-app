# Marginalia — Notes Management Frontend

React 19 + Vite frontend for your Spring Boot Notes Management backend. Backend untouched.

## Run

npm install
npm run dev

Opens on http://localhost:5173. Backend must be running on http://localhost:8080.

If your backend doesn't already allow CORS from http://localhost:5173, add that origin to your Spring Security CORS config.

## Build

npm run build

Output in dist/.

## Structure

- src/services/api.js — axios instance, attaches Authorization: Bearer <token> from localStorage, redirects to /login on 401.
- src/services/auth.js — register/login/logout, token storage, expiry check.
- src/services/notes.js — GET/POST/PUT/DELETE /notes.
- src/context/AuthContext.jsx — auth state, auto-login on refresh if token valid.
- src/context/ToastContext.jsx — toast queue.
- src/hooks/useAuth.js, useTheme.js — theme persists to localStorage, respects OS preference on first load.
- src/components/ — Navbar, Sidebar, SearchBar, NoteCard, NoteModal, ConfirmDialog, EmptyState, Loader (spinner + skeletons), Toast, ProtectedRoute.
- src/pages/ — Login, Register, Dashboard, Profile.

## Backend contract assumptions

- POST /auth/login returns { token, name, email } (adjust src/services/auth.js if your AuthResponse differs)
- Note objects have: id, title, description, createdAt, updatedAt
- 401 responses trigger auto-logout and redirect to /login

Adjust field names in src/services/auth.js and notes.js if your DTOs differ.
