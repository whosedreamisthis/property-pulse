# Current Feature: Auth Phase 1 - NextAuth + Google, Role-Based Dashboards

NextAuth v5 with the Prisma adapter and Google OAuth, JWT sessions carrying `id`/`role`, and role-based protection for the renter, owner, and admin dashboards. Spec: `context/features/auth-phase-1-spec.md`.

## Status

In Progress

## Goals

- Database foundation in place per spec (already done in Database Setup: schema, `initial_schema` migration, `src/lib/db.ts` singleton); verify nothing is missing, don't redo it
- Install `next-auth@beta` and `@auth/prisma-adapter`
- Split config: `src/auth.config.ts` (edge-safe: Google provider, `jwt`/`session`/`authorized` callbacks, no adapter) and `src/auth.ts` (Prisma adapter, `session: { strategy: 'jwt' }`)
- `id` and `role` on the JWT and session; new users (including Google) default to `RENTER`
- `src/app/api/auth/[...nextauth]/route.ts` exports handlers from `auth.ts`
- `src/types/next-auth.d.ts` extends `Session`/`JWT` with `user.id` and `user.role`
- `src/proxy.ts` (named export `proxy`) protects `/dashboard`, `/renter/*`, `/owner/*`, `/admin/*`, `/profile`, `/favorites`, `/inquiries`:
  - Unauthenticated → sign-in with callback URL
  - Wrong role → `/dashboard`
- `src/lib/auth-guard.ts` with `getCurrentUser()` and `requireRole(...roles)` for server-side checks on every dashboard page
- `/dashboard` redirects by role to `/renter/dashboard`, `/owner/dashboard`, or `/admin`
- Placeholder dashboards (heading + user info) at `/renter/dashboard`, `/owner/dashboard`, `/admin`, each allowing only its own role
- `.env.example` lists `DATABASE_URL`, `AUTH_SECRET`, `AUTH_GOOGLE_ID`, `AUTH_GOOGLE_SECRET` (plus `DIRECT_URL` if needed), names only
- Unit tests for `requireRole()` / redirect logic with `@/auth` mocked; `npm run build` passes

## Notes

- Use Context7 to verify current NextAuth v5, Prisma, and Neon adapter conventions before implementing
- `jwt`/`session` callbacks that add `role` must live in `auth.config.ts` so the proxy sees the role; `jwt` only receives `user` on sign-in, so persist `role` on the token then
- Proxy is an optimistic check only; pages must re-verify via `requireRole()`
- Don't set custom `pages.signIn`; use NextAuth's default sign-in page
- Never import `src/lib/db.ts` from `auth.config.ts` or client components
- Role changes in the DB need a re-sign-in to show up (acceptable for phase 1)
- Testing roles: change `User.role` on the Neon **development** branch, then sign out and back in
- Out of scope: credentials/registration (phase 2), custom auth UI/navbar avatar/sign-out (phase 3), role selection, admin role management, real dashboard content, seed data

## Completed Features

- **Homepage:** Static marketing homepage with navbar, hero search bar, renter/owner info boxes, and featured property cards (`src/app/page.tsx`, `src/components/home/`, `src/components/search/SearchBar.tsx`).
- **Database Setup:** Prisma 7.10 with the Neon development branch: 8-model, 4-enum initial migration and a server-only client singleton (`prisma/schema.prisma`, `prisma.config.ts`, `src/lib/db.ts`).
