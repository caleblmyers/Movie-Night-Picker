# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev       # Start development server
npm run build     # Production build
npm run lint      # Run ESLint
```

There are no tests in this project.

## Environment Variables

Requires a `.env.local` file:

```
NEXT_PUBLIC_BACKEND_API_URL=http://localhost:4000   # Used client-side
BACKEND_API_URL=http://localhost:4000               # Used server-side
AUTH_SECRET=<secret>                               # NextAuth JWT secret
```

The backend must expose a GraphQL endpoint at `<BACKEND_API_URL>/graphql`. All TMDB API calls go through the backend — the frontend never calls TMDB directly.

## Architecture

### Data Flow

All data fetching uses Apollo Client with GraphQL. Authentication is dual-layer:
- **NextAuth.js** (JWT strategy) — manages the browser session via `src/lib/auth.ts`
- **JWT token in `localStorage`** (`authToken` key) — sent as `Authorization: Bearer <token>` on every Apollo request via `src/components/providers/apollo-provider.tsx`

The token is obtained from the backend's `login` mutation and stored in both the NextAuth session and localStorage. Apollo reads it directly from localStorage on each request.

### Key Patterns

**GraphQL queries** live in `src/lib/graphql/` and are exported from `src/lib/graphql/index.ts`. All movie queries use `MOVIE_FRAGMENT` from `fragments.ts` to ensure consistent field selection. When adding a new query, import `MOVIE_FRAGMENT` if it returns `Movie` type fields.

**Types** are centralized in `src/types/suggest.ts`. The `Movie` type is the core entity. `MovieResult` is an alias with the same shape — prefer `Movie` for new code.

**Custom hooks** encapsulate all business logic:
- `use-suggest-flow` — tracks round state and selected movie IDs for the 5-round suggest flow
- `use-round-movies` — fetches the 4 movies per round via `SUGGEST_MOVIE_ROUND`
- `use-shuffle-movie` — manages all shuffle filter state and the lazy query

**Pages** are thin orchestrators that compose hooks and components. Keep logic in hooks.

### Feature Areas

**Suggest flow** (`/suggest`): 5 rounds where the user picks 1 of 4 movies per round. Selected movie IDs are accumulated and sent to `suggestMovie` mutation after round 5. The backend infers preferences (genres, actors, keywords, year range) from the selected IDs automatically.

`suggestMovieRound` returns `SuggestMovieRoundResult` (not a flat array): `{ movies, category, categoryLabel }`. Always query it as:
```graphql
suggestMovieRound(round: $round, selectedMovieIds: $selectedMovieIds) {
  movies { ...MovieFields }
  category
  categoryLabel
}
```
`selectedMovieIds` must be passed on every round call so the backend can exclude already-selected movies and adapt to user preferences. The backend is solely responsible for excluding previously selected movies — do not filter them client-side. The hook deduplicates within-round results by ID only. If the backend returns fewer than 4 distinct movies the hook emits a `console.warn` — this indicates a backend bug, not a frontend one.

Apollo's `useQuery` retains stale `data` from the previous variables set while loading new results. In `use-round-movies`, guard against this by checking `variables.round === round` before exposing data; treat a mismatch as still loading.

**Shuffle** (`/shuffle`): Filter-based random movie discovery. Filters that are at their default values are sent as `undefined` (not included in the query). The `useShuffleMovie` hook memoizes variables to avoid re-renders.

**Collections**: User-scoped movie lists. Every user has an auto-created "Saved Movies" collection. Collections can be used as include/exclude filters in the shuffle feature.

**Auth-gated features**: Save, rate, review — all require a logged-in session. Components check `isSaved`, `rating`, and `review` fields on `Movie` (populated by backend when authenticated).

### UI

- **Tailwind CSS v4** — uses `@tailwindcss/postcss` plugin
- **Radix UI** primitives wrapped in `src/components/ui/`
- **Iconify** (`@iconify/react`) for icons — icon identifiers follow the format `"lucide:icon-name"`
- `cn()` utility in `src/lib/utils.ts` for conditional class merging (clsx + tailwind-merge)
