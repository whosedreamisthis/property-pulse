# Property Pulse — Claude Code Instructions

Property Pulse is a property rental application. Product requirements, features, architecture, data model, routes, and UI direction live in `@context/project-overview.md`.

## Context Files

Read these before making changes:

- `@context/project-overview.md` — product and architecture source of truth
- `@context/coding-standards.md` — implementation and code-quality rules
- `@context/ai-interaction.md` — AI collaboration guidance, when present
- `@context/current-feature.md` — current feature/task context

Do not duplicate project requirements from the overview into this file. If context files conflict or requirements are ambiguous, ask before inventing behavior.

## Development Workflow

1. Read the relevant context files.
2. Inspect the existing implementation before changing it.
3. Follow the established project patterns and coding standards.
4. Make the smallest focused change that satisfies the requirement.
5. Validate authentication, authorization, input validation, and database behavior for affected features.
6. Run the relevant typecheck, lint, and tests.
7. Review the final diff for unrelated changes.
8. Update `@context/current-feature.md` when the project's workflow calls for it.

Do not claim a command, test, migration, build, or database operation succeeded unless it was actually run and verified.

## Architecture Rules

- Use the stack and architecture documented in the project overview.
- Prefer existing libraries and project utilities over introducing new dependencies.
- Use Server Components by default.
- Keep server-only code on the server.
- Use Server Actions for appropriate mutations.
- Use API routes only for cases that genuinely require an HTTP endpoint.
- Keep business logic out of purely presentational components.
- Do not introduce a competing architectural pattern without a clear reason.

## Authentication and Authorization

- Use the project's configured NextAuth/Auth.js setup.
- Enforce authorization on the server.
- Never treat hidden UI controls as authorization.
- Verify resource ownership server-side before owner-specific mutations.
- Do not trust user IDs, roles, or ownership values supplied by the client.
- Administrative operations require the appropriate authenticated role.

## Neon and Database Safety

Neon is the PostgreSQL provider for Property Pulse, with Prisma as the ORM.

When Neon MCP tools are available:

- Use only the Property Pulse Neon project.
- Use the development branch for normal development.
- Never use production unless the user explicitly requests production.
- Pass the correct Property Pulse project and branch IDs when required by the MCP tool.
- If the target project or branch is ambiguous, ask before making the database operation.
- Never infer Neon IDs from another project.

For database changes:

- Follow the migration rules in `@context/coding-standards.md`.
- Never reset, delete, or modify production as part of ordinary development.
- Before destructive operations, confirm the target environment.
- Do not delete existing data just to make a migration or test pass.

## Scope Control

- Do not rewrite unrelated files.
- Do not remove working functionality without a reason.
- Avoid unrelated refactors while implementing a feature.
- Preserve existing conventions.
- Keep changes easy to review.
- Explain significant architectural changes before making broad changes.

## Completion Standard

A feature is complete only when its implementation, validation, authorization, database behavior, relevant tests, and user-facing states have been checked as applicable.

The goal is a small, correct, maintainable change that fits the documented Property Pulse architecture.
