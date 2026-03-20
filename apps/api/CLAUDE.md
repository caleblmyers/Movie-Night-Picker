# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
# Development (hot reload via nodemon + ts-node)
npm run dev

# Build TypeScript to dist/
npm run build

# Run compiled build
npm start

# Production (runs migrations then starts)
npm run start:prod

# Database
npm run prisma:migrate    # Create and apply new migration (dev)
npm run prisma:deploy     # Apply pending migrations (production)
npm run prisma:generate   # Regenerate Prisma client
npm run prisma:studio     # Open Prisma Studio GUI

# Local PostgreSQL via Docker
docker-compose up -d
```

There are no tests in this project.

## Environment Variables

Required in `.env`:
- `DATABASE_URL` — PostgreSQL connection string (e.g., `postgresql://postgres:postgres@localhost:5432/movie_night_picker`)
- `TMDB_API_KEY` — TMDB API key (required at server start)
- `JWT_SECRET` — Secret for signing JWTs
- `JWT_EXPIRES_IN` — Token expiry (default: `7d`)
- `FRONTEND_URL` — Allowed CORS origin
- `PORT` — Server port (default: `4000`)

## Architecture

This is a **GraphQL API** (Apollo Server 4 + Express 5) that wraps TMDB's REST API and a PostgreSQL database (via Prisma).

### Request flow

```
HTTP Request
  → Express (CORS + JSON body)
  → Apollo Server at /graphql
  → createContext() — injects { prisma, tmdb, user, req, res }
  → Resolver
  → TMDBDataSource (external API) and/or Prisma (database)
```

### Schema and resolvers

Both are split by domain and merged at `src/schema/index.ts` and `src/resolvers/index.ts`:

| Domain | Schema | Resolver |
|---|---|---|
| Movies | `movieSchema.ts` | `movieResolvers.ts` |
| People | `personSchema.ts` | `personResolvers.ts` |
| Auth | `authSchema.ts` | `authResolvers.ts` |
| Users | `userSchema.ts` | `userResolvers.ts` |
| Collections | `collectionSchema.ts` | `collectionResolvers.ts` |
| Field resolvers | — | `fieldResolvers.ts` |

Schemas use `extend type Query/Mutation` so they can be split across files.

### TMDB DataSource (`src/datasources/tmdb/`)

`TMDBDataSource` is assembled via the mixin pattern — `MovieMethods`, `PeopleMethods`, and `CreditsMethods` are mixed into `TMDBClient` using `applyMixins()`. All TMDB HTTP calls go through `TMDBClient` (Axios-based).

### Authentication

JWT-based. `createContext()` extracts and verifies the token on every request; resolvers receive `context.user` (or `null` for unauthenticated). Auth helpers are in `src/utils/auth.ts`.

### Key utilities

- `src/utils/discoverHelpers.ts` — Builds TMDB discover query params
- `src/utils/collectionInsights.ts` — Aggregates genre/actor/keyword stats for a collection
- `src/utils/tmdbOptionsConverter.ts` — Converts GraphQL filter args to TMDB API params
- `src/utils/transformers.ts` — Maps raw TMDB responses to GraphQL types
- `src/constants/index.ts` — `MOVIE_VIBES`, `ERA_OPTIONS`, `MOOD_TO_KEYWORDS`, `POPULARITY_LEVELS`, genre/era icon maps

### Database models (Prisma)

`User` → `MovieHistory`, `SavedMovie`, `Rating`, `Review`, `Collection` (→ `CollectionMovie`), `SuggestMovieHistory`

All movie references store `tmdbId` (TMDB's integer ID) rather than persisting full movie data.

---

## suggestMovie Flow

### Round structure (`suggestMovieRound`)

Rounds cycle through **one preference dimension per round** — all 4 movies in a round are comparable on that axis so the user's pick sends a clear signal.

| Round | Category | What 4 slots represent |
|---|---|---|
| 1 | genre | 4 distinct genres (Action, Drama, Comedy, Sci-Fi), same era |
| 2 | era | 1 anchor genre (Drama), 4 eras (pre-1980 / 80s-90s / 2000–2014 / 2015+) |
| 3 | mood | 1 anchor genre (Drama), 4 moods via MOOD_TO_KEYWORDS |
| 4 | popularity | 1 anchor genre (Drama), 4 popularity tiers |
| 5 | genre | 4 more genres (Thriller, Horror, Romance, Animation) |
| 6 | era | 1 anchor genre (Action), 4 eras |
| 7 | mood | 1 anchor genre (Action), 4 moods |
| 8 | popularity | 1 anchor genre (Action), 4 popularity tiers |
| 9 | genre | 4 more genres (Crime, Adventure, Fantasy, History) |
| 10 | mixed | 4 eras of inferred top genre (from selectedMovieIds) or default grid |

**`generateCategoryRound(round, anchorGenre?)` in `movieResolvers.ts`** is the single source of truth for this structure.

### Quality floors (primary slot query)

| Category | voteAverageGte | voteCountGte | sortBy |
|---|---|---|---|
| genre | 6.5 | 300 | popularity.desc |
| era | 6.5 | 150 | vote_average.desc |
| mood | 6.5 | 150 | vote_average.desc |
| popularity | 6.0 | 50–500 (tier-specific) | popularity.desc |
| mixed | 7.0 | 200 | vote_average.desc |

### Per-slot fallback chain (three levels)

1. **Primary** — full slot params (genre + year/keywords/popularity + random page 1–3)
2. **Page 1 retry** — if random page returned empty (sparse query), retry page 1 before fallback
3. **Fallback 1** — drop year/keyword constraints, keep genre + popularity tier
4. **Fallback 2** — genre only, relaxed quality (5.0 / 50)
5. If all fail → slot returns `null`

### Exclusion rules (must apply to every discover filter in this flow)

- **`historySet`** — IDs from `getSuggestHistory` (user's past final recommendations, max 10)
- **`selectedSet`** — IDs from `args.selectedMovieIds` (movies the user picked in earlier rounds)

Both must be applied to **all** discover results inside slots AND both fill loops. A movie the user already picked must never reappear in any later round or fill, even as a last resort for `selectedSet`.

### Deduplication and fill

After `Promise.all` resolves the 4 slot promises, **dedup by ID** before the fill loop. Parallel slots sharing an anchor genre can independently pick the same top film.

Fill loop #1 (20 retries, `popular`, quality 6.0/100): requires `!historySet && !selectedSet && !duplicate`.
Fill loop #2 last-resort (15 retries, `top_rated`, quality 5.0/50, `continue` on error — never `break`): requires `!selectedSet && !duplicate`. Accepts history movies as a last resort.

### Variety — page randomization

Primary slot discover uses a random page (1–3) so each call draws from a different candidate pool. Pick from the **full returned page** (up to 20 results), not a top-N slice — the quality floor already guarantees every result meets the minimum bar.

### Final recommendation (`suggestMovie`)

- **Confidence-weighted extraction**: genres/keywords must appear in ≥ 25% of selected movies (or at least once for ≤ 3 selections). Always guarantees ≥ 1 genre.
- **Quality floor**: `voteAverageGte: 6.5`, `voteCountGte: 150`, `sortBy: vote_average.desc`
- **5-strategy cascade**: [top genres + year] → [top genre + keywords] → [top genre + year] → [top genres] → [year only] → random popular fallback
- **Pick from full result page** — not just top-N
