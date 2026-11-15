# Turino — tour booking front end

A Persian (right-to-left) website for **Turino**, an agency that runs scheduled group tours from
Tehran to cities in Iran and abroad. Visitors browse departures, compare dates, prices and free
seats, and book online.

The interface is modern and minimal: white pages with very light grey sections, one teal accent
(`#0F766E`) for actions and active states, Vazirmatn throughout, rounded cards and plenty of
whitespace. The design tokens live in the `@theme` block of `src/app/globals.css`.

**Dark mode.** The header button cycles light → dark → system. Dark mode re-values the same
colour tokens under `.dark`, so components carry no `dark:` classes. A tiny script in `<head>`
(`src/features/theme/theme.ts`) applies the saved or system theme before the first paint, so there
is no white flash, and the page follows the OS setting live while on "system".

## Stack

| Concern      | Choice                                                           |
| ------------ | ---------------------------------------------------------------- |
| Framework    | Next.js 16 (App Router, Cache Components, Turbopack)             |
| Language     | TypeScript (strict)                                              |
| Styling      | Tailwind CSS v4, with design tokens in `src/app/globals.css`     |
| Server state | TanStack Query (provider ready for client-side fetching)         |
| HTTP         | Axios, through one shared client                                 |
| Validation   | Zod (environment variables now, forms next)                      |
| Forms        | React Hook Form + Zod resolver (installed for the booking phase) |
| Client state | Zustand (installed for the auth and basket phase)                |
| Quality      | ESLint, Prettier (with Tailwind class sorting), `tsc --noEmit`   |

## Getting started

```bash
cp .env.example .env.local   # then edit the values
npm install
npm run dev                  # http://localhost:3000
```

| Script                                    | What it does                |
| ----------------------------------------- | --------------------------- |
| `npm run dev`                             | Development server          |
| `npm run build` / `npm start`             | Production build and server |
| `npm run lint` / `npm run lint:fix`       | ESLint                      |
| `npm run format` / `npm run format:check` | Prettier                    |
| `npm run typecheck`                       | TypeScript, no emit         |

### Environment

| Variable       | Meaning                                                                                        |
| -------------- | ---------------------------------------------------------------------------------------------- |
| `API_BASE_URL` | Base URL of the Turino backend, without a trailing slash                                       |
| `USE_MOCKS`    | `true` serves sample tours from `src/features/tours/data/mock-tours.ts`; `false` calls the API |

Values are validated with Zod at start-up (`src/config/env.ts`). A bad value fails fast with a
readable message.

## Project structure

```
src/
├── app/                      Routes only: layouts, pages, metadata
│   ├── page.tsx              Home (draws its own first screen)
│   ├── (site)/               Inner pages that share the header and footer
│   │   ├── tours/            Tour list, filterable by destination
│   │   ├── tours/[tourId]/   Tour details and programme
│   │   ├── checkout/         Booking (placeholder until the booking phase)
│   │   └── profile/          Account (placeholder until the auth phase)
│   ├── layout.tsx            <html lang="fa" dir="rtl">, fonts, providers
│   └── globals.css           Design tokens and motion
├── features/                 One folder per domain
│   ├── home/components/      Home sections
│   └── tours/
│       ├── api.ts            The only place that talks to the tour endpoints
│       ├── types.ts          Tour, Place, Vehicle, …
│       ├── components/       TourTicket
│       ├── data/             Sample data used while mocks are on
│       ├── constants.ts      Labels
│       └── utils.ts          Sorting, grouping
├── components/               Shared, domain-free UI (Button, StripeBand, layout, motion)
├── lib/
│   ├── api/                  Axios client, error normalisation, token storage
│   ├── query/                TanStack Query client factory
│   ├── format.ts             fa-IR numbers, toman prices, Solar Hijri dates
│   └── cn.ts                 clsx + tailwind-merge
├── config/                   Validated env, site copy, photo credits
└── providers/                Client providers
```

### Conventions

- **Pages never call the HTTP client directly.** They call a feature's `api.ts`. Moving from mocks to
  the real backend changes only those files.
- **One error shape.** Every failed request becomes an `ApiError` with a Persian message and the
  HTTP status.
- **Server first.** Pages are Server Components. Client components (`"use client"`) exist only where
  there is interaction: the login dialog, forms, account pages and the scroll reveals.
- **Cache Components.** Service functions use `"use cache"` + `cacheLife`; anything that reads
  `params` or `searchParams` sits inside `<Suspense>`.
- **Tokens only.** Colours, type steps and spacing come from the `@theme` block in `globals.css`.
  Nothing hard-codes a hex value or a font size.
- **Accessible by default.** Real links and buttons, labelled form controls, visible focus,
  a skip link, and reduced-motion fallbacks. The hero form still works without JavaScript (it
  submits to `/tours`).

## Tours data

- `src/features/tours/dto.ts` holds the shapes exactly as the API returns them, and
  `mapper.ts → toTour()` turns each one into the UI's `Tour`. The mapper translates English place
  names to Persian (`place-names.ts`), normalises `fleetVehicle` (`"SUV"` → `suv`) and writes alt
  text. Mock mode serves DTOs too, so both modes go through the same mapper.
