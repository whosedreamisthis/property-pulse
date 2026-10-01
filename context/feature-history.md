# Feature History

<!-- Completed features, earliest to latest. Append new entries at the end. -->

- **Homepage:** Static marketing homepage built from `context/screenshots/homepage.jpg` (spec: `context/features/homepage-spec`). Visual UI only, with no interactivity, auth, or data fetching.
  - **Structure:** Moved `app/` to `src/app/` to match the coding standards and pointed the `@/*` alias at `./src/*`.
  - **Theme:** Added the project-overview palette as Tailwind v4 tokens in `src/app/globals.css` (`primary-50`–`primary-900`, `gray-50`–`gray-950`). Removed the starter dark-mode styles and Arial override, and kept only the Geist sans font.
  - **Navbar** (`src/components/layout/Navbar.tsx`): house logo, "PropertyPulse" wordmark, and a placeholder Sign In button for the upcoming NextAuth work. Rendered in the root layout.
  - **Hero** (`src/components/home/Hero.tsx`): "Find The Perfect Rental" heading and subheading, with the search bar below.
  - **SearchBar** (`src/components/search/SearchBar.tsx`): location input, property-type select (All, Apartment, Studio, Condo, House, Cabin or Cottage, Loft, Room, Other), and a Search button. A `role="search"` container, not a form, so it doesn't submit. It's reusable on the future listings page.
  - **InfoBoxes** (`src/components/home/InfoBoxes.tsx`): "For Renters" (gray, Browse Properties) and "For Property Owners" (pale blue, Add Property) cards. Buttons are placeholders.
  - **FeaturedProperties** (`src/components/home/FeaturedProperties.tsx`, `FeaturedPropertyCard.tsx`): ice-blue section with 2 hardcoded horizontal cards (photo with price badge, title, type, location, beds/baths/sq ft). Type: `FeaturedProperty` in `src/types/property.ts`. Photos are Unsplash images in `public/images/`.
  - **Docs:** Updated the homepage wireframe in `context/project-overview.md` to match the screenshot.
  - **Validation:** lint and `next build` pass. No unit tests, because Vitest isn't set up yet and the feature has no actions or utilities.
- **Database Setup:** Prisma 7 with Neon PostgreSQL on the **development** branch (spec: `context/features/database-spec.md`). Foundation for auth phase 1. No queries or server actions yet.
  - **Packages:** `@prisma/client` and `@prisma/adapter-neon` 7.10.0, plus dev deps `prisma` 7.10.0 and `dotenv`. `npm install -D prisma` initially pulled `8.0.0-rc.19` (npm's `latest` tag), so the CLI was pinned to 7.10.0 to match the client. Neon in Prisma 7 needs only `@prisma/adapter-neon`, not `@neondatabase/serverless` or `ws`.
  - **Remaining audit findings:** 4 high-severity findings in the Prisma CLI's dev-only dependencies (`deepmerge-ts`, `mysql2`). Left unfixed, because `npm audit fix --force` would move the CLI to the 8.0 release candidate.
  - **Schema** (`prisma/schema.prisma`): Prisma 7 header (`prisma-client` generator, output `../src/generated/prisma`, no URL in the datasource). 4 enums and 8 models copied from overview section 7.
  - **PropertyType enum:** changed before the first migration to match the homepage dropdown: APARTMENT, STUDIO, CONDO, HOUSE, CABIN_OR_COTTAGE, LOFT, ROOM, OTHER (Townhouse and Basement removed). The overview's enum and property-types table were updated to match.
  - **Config** (`prisma.config.ts`): loads `dotenv/config`, sets the migrations path, and uses `env("DIRECT_URL")`, Neon's direct (non-pooled) connection, for the CLI. Written by hand instead of with `prisma init`, so `.env` wasn't touched.
  - **Migration:** `prisma/migrations/20261001191609_initial_schema/`, applied to the development branch. `prisma migrate status` reports up to date. The production branch was confirmed to have no tables. Prisma 7's `migrate dev` doesn't run `generate`, so `npx prisma generate` was run separately.
  - **Client** (`src/lib/db.ts`): `PrismaNeon` adapter using the pooled `DATABASE_URL`, with a `globalThis` singleton outside production. Server-only.
  - **Housekeeping:** `/src/generated/prisma` and `!.env.example` added to `.gitignore`. `"postinstall": "prisma generate"` added to `package.json`. Because `prisma generate` loads `prisma.config.ts`, `DIRECT_URL` must be set wherever `npm install` runs, including on deploy. `.env.example` lists `DATABASE_URL` and `DIRECT_URL` with no values.
  - **Production safeguards:** `.claude/settings.json` denies `prisma db push` and `prisma migrate reset` for Claude Code, tested and blocked. `coding-standards.md` now says never use `db push`, and production changes only through `prisma migrate deploy`. Still to do at deploy time: keep production credentials off local machines, run `migrate deploy` only in the deploy pipeline, and give the app a Postgres role with data-only privileges.
  - **Open item:** a local `.env.production` file exists. Next.js reads it during `next build` and `next start`, so check that it doesn't hold production database URLs.
  - **Validation:** `prisma validate`, lint, and `next build` pass. No unit tests, because there's no logic to test yet.
