# Auth Phase 2 - Email/Password Credentials, Registration & Demo Users

## Overview

Add the Credentials provider for email/password sign-in, a `registerUser` server action, and a seed script that creates one demo user per role (admin, owner, renter). Builds on phase 1 (Prisma + Neon, NextAuth + Google, role-based dashboards). Sign-in is still tested on NextAuth's default page; custom UI comes in phase 3.

## Requirements

### Credentials Provider

- Install `bcryptjs` (ask before installing — new dependency)
- `User.password` already exists (nullable) from the phase 1 schema — no migration needed
- `auth.config.ts`: add a Credentials provider with an `authorize: () => null` placeholder (edge-safe, no Prisma/bcrypt)
- `auth.ts`: override the Credentials provider with the real `authorize`:
  - Validate input with the shared Zod sign-in schema
  - Look up the user by email (lowercased)
  - Reject users with no `password` (Google-only accounts)
  - Compare with `bcrypt.compare`
  - Return `{ id, name, email, image, role }` so the phase 1 `jwt` callback puts `role` on the token
- Return `null` for any failure — never reveal whether the email exists

### Registration Server Action

`registerUser` in `src/actions/auth.ts` (server action, not an API route — per the project overview).

- Input: `name`, `email`, `password`, `confirmPassword`, `role`
- `role` is limited to `RENTER` or `OWNER`; `ADMIN` can never be self-assigned. Validate this on the server — never trust the client value beyond that allow-list
- Validate with the shared Zod schema (email format, password min 8 chars, passwords match)
- Lowercase and trim the email
- Reject if a user with that email already exists (generic, user-friendly error)
- Hash with bcryptjs (cost 12)
- Create the user
- Return `{ success, error, fieldErrors? }` per coding standards; never return the password hash

### Shared Validation

`src/lib/validations/auth.ts`:

- `signInSchema` - email, password
- `registerSchema` - name, email, password, confirmPassword, role (`RENTER | OWNER`), with a `refine` for matching passwords

Phase 3 forms will reuse these schemas with React Hook Form.

### Demo Users (Seed)

Create `prisma/seed.ts` that upserts one demo user per role on the Neon **development** branch:

| Role   | Name         | Email                      | Password        |
| ------ | ------------ | -------------------------- | --------------- |
| ADMIN  | Avery Admin  | `admin@propertypulse.test`  | `AdminDemo123!`  |
| OWNER  | Olivia Owner | `owner@propertypulse.test`  | `OwnerDemo123!`  |
| RENTER | Riley Renter | `renter@propertypulse.test` | `RenterDemo123!` |

- These are made-up demo credentials for local/dev testing only (`.test` is a reserved, non-routable domain)
- Hash passwords with bcryptjs in the seed, same as registration
- Use `upsert` by email so the seed is safe to re-run
- The seed must refuse to run when `NODE_ENV === "production"`
- Wire up the seed command the way the installed Prisma version expects (`prisma.config.ts` `migrations.seed` or `package.json`) — verify with Context7
- Run with `npx prisma db seed` against the dev branch only

## Files to Create / Update

1. `src/lib/validations/auth.ts` - Shared Zod schemas
2. `src/actions/auth.ts` - `registerUser` server action
3. `src/actions/auth.test.ts` - Unit tests (Prisma and bcrypt mocked)
4. `src/auth.config.ts` - Add Credentials placeholder
5. `src/auth.ts` - Override Credentials with real `authorize`
6. `prisma/seed.ts` - Demo users
7. `prisma.config.ts` or `package.json` - Seed command

## Notes

### Credentials Provider in Split Pattern

- `auth.config.ts`: Credentials provider with `authorize: () => null` (runs in the proxy, must not import Prisma or bcrypt)
- `auth.ts`: override the Credentials provider with the bcrypt validation logic

### Google + Credentials with the Same Email

If a user registers with email/password and later clicks "Sign in with Google" using the same email, Auth.js throws `OAuthAccountNotLinked` by default. Keep the default (safer) for now; phase 3 shows a friendly message for this error.

### JWT Strategy

Credentials requires `session: { strategy: 'jwt' }`, which phase 1 already uses.

## Testing

1. Unit tests for `registerUser`: success, duplicate email, mismatched passwords, invalid email, `role: "ADMIN"` rejected, DB failure
2. `npx prisma db seed` - three demo users exist on the dev branch with hashed passwords
3. Re-run the seed - no duplicates, no errors
4. Go to `/api/auth/signin` and sign in as each demo user:
   - `admin@propertypulse.test` → `/dashboard` → `/admin`
   - `owner@propertypulse.test` → `/dashboard` → `/owner/dashboard`
   - `renter@propertypulse.test` → `/dashboard` → `/renter/dashboard`
5. Wrong password and unknown email both fail with the same generic error
6. Google sign-in still works
7. `npm test` and `npm run build` pass

## Out of Scope

- Register and sign-in pages (phase 3)
- Email verification and password reset
- Admin role management UI

## References

- Credentials provider: https://authjs.dev/getting-started/authentication/credentials
- Prisma seeding: https://www.prisma.io/docs/orm/prisma-migrate/workflows/seeding
