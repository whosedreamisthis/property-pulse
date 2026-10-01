# Auth Phase 3 - Sign In, Register & Navbar User Menu

## Overview

Replace NextAuth's default pages with custom `/sign-in` and `/register` pages, and replace the static "Sign In" button in the navbar with a user menu when signed in. Builds on phase 1 (Google, single `/dashboard`, admin-only `/admin`) and phase 2 (credentials, `registerUser`, shared Zod schemas, demo users).

Follow the blue + gray visual system in `@context/project-overview.md` section 9.

## Requirements

### Sign In Page (`/sign-in`)

- Email and password fields (React Hook Form + `signInSchema` from phase 2)
- "Sign in with Google" button
- Link to `/register`
- Field-level validation errors
- Generic error on failed credentials ("Invalid email or password")
- Friendly message for `OAuthAccountNotLinked` ("This email is already registered with a password — sign in with email and password")
- Honor `callbackUrl`; default redirect is `/dashboard`
- Signed-in users visiting `/sign-in` are redirected to `/dashboard`

### Register Page (`/register`)

- Name, email, password, confirm password fields. No account-type or role choice: every account can rent and list
- React Hook Form + `registerSchema` from phase 2
- Submits to the `registerUser` server action
- Shows field errors and server errors returned by the action
- On success, redirect to `/sign-in` with a success message
- "Sign in with Google" option and link to `/sign-in`
- Signed-in users visiting `/register` are redirected to `/dashboard`

### Auth Config

- Set `pages: { signIn: '/sign-in' }` in `auth.config.ts`
- Proxy redirects for unauthenticated users now go to `/sign-in?callbackUrl=...`

### Navbar User Menu

Update `src/components/layout/Navbar.tsx`:

- Signed out: "Sign In" links to `/sign-in` (replaces the phase 1 sign-in/sign-out toggle)
- Signed in: avatar button that opens a dropdown with:
  - User name and email
  - Dashboard → `/dashboard`
  - Admin → `/admin` (admins only; hide the link for everyone else, but `/admin` still enforces the role on the server)
  - Profile → `/profile`
  - Sign out
- Keep the Navbar a Server Component that reads the session; put only the dropdown in a small client component
- Dropdown must be keyboard accessible with a labelled trigger (use shadcn/ui `DropdownMenu` and `Avatar` if shadcn is set up; ask before adding it)

### Avatar Logic

- If the user has an `image` (from Google): show it
- Otherwise: initials from name (e.g. "Riley Renter" → "RR"); fall back to the first letter of the email
- Reusable `UserAvatar` component

### Sign Out

- Signs out and redirects to `/`

## Files to Create / Update

1. `src/app/sign-in/page.tsx`
2. `src/app/register/page.tsx`
3. `src/components/auth/SignInForm.tsx` - client form
4. `src/components/auth/RegisterForm.tsx` - client form
5. `src/components/auth/GoogleSignInButton.tsx`
6. `src/components/layout/UserMenu.tsx` - client dropdown
7. `src/components/layout/UserAvatar.tsx`
8. `src/components/layout/Navbar.tsx` - session-aware
9. `src/auth.config.ts` - `pages.signIn`
10. `src/lib/initials.ts` + `src/lib/initials.test.ts` - initials helper and tests

## Notes

- Install `react-hook-form` and `@hookform/resolvers` if not already present (ask first — new dependencies)
- Use server actions for sign-in/sign-out (`signIn`/`signOut` from `@/auth`) rather than calling NextAuth endpoints from the client
- Allow the Google avatar host (`lh3.googleusercontent.com`) in `next.config.ts` `images.remotePatterns` if using `next/image` (config change — ask first)
- Navbar must stay responsive; on mobile the user menu still fits beside the logo

## Testing

1. `/sign-in` renders the custom page
2. Sign in as each demo user from phase 2 — all land on `/dashboard`:
   - `admin@propertypulse.test` / `AdminDemo123!` → menu shows Dashboard and Admin
   - `olivia@propertypulse.test` / `OliviaDemo123!` → menu shows Dashboard only
   - `riley@propertypulse.test` / `RileyDemo123!` → menu shows Dashboard only
3. Wrong password shows the generic error
4. Sign in with Google works and shows the Google avatar
5. Credentials users show initials in the navbar
6. Avatar dropdown opens with mouse and keyboard; Dashboard and Profile links work
7. Sign out returns to `/` and the navbar shows "Sign In"
8. `/register` → redirected to `/sign-in` → sign in → `/dashboard` (new account has role `USER`)
9. `/register` with an existing email shows an error
10. Visiting `/admin` signed out → `/sign-in?callbackUrl=/admin`
11. `npm test` and `npm run build` pass

## Out of Scope

- Profile page content
- Dashboard sidebars and real dashboard content
- Email verification, password reset, account linking
