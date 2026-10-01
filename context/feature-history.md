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
