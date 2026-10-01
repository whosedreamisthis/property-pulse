# Current Feature: Auth Phase 3 - Sign In, Register & Navbar User Menu

Custom `/sign-in` and `/register` pages replace NextAuth's default pages, and the navbar's sign-in/sign-out toggle becomes an avatar user menu. Spec: `context/features/auth-phase-3-spec.md`.

## Status

In Progress

## Goals

- **`/sign-in`** (`src/app/sign-in/page.tsx` + client `src/components/auth/SignInForm.tsx`):
  - Email and password fields with React Hook Form + `signInSchema`; field-level errors
  - "Sign in with Google" button (`src/components/auth/GoogleSignInButton.tsx`) and a link to `/register`
  - Sign-in server action (`signIn` from `@/auth`) returns errors instead of redirecting, so a failed attempt doesn't clear the form; generic "Invalid email or password"
  - Email stays filled after a failure; password behavior (keep it, or clear it and focus it) decided at start
  - Friendly `OAuthAccountNotLinked` message ("This email is already registered with a password — sign in with email and password")
  - Honors `callbackUrl` (default `/dashboard`); signed-in visitors redirect to `/dashboard`
- **`/register`** (`src/app/register/page.tsx` + client `src/components/auth/RegisterForm.tsx`):
  - Name, email, password, confirm password; no role or account-type choice
  - React Hook Form + `registerSchema`, submitting to `registerUser`; shows field and server errors
  - On success, redirect to `/sign-in` with a success message
  - "Sign in with Google" option and link to `/sign-in`; signed-in visitors redirect to `/dashboard`
- **Auth config:** `pages: { signIn: "/sign-in" }` in `src/auth.config.ts`, so proxy redirects go to `/sign-in?callbackUrl=...`
- **Navbar** (`src/components/layout/Navbar.tsx`, still a Server Component reading the session):
  - Signed out: "Sign In" links to `/sign-in`
  - Signed in: avatar trigger opening a client dropdown (`src/components/layout/UserMenu.tsx`) with name and email, Dashboard, Admin (admins only), Profile, and Sign out (redirects to `/`)
  - Keyboard accessible with a labelled trigger; responsive on mobile
- **Avatar** (`src/components/layout/UserAvatar.tsx`): Google `image` if present, otherwise initials from the name, falling back to the email's first letter
- **Initials helper** (`src/lib/initials.ts`) with unit tests (`src/lib/initials.test.ts`)
- Every manual check in the spec's Testing section passes, plus `npm test`, lint, and `npm run build`

## Notes

- **Approvals needed before installing or changing config:**
  - `react-hook-form` and `@hookform/resolvers` (new dependencies)
  - shadcn/ui isn't set up (no `components.json` or `src/components/ui/`); the spec says ask before adding it for `DropdownMenu` and `Avatar`. The alternative is a small hand-built accessible dropdown
  - `lh3.googleusercontent.com` in `next.config.ts` `images.remotePatterns` if Google avatars use `next/image`
- **Decided at start (2026-10-01):** failed sign-in keeps the email and clears the password with focus moved to it; install `react-hook-form` + `@hookform/resolvers`; set up shadcn/ui for `DropdownMenu` and `Avatar`; Google photos use a plain `<img>` (no `next.config.ts` change)
- `requireUser()` in `src/lib/auth-guard.ts` still redirects to `/api/auth/signin` with no return URL; switch it to `/sign-in` so it matches the new page
- `/profile` doesn't exist yet (out of scope), so the menu's Profile link will 404 until the profile feature
- Use server actions for sign-in and sign-out (`signIn`/`signOut` from `@/auth`), not NextAuth endpoints from the client
- Out of scope: profile page content, dashboard sidebars and real content, email verification, password reset, account linking

## Completed Features

- **Homepage:** Static marketing homepage with navbar, hero search bar, renter/owner info boxes, and featured property cards (`src/app/page.tsx`, `src/components/home/`, `src/components/search/SearchBar.tsx`).
- **Database Setup:** Prisma 7.10 with the Neon development branch: 8-model, 4-enum initial migration and a server-only client singleton (`prisma/schema.prisma`, `prisma.config.ts`, `src/lib/db.ts`).
- **Auth Phase 1:** NextAuth v5 Google sign-in with JWT `id`/`role`, proxy and `requireRole()` protection, and placeholder renter/owner/admin dashboards (`src/auth.config.ts`, `src/auth.ts`, `src/proxy.ts`, `src/lib/auth-guard.ts`, `src/lib/routes.ts`).
- **Unify USER Role:** `Role` is now `USER | ADMIN`; one `/dashboard` for renting and listing (admins too), `/admin` admin-only; renter/owner pages removed (`prisma/migrations/20261001220000_unify_user_role/`, `src/lib/routes.ts`, `src/app/dashboard/page.tsx`).
- **Auth Phase 2:** Email/password sign-in, `registerUser` server action, shared Zod auth schemas, and a dev-only seed of three demo users (`src/lib/auth-credentials.ts`, `src/actions/auth.ts`, `src/lib/validations/auth.ts`, `prisma/seed.ts`).
