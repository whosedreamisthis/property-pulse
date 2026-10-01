# Current Feature: Auth Phase 2 - Email/Password Credentials, Registration & Demo Users

Email/password sign-in with the Credentials provider, a `registerUser` server action, shared Zod auth schemas, and a seed with three demo users. Sign-in is still tested on NextAuth's default page. Spec: `context/features/auth-phase-2-spec.md`.

## Status

In Progress

## Goals

- **Shared validation** (`src/lib/validations/auth.ts`): `signInSchema` (email, password) and `registerSchema` (name, email, password min 8, confirmPassword, `refine` for matching passwords; no `role`)
- **Credentials provider (split pattern):**
  - `src/auth.config.ts`: Credentials provider with an `authorize: () => null` placeholder (edge-safe, no Prisma or bcrypt)
  - `src/auth.ts`: override it with the real `authorize`: validate with `signInSchema`, look up by lowercased email, reject users with no `password` (Google-only), `bcrypt.compare`, return `{ id, name, email, image, role }`
  - Return `null` for every failure; never reveal whether the email exists
- **`registerUser`** server action (`src/actions/auth.ts`):
  - Input `name`, `email`, `password`, `confirmPassword`; any client-sent `role` is ignored, so new users get the schema default `USER`
  - Validate with `registerSchema`; lowercase and trim the email
  - Reject an existing email with a generic, user-friendly error
  - Hash with bcryptjs (cost 12), create the user
  - Return `{ success, error, fieldErrors? }`; never return the password hash
- **Seed** (`prisma/seed.ts`): upsert by email on the Neon **development** branch, hashing passwords with bcryptjs:
  - ADMIN: Avery Admin, `admin@propertypulse.test` / `AdminDemo123!`
  - USER: Olivia Owner, `olivia@propertypulse.test` / `OliviaDemo123!`
  - USER: Riley Renter, `riley@propertypulse.test` / `RileyDemo123!`
  - Refuses to run when `NODE_ENV === "production"`; safe to re-run with no duplicates
  - Seed command wired the way Prisma 7 expects (`prisma.config.ts` `migrations.seed` or `package.json`), verified with Context7; run with `npx prisma db seed`
- **Tests** (`src/actions/auth.test.ts`, Prisma and bcrypt mocked): success (role `USER`), duplicate email, mismatched passwords, invalid email, extra `role: "ADMIN"` ignored, DB failure
- `npm test`, lint, and `npm run build` pass

## Notes

- **New dependencies need approval first:** `bcryptjs` (spec says ask). `zod` isn't installed yet either, though the overview lists it in the stack. The seed may also need a TypeScript runner (for example `tsx`), depending on Prisma 7's seed setup
- `User.password` already exists (nullable), so no migration is needed
- Same email used with credentials and Google: keep Auth.js's default `OAuthAccountNotLinked` error; phase 3 shows a friendly message
- Credentials needs JWT sessions, which phase 1 already uses
- Seed only against the development branch; the demo credentials are made up and use the reserved `.test` domain
- Manual testing at `/api/auth/signin`: all three demo users land on `/dashboard`; only Avery can open `/admin`. Wrong password and unknown email fail with the same generic error. Google sign-in still works
- Out of scope: register and sign-in pages (phase 3), email verification and password reset, admin role management UI, demo properties for Olivia

## Completed Features

- **Homepage:** Static marketing homepage with navbar, hero search bar, renter/owner info boxes, and featured property cards (`src/app/page.tsx`, `src/components/home/`, `src/components/search/SearchBar.tsx`).
- **Database Setup:** Prisma 7.10 with the Neon development branch: 8-model, 4-enum initial migration and a server-only client singleton (`prisma/schema.prisma`, `prisma.config.ts`, `src/lib/db.ts`).
- **Auth Phase 1:** NextAuth v5 Google sign-in with JWT `id`/`role`, proxy and `requireRole()` protection, and placeholder renter/owner/admin dashboards (`src/auth.config.ts`, `src/auth.ts`, `src/proxy.ts`, `src/lib/auth-guard.ts`, `src/lib/routes.ts`).
- **Unify USER Role:** `Role` is now `USER | ADMIN`; one `/dashboard` for renting and listing (admins too), `/admin` admin-only; renter/owner pages removed (`prisma/migrations/20261001220000_unify_user_role/`, `src/lib/routes.ts`, `src/app/dashboard/page.tsx`).
