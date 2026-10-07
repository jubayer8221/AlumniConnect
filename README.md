# AlumniConnect

AlumniConnect is a React, TypeScript, and Vite client for the Alumni Management System. The authenticated API-backed workflows cover alumni records and events. Notices, reports, privacy settings, and other endpoints not present in the provided API contract continue to use the existing local mock services.

## Requirements

- Node.js 20 or later
- npm
- The .NET 10 API running locally at `https://localhost:7084`

## Install and Run

```bash
npm install
npm run dev
```

Vite serves the app at `http://localhost:5173`. The default `.env` points to `https://localhost:7084/api`; `.env.example` is the checked-in template. Set `VITE_DATA_SOURCE=mock` to use seeded local data instead of the API.

For local HTTPS development, trust the .NET development certificate:

```bash
dotnet dev-certs https --trust
```

If the certificate is not trusted, the browser may block requests to the API.

## Authentication

In API mode, credentials are managed by the backend. On successful login, the client stores the returned token as `auth_token` and the raw user payload as `auth_user`. Axios attaches the Bearer token to API requests. A 401 clears both values and redirects to `/login`.

In mock mode, the seeded administrator is `admin` / `123456`. Seeded alumni use their username and the mock password `123456`.

The login API must include a `role` field (`ADMIN` or `ALUMNI`) in addition to the response fields shown in the API contract. The UI uses that role for authorization and role-specific navigation.

## Data Fallback

Alumni and event reads/writes fall back to the existing local mock services when the API is unavailable (network failure, 5xx, or an endpoint not included in the supplied contract). Client and backend 4xx validation/authentication errors are not hidden by fallback. The local mock fallback is browser-local and is not synchronized with the server.

## Checks

```bash
npm run typecheck
npm run lint
npm run build
```
