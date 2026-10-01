# Current Feature: Homepage

Marketing homepage for PropertyPulse, built from `context/screenshots/homepage.jpg` and styled with the project-overview color palette. Visual UI only — no interactivity yet.

## Status

In Progress

## Goals

- Navbar: house logo + "PropertyPulse" wordmark, and a single "Sign In" button on the right (replaces the Google/GitHub icon buttons in the screenshot)
- Hero: large "Find The Perfect Rental" heading, "Discover the perfect property that suits your needs." subheading, and a search row with a location input, a property-type select ("All, Apartment, Studio, Condo, House, 'Cabin or Cottage', Loft, Room, Other"), and a "Search" button
- Two info cards side by side: "For Renters" (gray surface, "Browse Properties" button) and "For Property Owners" (pale-blue surface, "Add Property" button)
- "Featured Properties" section on an ice-blue background with at least one horizontal featured card (image left with price badge, title + property type right)
- Colors use the palette in `context/project-overview.md` (Primary 700 `#1D4ED8` for the navbar and hero, Primary 100/50 for soft backgrounds, Gray 100 for surfaces, Gray 950/700 for text)
- Mobile responsive: cards and search row stack on small screens
- Server Components only; no client state, handlers, or data fetching

## Notes

- Source spec: `context/features/homepage-spec` (the file has no `.md` extension)
- Layout follows the screenshot; it takes precedence over the homepage wireframe in `project-overview.md`, which shows a different layout. Update the project-overview to match the homepage screenshot.
- "Sign In" is a visual placeholder for the NextAuth work that comes next. No auth wiring yet
- Nothing should be interactive: the search input, select, and buttons are presentational only, with no submit handlers, filtering, or `useDebounce`
- Featured property content is hardcoded placeholder data. No database or Prisma yet
- Check `node_modules/next/dist/docs/` before writing code, because this Next.js version has breaking changes (see `AGENTS.md`)

## Completed Features
