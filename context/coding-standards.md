# Coding Standards

## TypeScript

- Use strict TypeScript.
- Do not use `any`; use proper typing or `unknown`.
- Define types/interfaces for component props, API responses, and domain data where they improve clarity.
- Use type inference when the type is obvious; be explicit where it improves safety or readability.
- Prefer Prisma-generated types for database-backed models where appropriate.

## React

- Use functional components only.
- Use hooks for state and side effects.
- Keep components focused on one responsibility.
- Extract reusable logic into custom hooks.
- Avoid unnecessary client state.

## Next.js

- Use Server Components by default.
- Use `'use client'` only when interactivity, hooks, or browser APIs require it.
- Use Server Actions for form submissions and simple mutations.
- Use API routes when an actual HTTP endpoint is required, including:
  - Webhooks
  - File uploads requiring progress tracking
  - Long-running operations
  - Specific HTTP status codes or headers
  - Future mobile/CLI clients
  - Third-party integrations
- Otherwise, fetch database data directly in Server Components.
- Use dynamic routes for item/collection pages.

## Tailwind CSS v4

**CRITICAL:** Property Pulse uses Tailwind CSS v4.

- Do not create `tailwind.config.ts` or `tailwind.config.js`.
- Configure the theme in CSS with the `@theme` directive in `src/app/globals.css`.
- Use CSS custom properties for colors, spacing, and other theme values.
- Do not use JavaScript-based Tailwind configuration.

Example:

```css
@import "tailwindcss";

@theme {
  --color-primary: oklch(50% 0.2 250);
}
```

## File Organization

Use the established project structure:

- Components: `src/components/[feature]/ComponentName.tsx`
- Pages: `src/app/[route]/page.tsx`
- Server Actions: `src/actions/[feature].ts`
- Types: `src/types/[feature].ts`
- Libraries/utilities: `src/lib/[utility].ts`

## Naming

- Components: PascalCase, e.g. `ItemCard.tsx`
- Files: match the component name or use kebab-case where appropriate
- Functions: camelCase
- Constants: SCREAMING_SNAKE_CASE
- Types/interfaces: PascalCase without prefixes

## Styling

- Use Tailwind CSS for styling.
- Use shadcn/ui components where applicable.
- Do not use inline styles.
- Follow the visual system defined in `@context/project-overview.md`.
- Maintain responsive and accessible UI.
- Provide appropriate loading, empty, error, and success states.

## Forms and Validation

- Use React Hook Form for non-trivial forms.
- Use Zod for input validation.
- Validate on the server even when client-side validation is present.
- Reuse validation schemas when client and server need the same rules.
- Return structured, predictable errors from Server Actions.

## Database

- Use Prisma ORM for database operations.
- Use Prisma migrations for every schema change.
- Never use `prisma db push`, on any branch. It changes the schema without creating a migration, so production and development drift apart.
- Never use `prisma migrate reset` without explicit approval. It drops all data on the target database.
- Use `prisma migrate dev` only against the Neon development branch.
- Production schema changes only through `prisma migrate deploy` in the deployment pipeline, applying migrations already committed to the repo. Never change the production schema directly, whether by SQL, the Neon Console, Prisma Studio, or `db push`.
- `.claude/settings.json` denies `prisma db push` and `prisma migrate reset` for Claude Code. Don't remove these rules.
- Run `prisma migrate status` before committing to verify migration state.
- Production deployments must run `prisma migrate deploy` before the application starts.
- Regenerate Prisma Client when required after schema changes.
- Use transactions when multiple related writes must succeed or fail together.
- Avoid N+1 queries and unnecessary over-fetching.
- Never manually edit generated Prisma Client output.

## Data Fetching

- Server Components should fetch database-backed data directly on the server.
- Client components should use Server Actions or appropriate server boundaries rather than connecting directly to the database.
- Select only the fields required by the UI.
- Consider pagination for large result sets.
- Handle missing records explicitly.

## Error Handling

- Use `try/catch` in Server Actions where failures need to be handled.
- Prefer a consistent `{ success, data, error }` result pattern for actions.
- Validate input before database mutations.
- Return user-friendly messages to the UI.
- Use toast notifications where appropriate.
- Never expose stack traces, secrets, database details, or other internal information to users.

## Testing

- Use Vitest for unit tests (`vitest.config.ts`).
- `npm test` runs tests once; `npm run test:watch` runs watch mode.
- Test Server Actions and utilities, not components or pages.
- Name tests `*.test.ts`.
- Put tests next to the code they test, for example:
  - `src/lib/tokens.test.ts`
  - `src/actions/profile.test.ts`
- Only `src/**/*.test.ts` is collected.
- Import `describe`, `it`, `expect`, and `vi` explicitly from `vitest`; do not use globals.
- Never hit the database, email service, or Redis in unit tests.
- Mock dependencies such as `@/auth`, `@/lib/db`, and `next/headers` with `vi.mock`.
- Cover happy paths and meaningful error cases, including missing sessions, invalid input, and dependency failures.
- Do not write tests solely to increase test count.
- Reset mocks and stubbed environment values between tests according to the Vitest configuration.

## Code Quality

- Do not leave commented-out code unless specifically required.
- Remove unused imports and variables.
- Keep functions focused and under 50 lines when practical; split larger functions when doing so improves clarity.
- Avoid premature abstraction.
- Prefer readable, maintainable code over clever implementations.
- Do not introduce unrelated refactors.

## Environment Variables and Secrets

- Never commit secrets.
- Use environment variables for database credentials, authentication secrets, OAuth credentials, Neon credentials, and other private configuration.
- Keep local `.env` files out of version control according to the project's existing setup.
