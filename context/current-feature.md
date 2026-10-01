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
