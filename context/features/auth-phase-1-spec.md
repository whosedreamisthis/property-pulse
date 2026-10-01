# Auth Phase 1 - Database, NextAuth + Google, Role-Based Dashboards

## Overview

Set up the Prisma + Neon database foundation, NextAuth v5 with the Prisma adapter and Google OAuth, and role-based route protection for the three dashboards (renter, owner, admin). Use NextAuth's default sign-in page for testing; custom auth UI comes in phase 3, email/password in phase 2.

The data model, roles, and routes come from `@context/project-overview.md` (sections 6–8). This spec does not redefine them.

## Requirements

### Database

- Install Prisma and set it up against the Property Pulse Neon **development** branch
- Create the Prisma schema from `project-overview.md` section 7 as the initial migration:
  - Enums: `Role`, `PropertyType`, `PropertyStatus`, `InquiryStatus`
  - Auth.js adapter models: `User`, `Account`, `Session`, `VerificationToken`
  - App models: `Property`, `PropertyImage`, `Favorite`, `Inquiry`
- `User.role` defaults to `RENTER`
- Keep `User.password` nullable (populated in phase 2 for credentials users)
- Create a Prisma client singleton at `src/lib/db.ts`
- Run `npx prisma migrate dev --name initial_schema` (no `db push`)

### Authentication

- Install NextAuth v5 (`next-auth@beta`) and `@auth/prisma-adapter`
- Split auth config pattern for edge compatibility
- Google OAuth provider
- JWT session strategy
- Put `id` and `role` on the JWT and session so the proxy and server code can read them without a DB query
- New users (including Google sign-ups) get the default `RENTER` role

### Dashboards and Route Protection

Three role-specific dashboards, per the overview routes:

| Route               | Allowed roles | Phase 1 content                 |
| ------------------- | ------------- | ------------------------------- |
| `/renter/dashboard` | RENTER        | Placeholder heading + user info |
| `/owner/dashboard`  | OWNER         | Placeholder heading + user info |
| `/admin`            | ADMIN         | Placeholder heading + user info |
| `/dashboard`        | any signed-in | Redirects to the role dashboard |

- `/dashboard` is a convenience entry point: it reads the session role and redirects to `/renter/dashboard`, `/owner/dashboard`, or `/admin`
- Proxy (`src/proxy.ts`) protects `/dashboard`, `/renter/*`, `/owner/*`, `/admin/*`, `/profile`, `/favorites`, `/inquiries`:
  - Unauthenticated → redirect to sign-in with a callback URL
  - Authenticated but wrong role → redirect to `/dashboard` (which sends them to their own dashboard)
- The proxy is an optimistic check only. Each dashboard page must also verify the session and role on the server via a shared helper (e.g. `requireRole()` in `src/lib/auth-guard.ts`)
- For phase 1, each dashboard allows only its own role (admins do not get access to owner/renter dashboards)

## Files to Create

1. `prisma/schema.prisma` - Schema from the project overview
2. `prisma.config.ts` - Only if required by the installed Prisma version
3. `src/lib/db.ts` - Prisma client singleton
4. `src/auth.config.ts` - Edge-compatible config (providers + `jwt`/`session`/`authorized` callbacks, no adapter)
5. `src/auth.ts` - Full config with Prisma adapter and JWT strategy
6. `src/app/api/auth/[...nextauth]/route.ts` - Export handlers from `auth.ts`
7. `src/proxy.ts` - Route protection and role-based redirects
8. `src/types/next-auth.d.ts` - Extend `Session`/`JWT` with `user.id` and `user.role`
9. `src/lib/auth-guard.ts` - Server helpers: `getCurrentUser()`, `requireRole(...roles)`
10. `src/app/dashboard/page.tsx` - Role-based redirect
11. `src/app/renter/dashboard/page.tsx` - Placeholder
12. `src/app/owner/dashboard/page.tsx` - Placeholder
13. `src/app/admin/page.tsx` - Placeholder
14. `.env.example` - Variable names only, no values

## Key Gotchas

Use Context7 to verify the newest config and conventions for NextAuth v5, Prisma, and the Neon driver/adapter.

- Use `next-auth@beta` (not `@latest`, which installs v4)
- Proxy file must be at `src/proxy.ts` (same level as `app/`), Next.js 16 convention
- Use named export: `export const proxy = auth(...)`, not a default export
- Use `session: { strategy: 'jwt' }` with the split config pattern
- `jwt`/`session` callbacks that add `role` must live in `auth.config.ts` so the proxy sees the role
- The `jwt` callback only receives `user` on sign-in — read `role` from it then and persist on the token
- A role change in the DB won't appear until the user signs in again (acceptable for phase 1)
- Don't set custom `pages.signIn` - use NextAuth's default page
- Follow the installed Prisma version's setup (generator output, config file, driver adapter) — don't mix old and new styles
- Use the Neon pooled connection string for the app; use the direct connection for migrations if the Prisma version requires it
- Prisma is server-only — never import `src/lib/db.ts` from a client component or from `auth.config.ts`

## Environment Variables

```
DATABASE_URL=
AUTH_SECRET=
AUTH_GOOGLE_ID=
AUTH_GOOGLE_SECRET=
```

Add `DIRECT_URL=` if the Prisma/Neon setup needs a separate direct connection for migrations.

## Assigning Roles for Testing

There is no role-selection UI yet. To test owner/admin dashboards, sign in with Google, then change `User.role` on the Neon **development** branch (Prisma Studio or SQL). Sign out and back in to refresh the JWT.

## Testing

1. `npx prisma migrate status` - migration applied on the dev branch
2. Go to `/dashboard` signed out - redirects to sign-in
3. Sign in with Google - redirects back to `/dashboard`, then on to `/renter/dashboard`
4. Verify a `User` row exists with role `RENTER` and a linked `Account` row
5. As RENTER, visit `/owner/dashboard` and `/admin` - redirected to `/renter/dashboard`
6. Set role to `OWNER`, sign in again - `/dashboard` goes to `/owner/dashboard`; `/admin` is blocked
7. Set role to `ADMIN`, sign in again - `/dashboard` goes to `/admin`
8. Public routes (`/`, `/properties`) work signed out
9. Unit tests for `requireRole()` / redirect logic with `@/auth` mocked
10. `npm run build` passes

## Out of Scope

- Email/password credentials and registration (phase 2)
- Custom sign-in/register pages, navbar avatar, sign-out UI (phase 3)
- Role selection at registration and admin user-role management
- Real dashboard content (stats, tables, sidebars)
- Seed data and demo users (phase 2, once passwords exist)

## References

- Edge compatibility: https://authjs.dev/getting-started/installation#edge-compatibility
- Prisma adapter: https://authjs.dev/getting-started/adapters/prisma
- Role-based access: https://authjs.dev/guides/role-based-access-control
- Next.js proxy: https://nextjs.org/docs/app/api-reference/file-conventions/proxy
