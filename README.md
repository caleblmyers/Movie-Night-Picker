# Movie Night Picker

A full-stack movie discovery and recommendation platform that helps users find the perfect movie for movie night. Built as a **pnpm monorepo** with a Next.js frontend and a GraphQL API backend, powered by data from [The Movie Database (TMDB)](https://www.themoviedb.org).

**[Live Application](https://movie-night-picker-ochre.vercel.app/)**

![TypeScript](https://img.shields.io/badge/TypeScript-5.3-blue?style=flat-square&logo=typescript)
![Next.js](https://img.shields.io/badge/Next.js-16-black?style=flat-square&logo=next.js)
![GraphQL](https://img.shields.io/badge/GraphQL-API-e10098?style=flat-square&logo=graphql)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-15-336791?style=flat-square&logo=postgresql)

## Features

### SUGGEST - Personalized Recommendations

An interactive 5-round suggestion system. Each round presents 4 diverse movie options — select the ones that interest you, and the backend extracts genres, keywords, actors, directors, and year ranges from your choices to deliver a personalized recommendation.

### SHUFFLE - Random Discovery

Get a random movie matching your criteria with powerful filters: genres, year range, cast, crew, streaming providers, vote average, runtime, language, popularity, production countries, keywords, and collection membership.

### User Features (Requires Account)

- **Save Movies** to a default or custom collection
- **Rate Movies** on a 1-10 scale
- **Write Reviews** and share your thoughts
- **Collections** - Create unlimited public/private collections with insights and analytics
- **Search** movies and people with autocomplete
- **Movie & Person Detail Pages** with cast, crew, trailers, and filmography

## Tech Stack

| Layer | Technology |
|-------|-----------|
| **Frontend** | Next.js 16, React 19, Tailwind CSS 4, Apollo Client, NextAuth.js |
| **Backend** | Express 5, Apollo Server 4, Prisma ORM, PostgreSQL |
| **Shared** | TypeScript, GraphQL Code Generation, pnpm workspaces |
| **Deployment** | Vercel (web), Render (API), Neon (database) |

## Project Structure

```
movie-night-picker/
  apps/
    web/          # Next.js frontend (App Router, shadcn/ui)
    api/          # Express + Apollo Server GraphQL API
  packages/
    shared-types/ # Generated GraphQL TypeScript types
```

## Getting Started

### Prerequisites

- **Node.js** 20+
- **pnpm** 10+
- **PostgreSQL** (or Docker for local development)
- **TMDB API Key** ([free account](https://www.themoviedb.org/settings/api))

### Setup

```bash
# Install dependencies
pnpm install

# Start PostgreSQL (via Docker)
docker compose up -d

# Set up environment variables
cp apps/api/.env.example apps/api/.env    # Add DATABASE_URL, TMDB_API_KEY, JWT_SECRET
cp apps/web/.env.example apps/web/.env.local  # Add BACKEND_API_URL, AUTH_SECRET

# Run database migrations
pnpm db:migrate

# Generate shared types
pnpm codegen

# Start both apps in development
pnpm dev
```

### Scripts

| Command | Description |
|---------|-------------|
| `pnpm dev` | Start all apps in parallel |
| `pnpm dev:web` | Start frontend only |
| `pnpm dev:api` | Start backend only |
| `pnpm build` | Build all apps |
| `pnpm lint` | Lint all apps |
| `pnpm typecheck` | Type-check all apps |
| `pnpm codegen` | Generate GraphQL types |
| `pnpm db:migrate` | Run Prisma migrations |
| `pnpm db:studio` | Open Prisma Studio |

## Attribution

This product uses the [TMDB API](https://www.themoviedb.org) but is not endorsed or certified by TMDB.

## License

[AGPL-3.0](LICENSE)
