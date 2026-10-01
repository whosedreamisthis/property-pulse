# Current Feature: Database Setup

Set up Prisma 7 with Neon PostgreSQL (development branch): full schema from `project-overview.md` section 7 as the initial migration, plus a server-only Prisma client singleton. Foundation for auth phase 1.

## Status

In Progress

## Goals

- Install `@prisma/client`, `@prisma/adapter-neon`, and dev deps `prisma`, `dotenv` (ask first; confirm current package names/setup via Context7)
- Run `npx prisma init` without overwriting the existing `.env` / `DATABASE_URL`
- `prisma/schema.prisma` with the Prisma 7 header (`prisma-client` generator, `output = "../src/generated/prisma"`, no URL in datasource)
- Schema contains enums `Role`, `PropertyType`, `PropertyStatus`, `InquiryStatus` and models `User`, `Account`, `Session`, `VerificationToken`, `Property`, `PropertyImage`, `Favorite`, `Inquiry`, copied exactly from the overview (Decimal rent fields, compound `Favorite` key, indexes)
- `prisma.config.ts` using `dotenv/config`, with the migrations path and `datasource.url = env("DIRECT_URL")`
- `DIRECT_URL` added to `.env`: the development branch's non-pooled connection string (`DATABASE_URL` without `-pooler`)
- Initial migration via `npx prisma migrate dev --name initial_schema` against the **development** branch only
- `src/lib/db.ts` Prisma client singleton using `PrismaNeon` with the pooled `DATABASE_URL`, importing from `@/generated/prisma/client`
- Housekeeping: `src/generated/prisma` in `.gitignore`, `"postinstall": "prisma generate"` in `package.json`, `.env.example` with variable names only (ask before adding `!.env.example` to `.gitignore`)

## Notes

- Source spec: `context/features/database-spec.md`
- Verify `DIRECT_URL` targets the Neon development branch before migrating. Production must stay untouched (no tables)
- Never use `prisma db push`
- `PropertyType` enum changed (before the first migration) to match the homepage dropdown: APARTMENT, STUDIO, CONDO, HOUSE, CABIN_OR_COTTAGE, LOFT, ROOM, OTHER. `project-overview.md` updated to match
- `src/lib/db.ts` is server-only: never import it from client components or edge code (`auth.config.ts`, `proxy.ts`)
- Generated client in `src/generated/prisma` is never committed or edited
- Testing: `npx prisma migrate status` reports up to date; Prisma Studio or the Neon Console shows all 8 tables and 4 enums; `npm run lint` and `npm run build` pass
- Out of scope: NextAuth setup, seed data/demo users, any queries or server actions, switching the homepage's featured properties to the database

## Completed Features

- **Homepage:** Static marketing homepage with navbar, hero search bar, renter/owner info boxes, and featured property cards (`src/app/page.tsx`, `src/components/home/`, `src/components/search/SearchBar.tsx`).
