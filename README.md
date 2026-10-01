# AccountFlow Frontend

AccountFlow is a React frontend for the FastAPI user/account service in the sibling `FastAPI_notification_backend` folder. It provides registration, JWT authentication, account profile management, and account deletion in a polished, responsive SaaS-style interface.

The distinctive **Email Activity** page explains the backend’s asynchronous lifecycle email architecture without presenting unsupported notification data as real history.

## Tech stack

- React + Vite (JavaScript)
- React Router
- Axios
- Tailwind CSS

## Project structure

```text
src/
├── api/             # Central Axios instance and API modules
├── components/      # Reusable UI, navigation, modal, and route guard
├── context/         # Authentication state and account synchronization
├── hooks/           # `useAuth` convenience hook
├── pages/           # Route-level pages
└── utils/           # Storage, formatting, and error helpers
```

## Install and run

1. Install Node.js 20 or later.
2. In this folder, install dependencies:

   ```bash
   npm install
   ```

3. Copy `.env.example` to `.env`.
4. Start the FastAPI backend and its required services. Its default URL is `http://localhost:8080`.
5. Start the frontend:

   ```bash
   npm run dev
   ```

6. Open the local Vite URL printed in the terminal (normally `http://localhost:5173`).

## Environment variables

```env
VITE_API_URL=http://localhost:8080
```

`VITE_API_URL` must point to the FastAPI backend root, without `/api/v1` appended. The API modules add the versioned paths.

## Frontend routes

| Route | Purpose |
| --- | --- |
| `/login` | Sign in with username and password |
| `/register` | Create an account |
| `/dashboard` | Authenticated account overview |
| `/profile` | View and edit username/email |
| `/security` | Current session and account deletion |
| `/email-activity` | Lifecycle email capability and architecture |

All routes other than `/login` and `/register` require an authenticated session.

## Authentication flow

1. The registration page sends JSON to `POST /api/v1/users`.
2. The login page sends `application/x-www-form-urlencoded` credentials to `POST /api/v1/token/access`, matching FastAPI’s `OAuth2PasswordRequestForm` requirement.
3. The returned `access_token` is persisted in browser local storage for the frontend session architecture.
4. Axios automatically sends `Authorization: Bearer <token>` for authenticated calls.
5. The AuthContext fetches `GET /api/v1/users` to establish the current account, clears local state on an unauthorized response, and route guards redirect unauthenticated users to sign in.

## API integration

The frontend uses only the endpoints exposed by the current backend:

| Method | Path | Request | Authentication |
| --- | --- | --- | --- |
| `POST` | `/api/v1/users` | JSON: `username`, `email`, `password` | No |
| `POST` | `/api/v1/token/access` | Form fields: `username`, `password` | No |
| `GET` | `/api/v1/users` | — | Bearer token |
| `PATCH` | `/api/v1/users` | JSON with at least one of `username`, `email` | Bearer token |
| `DELETE` | `/api/v1/users` | JSON: `password` | Bearer token |

The backend defaults to CORS origins, methods, and headers of `*`, with credentials enabled. Restrict origins for production deployment.

## Current Email Activity limitation

The backend queues lifecycle emails for account creation, account updates, and account deletion through Kafka/FastStream and SMTP/MailDev. It **does not expose notification CRUD, delivery history, delivery status, retries, a DLQ, or notification tracking**.

For that reason, Email Activity intentionally shows lifecycle event capability and a static architecture diagram. It does not fabricate delivery records, statuses, timestamps, event IDs, or notification history.

## Future notification tracking enhancement

When the backend later exposes persisted notification events (for example, event ID, lifecycle type, timestamps, processing/delivery state, error reason, and retry count), the Email Activity page can be extended with a real API-backed timeline. Until then, the current design remains truthful to the backend contract.
