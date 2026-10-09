# AccountFlow Frontend

AccountFlow is the React client for the [FastAPI Notification Backend](https://github.com/DhrithiHH/fastapi-notification-backend). It provides account registration, JWT sign-in, profile management, password-confirmed deletion, and a real notification-history timeline supplied by the backend.

The frontend does not send email itself. It displays account data and persisted lifecycle notification events returned by the FastAPI API.

**Frontend repository:** [fastapi-notification-frontend](https://github.com/DhrithiHH/fastapi-notification-frontend)

**Backend repository:** [fastapi-notification-backend](https://github.com/DhrithiHH/fastapi-notification-backend)

## Tech stack

| Area | Implemented technology |
| --- | --- |
| UI | React `^19.1.1`, React DOM `^19.1.1` |
| Build tool | Vite `^7.1.7`, `@vitejs/plugin-react` `^5.0.4` |
| Routing | React Router DOM `^7.8.2` |
| HTTP client | Axios `^1.8.4` |
| Styling | Tailwind CSS `^3.4.17`, PostCSS, Autoprefixer |
| Quality checks | ESLint `^9.32.0`, eslint-plugin-react, eslint-plugin-react-hooks |

## Features

- Registration form with client-side validation and backend error handling.
- Form-encoded JWT login matching the backend token endpoint.
- Protected application routes and session restoration through `AuthContext`.
- Dashboard based on the authenticated user's actual account information.
- Editable profile for username and email.
- Security page with password-confirmed account deletion and logout.
- Email Activity timeline backed by `GET /api/v1/notifications`.
- Status filter, refresh control, expandable event details, and loading/error/empty states.
- Responsive navigation and accessible form controls.

## Routes

| Route | Access | Purpose |
| --- | --- | --- |
| `/login` | Public | Sign in with username and password |
| `/register` | Public | Create an account |
| `/dashboard` | Protected | Account overview |
| `/profile` | Protected | View and update username/email |
| `/security` | Protected | Current session and account deletion |
| `/email-activity` | Protected | Persisted lifecycle notification history |

Unauthenticated access to protected routes redirects to `/login`.

## Authentication and API integration

The app uses one centralized Axios instance. Its request interceptor reads the stored JWT and attaches:

```http
Authorization: Bearer <access_token>
```

The login request uses `application/x-www-form-urlencoded`:

```http
POST /api/v1/token/access
username=<username>&password=<password>
```

After login, `AuthContext` fetches `GET /api/v1/users`, stores the current user, and exposes authentication state to the route guard. A `401` response while a token exists dispatches the app's unauthorized event; `AuthContext` clears token, user, and session activity before protected routes redirect to login.

| Frontend action | API call |
| --- | --- |
| Register | `POST /api/v1/users` with JSON `username`, `email`, `password` |
| Login | `POST /api/v1/token/access` with form-encoded `username`, `password` |
| Load current user | `GET /api/v1/users` |
| Update profile | `PATCH /api/v1/users` with one or both of `username`, `email` |
| Delete account | `DELETE /api/v1/users` with JSON `password` |
| Load Email Activity | `GET /api/v1/notifications` |

## Email Activity

The Email Activity page reads the authenticated user's actual notification array from `GET /api/v1/notifications`. It does not create frontend-only events.

Each timeline entry renders:

- lifecycle event type: `ACCOUNT_CREATED`, `ACCOUNT_UPDATED`, or `ACCOUNT_DELETED`;
- recipient;
- status;
- creation time;
- processing time when the backend supplies one;
- expandable details with the event UUID and all response fields.

The UI safely handles a nullable `processed_at` value as “Not processed yet.” It supports `PENDING`, `PROCESSING`, `SENT`, and `FAILED` filters, manual refresh, API-error feedback, and empty-history states.

`SENT` means the backend's current SMTP email operation succeeded. It does **not** guarantee mailbox delivery, opening, or recipient engagement.

The page also retains an architecture explanation of the backend flow—account action, PostgreSQL, Kafka, FastStream, and SMTP/MailDev—explicitly labeled as architecture rather than live telemetry.

## Local setup

### Prerequisites

- Node.js and npm.
- A running FastAPI backend at the configured API URL. For the documented Docker setup, the API is available at `http://localhost:8080`.

### Install and run

From this repository:

```powershell
npm install
Copy-Item .env.example .env
npm run dev
```

Vite prints the local URL when it starts. With the default Vite configuration, this is normally `http://localhost:5173`; no fixed port is configured in `vite.config.js`.

### Environment variable

```env
VITE_API_URL=http://localhost:8080
```

`VITE_API_URL` is the backend root URL. Do not append `/api/v1`: the API modules add versioned paths themselves.

Start the backend and its required PostgreSQL, Redis, Kafka, FastStream, and SMTP/MailDev services before exercising account and notification flows. See the backend repository README for Docker and migration instructions.

## Scripts and verification

| Command | Purpose |
| --- | --- |
| `npm run dev` | Start Vite development server |
| `npm run build` | Build a production bundle |
| `npm run lint` | Run ESLint with zero allowed warnings |
| `npm run preview` | Preview the production build |

At the documented working revision, `npm run lint` and `npm run build` were previously run successfully. The build reported **121 transformed modules**. These are recorded verification results, not a claim that they have been rerun in every clone.

Browser verification at that revision covered registration, login, dashboard, profile loading and update, Security rendering, logout, protected-route redirects, and real Email Activity data with filtering, refresh, and expandable details.

## Project structure

```text
src/
├── api/        # Axios client and auth, user, notification API modules
├── components/ # Layout, navigation, fields, buttons, modal, route guard
├── context/    # AuthContext
├── hooks/      # useAuth
├── pages/      # Login, Register, Dashboard, Profile, Security, Email Activity
└── utils/      # Storage, date formatting, API error messages
```

## Limitations

- Notification data is only as current as the backend response; the page does not provide delivery telemetry beyond backend event status.
- `SENT` is not proof of recipient inbox delivery or engagement.
- The frontend stores the access token according to the current local-storage-based application architecture. It does not implement refresh tokens.
- Email sending, retries, transport recovery, and notification persistence are backend responsibilities.

## Developer

**Dhrithi H H**

Email: [dhrithihh@gmail.com](mailto:dhrithihh@gmail.com)

GitHub: [github.com/DhrithiHH](https://github.com/DhrithiHH)