- Seats and prices change, so tours are fetched per request and cached for a minute
  (`"use cache"` + `cacheLife("minutes")`), never at build time. The build does not need the
  backend running.
- Tour images come from the backend's `/static/**`, which is allowed in `next.config.ts`. While the
  API runs on `localhost`, `dangerouslyAllowLocalIP` is switched on automatically. With a public API
  host it stays off.
- If the API is unreachable, `src/app/error.tsx` shows a retry screen.

## Authentication and API security

The browser never talks to the backend and never sees a token. It talks only to this app's own
`/api` routes (a Backend-for-Frontend), which call the backend on the server.

```
Browser ──(HttpOnly cookie)──▶ Next.js /api routes ──(Bearer token)──▶ Express backend
```

- **Sign-in** (`/api/auth/send-otp`, `/api/auth/check-otp`): the server verifies the code and puts
  the access and refresh tokens in **HttpOnly, SameSite=Lax** cookies (`Secure` in production).
  Only the public user profile is returned to the page. In production the backend's test OTP code
  is never forwarded.
- **Data calls** go through `/api/backend/*` (`src/app/api/backend/[...path]/route.ts`), which only
  forwards a **fixed allowlist** of paths and methods. The upstream path comes from that table,
  never from the request URL, so the user's token cannot reach other endpoints such as `/truncate`.
- **Token refresh happens on the server** (`src/server/auth/forward.ts`). An expired access token
  (401/403) is refreshed once and the request replayed, and the browser receives a new HttpOnly
  cookie. A rejected refresh ends the session. A network failure or 5xx answers 502 and keeps the
  session.
- **CSRF**: state-changing routes accept only same-origin requests (the `Origin` /
  `Sec-Fetch-Site` check), on top of `SameSite=Lax`. Request bodies are size-limited and validated.
- **Session state in the page** comes from `/api/auth/session`. Nothing is stored in localStorage.
  Tabs stay in sync over a `BroadcastChannel`.
- **Route guard**: `src/proxy.ts` sends signed-out visitors from `/profile` and `/checkout` to the
  login dialog, then back. After sign-in only same-site `next` paths are followed
  (`src/lib/safe-redirect.ts`).
- **Headers** (`next.config.ts`): a Content-Security-Policy with `connect-src 'self'` (the page can
  only call this site, so injected script cannot send data elsewhere), plus `frame-ancestors 'none'`,
  `X-Frame-Options`, `nosniff`, `Referrer-Policy`, `Permissions-Policy` and HSTS. No nonces, which
  keeps Partial Prerendering.
- **Server-only code** lives in `src/server` and imports `server-only`, so it cannot be bundled
  for the browser. The backend address (`API_BASE_URL`) is not a `NEXT_PUBLIC_` variable.

## Account and booking

| Flow                                                                 | Endpoints                            | Code                                                  |
| -------------------------------------------------------------------- | ------------------------------------ | ----------------------------------------------------- |
| Profile: account, personal and bank sections, each edited on its own | `GET` / `PUT /user/profile`          | `src/features/user`                                   |
| My tours, with status (upcoming, ongoing, finished)                  | `GET /user/tours`                    | `src/features/user/trip-status.ts`                    |
| Transactions                                                         | `GET /user/transactions`             | `src/features/user/components/transactions-table.tsx` |
| Book: tour → basket → checkout                                       | `PUT /basket/:tourId`, `GET /basket` | `src/features/basket`                                 |
| Passenger form, then pay                                             | `POST /order`                        | `src/features/order`                                  |

- Authenticated data is fetched in the browser with TanStack Query. Keys live in
  `src/lib/query/query-keys.ts`, and a successful order invalidates the basket, my tours and
  transactions.
- Forms use React Hook Form + Zod, with Persian messages. Persian digits are accepted everywhere.
  National codes are checked with the official check digit, IBAN (شبا) with ISO 13616 mod-97, and
  card numbers with Luhn (`src/lib/validators.ts`).
- Dates are picked in the Persian calendar (`JalaliDateField`) and sent to the API as ISO Gregorian
  dates. The conversion in `src/lib/jalali.ts` needs no dependency.
- The checkout form is pre-filled from the saved profile.

## Roadmap

- [x] Phase 1: project setup, architecture, design system, home, tour list and tour details on mock data
- [x] Phase 2: tour endpoints (`GET /tour` with origin/destination/date filters, `GET /tour/:id`)
- [x] Phase 3a: OTP login, server-side token refresh (BFF, HttpOnly cookies), route guard, sign-out
- [x] Phase 3b: editable profile (account, personal, bank), my tours, transactions
- [x] Phase 4: basket, passenger form, order and payment

## Credits

Destination photographs come from Wikimedia Commons under Creative Commons licences. They are
credited on the site (footer → «منبع عکس‌ها») and listed in `src/config/photo-credits.ts`.
Prices, dates, programmes, the office address and the phone number are sample content.
