# Quantity Measurement Frontend (Angular)

Angular frontend for your Spring Boot backend (`QuantityMeasurementApp-Backend`).

## Prereqs

- Java backend running on `http://localhost:8080`
- Frontend runs on **`http://localhost:5173`** (important for Google OAuth redirect)

## Run (dev)

```bash
npm install
npm start
```

Open `http://localhost:5173`.

## Configure backend URL (optional)

Edit:

- `src/app/core/config/app-config.ts`
  - `apiBaseUrl` (default `http://localhost:8080`)
  - `googleOAuthStartUrl` (default `http://localhost:8080/oauth2/authorization/google`)

## Features implemented

- **Login**: `POST /auth/login` (stores JWT in localStorage, sends `Authorization: Bearer <token>` automatically)
- **Signup**: `POST /api/v1/quantities/auth/signup`
- **Google login**: redirects to backend OAuth, then handles `/auth/callback?token=...&username=...`
- **Calculator**: `POST /api/v1/quantities/perform` (Add/Subtract/Multiply/Divide/Compare/Convert)
- **History** (protected): `GET /api/v1/quantities/history`

## Notes

- If Google OAuth fails, backend redirects to `/login?error=...` and the UI shows that message.
- Your backend already expects the SPA callback at `http://localhost:5173/auth/callback` (matches this app).

