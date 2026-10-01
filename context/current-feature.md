# Current Feature: Unify Renter/Owner Into USER Role and Single Dashboard

Replace the `RENTER`/`OWNER` split with one `USER` role, so the same account can rent and list properties from a single `/dashboard`. Owner permissions come from owning a listing (`Property.ownerId`), not from a role. `ADMIN` is unchanged.

## Status

In Progress

## Goals

- **Docs first:** update `context/project-overview.md` before code:
  - Roles section: `USER` and `ADMIN`; every user can browse, favorite, inquire, and list properties
  - Data model and `Role` enum: `USER | ADMIN`, default `USER`
  - Routes table: single `/dashboard`; `/renter/dashboard` and `/owner/dashboard` removed; `/owner/properties/*` and `/owner/inquiries` move under `/dashboard/...`
  - Dashboard wireframes merged into one dashboard: My favorites, My inquiries (sent), My listings (with **+ Add Property** and an empty-state prompt), and Inquiries received (only when the user has listings)
  - Rules that say "authenticated renter" or "owner role" become "authenticated user" plus server-side ownership checks
  - Admin stats: total users and users with listings, instead of total renters/owners
- **Specs:** update `context/features/auth-phase-2-spec.md` (no `role` field in registration or `registerSchema`; seed an admin plus regular users, one with listings) and `auth-phase-3-spec.md` (navbar menu: Dashboard, plus Admin for admins)
- **Schema:** `Role` enum becomes `USER | ADMIN` with `@default(USER)`, via `prisma migrate dev` on the Neon **development** branch:
  - Review the generated SQL before applying it; existing `RENTER`/`OWNER` rows must convert to `USER` without data loss
  - Run `prisma generate` and `prisma migrate status` afterward
- **Code:**
  - `src/lib/routes.ts`: `/dashboard` and `/dashboard/*` require any signed-in user; `/admin/*` requires `ADMIN`; `ROLE_DASHBOARDS` removed or simplified
  - `/dashboard` becomes the real dashboard page (placeholder sections are fine), guarded by `requireUser()`
  - Delete `src/app/renter/` and `src/app/owner/`
  - Proxy matcher updated (drop `/renter/*` and `/owner/*`)
  - Update `src/types/next-auth.d.ts` and anything else that references `RENTER`/`OWNER`
- **Tests:** update `routes.test.ts`, `auth-guard.test.ts`, and `auth.config.test.ts` for the new roles and routes; `npm test`, lint, and `npm run build` pass

## Notes

- Decided in conversation (2026-10-01): one account does both renting and listing, like Airbnb; no "become an owner" step and no role picker at registration
- Owner-only actions must verify `Property.ownerId === session user id` in the database query, never a role
- Postgres can't rename or drop enum values cleanly; Prisma may generate a new type plus a cast. Hand-edit the migration (for example, a `USING CASE` cast that maps `RENTER`/`OWNER` to `USER`) if needed. Never use `db push` or `migrate reset`
- Only the user's own test account exists in the dev DB, so the data conversion is low-risk, but still must not drop rows
- After the migration, existing JWTs still carry `RENTER`; sign out and back in to refresh
- Admins can use both `/dashboard` (their own favorites, inquiries, and listings, like any user) and `/admin`; `/admin` stays `ADMIN`-only. The phase 3 navbar menu shows both Dashboard and Admin for admins (decided 2026-10-01)
- Out of scope: real dashboard content (lists, stats, forms), property CRUD, and the phase 2/3 implementations themselves

## Completed Features

- **Homepage:** Static marketing homepage with navbar, hero search bar, renter/owner info boxes, and featured property cards (`src/app/page.tsx`, `src/components/home/`, `src/components/search/SearchBar.tsx`).
- **Database Setup:** Prisma 7.10 with the Neon development branch: 8-model, 4-enum initial migration and a server-only client singleton (`prisma/schema.prisma`, `prisma.config.ts`, `src/lib/db.ts`).
- **Auth Phase 1:** NextAuth v5 Google sign-in with JWT `id`/`role`, proxy and `requireRole()` protection, and placeholder renter/owner/admin dashboards (`src/auth.config.ts`, `src/auth.ts`, `src/proxy.ts`, `src/lib/auth-guard.ts`, `src/lib/routes.ts`).
