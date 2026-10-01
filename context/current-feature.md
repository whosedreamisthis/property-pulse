# Current Feature

<!-- Feature name and short description -->

## Status

Completed

## Goals

<!-- Goals and requirements -->

## Notes

<!-- Any extra notes -->

## Completed Features

- **Homepage:** Static marketing homepage with navbar, hero search bar, renter/owner info boxes, and featured property cards (`src/app/page.tsx`, `src/components/home/`, `src/components/search/SearchBar.tsx`).
- **Database Setup:** Prisma 7.10 with the Neon development branch: 8-model, 4-enum initial migration and a server-only client singleton (`prisma/schema.prisma`, `prisma.config.ts`, `src/lib/db.ts`).
- **Auth Phase 1:** NextAuth v5 Google sign-in with JWT `id`/`role`, proxy and `requireRole()` protection, and placeholder renter/owner/admin dashboards (`src/auth.config.ts`, `src/auth.ts`, `src/proxy.ts`, `src/lib/auth-guard.ts`, `src/lib/routes.ts`).
- **Unify USER Role:** `Role` is now `USER | ADMIN`; one `/dashboard` for renting and listing (admins too), `/admin` admin-only; renter/owner pages removed (`prisma/migrations/20261001220000_unify_user_role/`, `src/lib/routes.ts`, `src/app/dashboard/page.tsx`).
- **Auth Phase 2:** Email/password sign-in, `registerUser` server action, shared Zod auth schemas, and a dev-only seed of three demo users (`src/lib/auth-credentials.ts`, `src/actions/auth.ts`, `src/lib/validations/auth.ts`, `prisma/seed.ts`).
- **Auth Phase 3:** Custom `/sign-in` and `/register` pages, navbar avatar user menu, and shadcn/ui set up on the project palette (`src/app/sign-in/`, `src/app/register/`, `src/components/auth/`, `src/components/layout/UserMenu.tsx`, `src/components/ui/`).
