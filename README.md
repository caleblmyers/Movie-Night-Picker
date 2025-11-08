# Movie Night Picker

A modern web application that helps you pick the perfect movie for your movie night using intelligent suggestions and random discovery. Save your favorites, rate and review movies, and organize them into collections.

![Movie Night Picker](https://img.shields.io/badge/Next.js-15.5.6-black?style=flat-square&logo=next.js)
![React](https://img.shields.io/badge/React-19.2.0-blue?style=flat-square&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=flat-square&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.1.16-38bdf8?style=flat-square&logo=tailwind-css)

## 🎬 Features

### Movie Discovery

#### **SUGGEST** - Personalized Recommendations
- Interactive selection process: Choose from options across 5 rounds
- Select from genres, actors, movies, and year ranges
- Aggregate your preferences to receive a personalized movie suggestion
- Each round presents 2-4 options to refine your taste profile

#### **SHUFFLE** - Random Discovery
- Filter movies by multiple parameters:
  - **Genres**: Select one or more genres
  - **Year Range**: Choose a specific time period (1950-present)
  - **Cast Members**: Search and add specific actors/actresses
- Get a random movie matching your criteria
- Perfect for discovering hidden gems

### User Features (Requires Account)

- **Save Movies**: Build your personal watchlist
- **Rate Movies**: Rate movies on a scale of 1-10
- **Write Reviews**: Share your thoughts and opinions
- **Collections**: Organize movies into custom collections (public or private)
- **Profile**: View all your saved movies, ratings, and reviews in one place

### Smart Features

- **Rating Lock**: Once you write a review, your rating becomes read-only (with edit option) to maintain consistency
- **Recommendations**: Get personalized recommendations based on your saved movies and preferences
- **Movie Details**: Full movie information from TMDB including posters, overviews, and ratings

## 🛠️ Tech Stack

### Frontend
- **Next.js 15.5.6** - React framework with App Router
- **React 19.2.0** - UI library
- **TypeScript** - Type safety
- **Tailwind CSS 4.1.16** - Utility-first CSS framework
- **Apollo Client 4.0.9** - GraphQL client
- **NextAuth.js 5.0** - Authentication
- **Radix UI** - Accessible component primitives
- **Lucide React** - Icon library

### Backend Integration
- **GraphQL API** - Communicates with backend via GraphQL
- **JWT Authentication** - Secure token-based auth
- **REST API Routes** - Next.js API routes for server-side operations

### External Services
- **TMDB API** - Movie data and images (accessed via backend, not directly from frontend)

## 📋 Prerequisites

- **Node.js** 18+ installed
- **npm**, **yarn**, **pnpm**, or **bun** package manager
- **Backend API** running (see backend repository for setup)
  - Default: `http://localhost:4000`
  - Must expose GraphQL endpoint at `/graphql`

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone <repository-url>
cd movie-night-picker
```

### 2. Install Dependencies

```bash
npm install
# or
yarn install
# or
pnpm install
```

### 3. Environment Setup

1. Copy the example environment file:
   ```bash
   cp .env.example .env.local
   ```

2. Edit `.env.local` and configure the following variables:

   ```env
   # Backend API Configuration
   # The base URL of your backend API (without /graphql)
   BACKEND_API_URL=http://localhost:4000
   NEXT_PUBLIC_BACKEND_API_URL=http://localhost:4000

   # NextAuth.js Configuration
   # Generate a random secret: openssl rand -base64 32
   # Or use: https://generate-secret.vercel.app/32
   AUTH_SECRET=your-secret-key-here
   NEXTAUTH_SECRET=your-secret-key-here
   ```

   **Important**: 
   - `BACKEND_API_URL` is used server-side
   - `NEXT_PUBLIC_BACKEND_API_URL` is used client-side (must be prefixed with `NEXT_PUBLIC_`)
   - For production, update these to your production API URL
   - Generate a secure `AUTH_SECRET` for production use

### 4. Start the Development Server

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

## 📁 Project Structure

```
movie-night-picker/
├── src/
│   ├── app/                    # Next.js App Router pages
│   │   ├── api/                # API routes (Next.js API handlers)
│   │   │   ├── auth/           # Authentication endpoints
│   │   │   ├── movies/         # Movie operations (save, unsave, saved)
│   │   │   ├── ratings/        # Rating endpoints
│   │   │   └── reviews/        # Review endpoints
│   │   ├── login/              # Login page
│   │   ├── register/           # Registration page
│   │   ├── profile/            # User profile page
│   │   ├── suggest/            # Movie suggestion page
│   │   ├── shuffle/             # Movie shuffle page
│   │   └── page.tsx            # Home page
│   ├── components/
│   │   ├── providers/          # React context providers
│   │   │   ├── apollo-provider.tsx
│   │   │   └── session-provider.tsx
│   │   ├── shared/             # Shared components
│   │   │   ├── navbar.tsx
│   │   │   ├── footer.tsx
│   │   │   ├── loading-state.tsx
│   │   │   └── error-state.tsx
│   │   ├── shuffle/             # Shuffle page components
│   │   │   ├── genre-filter.tsx
│   │   │   ├── year-range-filter.tsx
│   │   │   └── cast-filter.tsx
│   │   ├── suggest/             # Suggest page components
│   │   │   ├── selection-round.tsx
│   │   │   ├── movie-result.tsx
│   │   │   ├── save-movie-button.tsx
│   │   │   └── rating-review-section.tsx
│   │   └── ui/                  # Reusable UI components
│   │       ├── button.tsx
│   │       ├── input.tsx
│   │       ├── slider.tsx
│   │       └── ...
│   ├── lib/
│   │   ├── graphql/
│   │   │   └── queries.ts      # All GraphQL queries and mutations
│   │   ├── utils/
│   │   │   ├── api-helpers.ts   # API route utilities
│   │   │   ├── api-client.ts    # Client-side API utilities
│   │   │   ├── graphql-client.ts # GraphQL request utilities
│   │   │   ├── validation.ts    # Input validation utilities
│   │   │   └── error-handler.ts # Error handling utilities
│   │   ├── auth.ts              # NextAuth configuration
│   │   ├── config.ts            # App configuration and constants
│   │   └── tmdb-options.ts      # TMDB genre/option generators
│   └── types/
│       ├── suggest.ts           # TypeScript type definitions
│       └── next-auth.d.ts       # NextAuth type extensions
├── public/                      # Static assets
├── .env.example                 # Environment variables template
└── package.json
```

## 🔌 API Integration

### Backend Requirements

The frontend communicates with a backend API that must provide:

1. **GraphQL Endpoint** at `/graphql` with the following operations:

   **Queries:**
   - `suggestMovie(preferences: MoviePreferencesInput): Movie`
   - `shuffleMovie(genres, yearRange, cast): Movie`
   - `getMovie(id: Int!): Movie`
   - `searchMovies(query: String!): [Movie!]!`
   - `randomMovie: Movie`
   - `randomPerson: Person`
   - `searchPeople(query: String!): [Person!]!`
   - `me: User`
   - `savedMovies: [SavedMovie!]!`
   - `ratings: [Rating!]!`
   - `reviews: [Review!]!`
   - `collections: [Collection!]!`

   **Mutations:**
   - `register(email, password): AuthPayload`
   - `login(email, password): AuthPayload`
   - `saveMovie(tmdbId): SavedMovie!`
   - `unsaveMovie(tmdbId): Boolean!`
   - `rateMovie(tmdbId, rating): Rating!`
   - `reviewMovie(tmdbId, content): Review!`
   - `deleteReview(tmdbId): Boolean!`
   - `updateName(name): User!`
   - `createCollection(name, description, isPublic): Collection!`
   - `updateCollection(id, name, description, isPublic): Collection!`
   - `deleteCollection(id): Boolean!`
   - `addMovieToCollection(collectionId, tmdbId): CollectionMovie!`
   - `removeMovieFromCollection(collectionId, tmdbId): Boolean!`

2. **Authentication**: JWT token-based authentication
   - Tokens sent in `Authorization: Bearer <token>` header
   - Token stored in NextAuth session and localStorage

3. **TMDB Integration**: Backend must fetch movie data from TMDB API
   - Frontend never directly accesses TMDB API
   - All movie data comes through the backend GraphQL API

### API Communication Flow

```
Frontend (Next.js)
    ↓
Next.js API Routes (/api/*)
    ↓
GraphQL Client Utilities
    ↓
Backend GraphQL API (http://localhost:4000/graphql)
    ↓
TMDB API (via backend)
```

## 🎯 Usage

### Suggest a Movie

1. Navigate to **Suggest** from the home page or navbar
2. Complete 5 rounds of selections:
   - Round 1-5: Choose from genres, actors, movies, or year ranges
   - Each round presents 2-4 options
3. After completing all rounds, receive a personalized movie suggestion
4. Save, rate, or review the suggested movie

### Shuffle & Discover

1. Navigate to **Shuffle** from the home page or navbar
2. Optionally set filters:
   - Select genres
   - Choose a year range (slider)
   - Search and add cast members
3. Click **Shuffle Movie** to get a random movie matching your criteria
4. Save, rate, or review the discovered movie

### Save, Rate, and Review Movies

1. **Sign up** or **log in** to your account
2. After getting a movie suggestion or shuffle result:
   - Click **Save Movie** to add to your watchlist
   - Use the **Rating Slider** (1-10) to rate the movie
   - Write a **Review** in the text area
3. View all saved movies, ratings, and reviews in your **Profile**

### Collections

- Create custom collections to organize your movies
- Make collections public or private
- Add movies to multiple collections
- Manage collections from your profile

## 🧪 Development

### Available Scripts

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Start production server
npm run start

# Run linter
npm run lint
```

### Code Organization

- **GraphQL Queries**: All queries and mutations are centralized in `src/lib/graphql/queries.ts`
- **API Routes**: Server-side API handlers in `src/app/api/`
- **Utilities**: Reusable functions in `src/lib/utils/`
- **Components**: Organized by feature in `src/components/`
- **Types**: TypeScript definitions in `src/types/`

### Key Features

- **Type Safety**: Full TypeScript coverage
- **Error Handling**: Centralized error handling utilities
- **Validation**: Input validation for API requests
- **Authentication**: NextAuth.js with JWT tokens
- **Responsive Design**: Mobile-first Tailwind CSS
- **Accessibility**: Radix UI components for accessibility

## 📝 Environment Variables

| Variable | Description | Required | Example |
|----------|-------------|----------|---------|
| `BACKEND_API_URL` | Backend API base URL (server-side) | Yes | `http://localhost:4000` |
| `NEXT_PUBLIC_BACKEND_API_URL` | Backend API base URL (client-side) | Yes | `http://localhost:4000` |
| `AUTH_SECRET` | NextAuth.js secret key | Yes | Generated secret |
| `NEXTAUTH_SECRET` | NextAuth.js fallback secret | Optional | Generated secret |

## 🎨 Theming

The application features a **movie theater theme** with:
- Deep purple and rich red color palette
- Gold accents
- Gradient text effects
- Smooth animations
- Modern, welcoming design

## 📚 Attribution

This product uses the [TMDB API](https://www.themoviedb.org) but is not endorsed or certified by TMDB.

Movie data and images provided by [The Movie Database](https://www.themoviedb.org).

## 🚀 Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Import project in [Vercel](https://vercel.com)
3. Add environment variables in Vercel dashboard
4. Deploy

### Other Platforms

The application can be deployed to any platform that supports Next.js:
- **Netlify**
- **Railway**
- **AWS Amplify**
- **Docker** (with custom Dockerfile)

Make sure to set all required environment variables in your deployment platform.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is private and proprietary.

## 🆘 Support

For issues or questions:
1. Check the [Issues](../../issues) page
2. Review the backend API documentation
3. Ensure all environment variables are set correctly
4. Verify the backend API is running and accessible

---

**Made with ❤️ for movie lovers everywhere**
