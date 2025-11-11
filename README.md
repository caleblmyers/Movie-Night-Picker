# Movie Night Picker

Find the perfect movie for your movie night using intelligent suggestions and random discovery. Save your favorites, rate and review movies, and organize them into collections.

🌐 **[Live Application](https://movie-night-picker-ochre.vercel.app/)** | 📖 [Documentation](#usage) | 🛠️ [Tech Stack](#-tech-stack)

![Movie Night Picker](https://img.shields.io/badge/Next.js-15.5.6-black?style=flat-square&logo=next.js)
![React](https://img.shields.io/badge/React-19.2.0-blue?style=flat-square&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=flat-square&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-4.1.16-38bdf8?style=flat-square&logo=tailwind-css)

## 🎬 Features

### Movie Discovery

#### **SUGGEST** - Personalized Recommendations
- Interactive selection process: Choose from movies across 5 rounds
- Each round presents 4 diverse movie options
- Select movies that interest you to build your taste profile
- Backend automatically extracts genres, keywords, actors, directors, and year ranges from your selections
- Receive a personalized movie suggestion based on aggregated preferences

#### **SHUFFLE** - Random Discovery
- Filter movies by multiple parameters:
  - **Genres**: Select one or more genres (include or exclude)
  - **Year Range**: Choose a specific time period (1950-present)
  - **Cast & Crew**: Search and add specific actors, directors, or crew members
  - **Streaming Providers**: Filter by availability on specific platforms
  - **Vote Average & Count**: Set minimum ratings and vote counts
  - **Runtime**: Filter by movie length
  - **Language**: Filter by original language
  - **Popularity**: Filter by movie popularity range
  - **Production Countries**: Filter by countries of origin
  - **Collections**: Include or exclude movies from your collections
- Get a random movie matching your criteria
- Perfect for discovering hidden gems

### User Features (Requires Account)

- **Save Movies**: Add movies to your default "Saved Movies" collection (automatically created)
- **Rate Movies**: Rate movies on a scale of 1-10
- **Write Reviews**: Share your thoughts and opinions
- **Collections**: Organize movies into custom collections (public or private)
  - Create unlimited collections
  - View collection insights (genres, actors, year ranges, statistics)
  - Horizontal scrolling movie previews
- **Profile**: View all your collections, ratings, and reviews in one place
- **Movie & Person Search**: Search for movies and people with autocomplete
- **Movie Detail Pages**: View full movie information including cast, crew, trailers, and keywords
- **Person Detail Pages**: View actor/director profiles with their movie credits

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

## 🎯 Usage

### Suggest a Movie

1. Navigate to **Suggest** from the home page or navbar
2. Complete 5 rounds of movie selections:
   - Each round presents 4 diverse movie options
   - Select the movie that interests you most
   - Backend automatically extracts preferences from your selections
3. After completing all 5 rounds, receive a personalized movie suggestion
4. Save the movie to your "Saved Movies" collection, rate it, or write a review

### Shuffle & Discover

1. Navigate to **Shuffle** from the home page or navbar
2. Set core filters (always visible):
   - Select genres (include or exclude)
   - Choose a year range (slider)
   - Search and add cast members
   - Search and add crew members (directors, writers, etc.)
3. Optionally expand advanced filters:
   - Vote average and vote count minimums
   - Runtime range
   - Original language
   - Streaming providers
   - Popularity range
   - Production countries
   - Collection filters (include/exclude)
4. Click **Shuffle Movie** to get a random movie matching your criteria
5. Save the movie to your collections, rate it, or write a review

### Save, Rate, and Review Movies

1. **Sign up** or **log in** to your account
2. After getting a movie suggestion or shuffle result:
   - Click **Save Movie** to add to your default "Saved Movies" collection
   - Use the **Rating Slider** (1-10) to rate the movie
   - Write a **Review** in the text area
3. View all your collections, ratings, and reviews in your **Profile**

### Collections

- **Default Collection**: Every user gets a "Saved Movies" collection automatically
- **Custom Collections**: Create unlimited custom collections to organize your movies
- **Collection Features**:
  - Make collections public or private
  - Add movies to multiple collections
  - View collection insights (genres, top actors, year ranges, statistics)
  - Horizontal scrolling movie previews on profile
- **Management**: Create, edit, and manage collections from your profile or collection pages
- **Filtering**: Use collections as filters in the shuffle feature

## 🧪 Development

### Code Organization

- **GraphQL Queries**: Organized by domain in `src/lib/graphql/` (movies, people, collections, etc.)
- **API Routes**: Server-side API handlers in `src/app/api/` (auth, ratings, reviews)
- **Utilities**: Reusable functions in `src/lib/utils/`
- **Components**: Organized by feature and type:
  - `components/common/` - Shared presentational components
  - `components/ui/` - Reusable UI primitives (shadcn/ui)
  - `components/shuffle/` - Shuffle page components
  - `components/suggest/` - Suggest page components
  - `components/collections/` - Collection management components
  - `components/profile/` - Profile page components
  - `components/search/` - Search components
  - `components/shared/` - Global shared components (navbar, footer, etc.)
- **Types**: TypeScript definitions in `src/types/`
- **Hooks**: Custom React hooks in `src/hooks/`

### Key Features

- **Type Safety**: Full TypeScript coverage
- **Error Handling**: Centralized error handling utilities
- **Validation**: Input validation for API requests
- **Authentication**: NextAuth.js with JWT tokens
- **Responsive Design**: Mobile-first Tailwind CSS
- **Accessibility**: Radix UI components for accessibility
- **Performance**: Optimized with React.memo, useMemo, and useCallback
- **Code Quality**: Clean, maintainable code with removed unused dependencies
- **Component Reusability**: Shared components for consistent UI patterns

## 📚 Attribution

This product uses the [TMDB API](https://www.themoviedb.org) but is not endorsed or certified by TMDB.

Movie data and images provided by [The Movie Database](https://www.themoviedb.org).

## 📄 License

This project is licensed under the MIT License.

Copyright (c) 2024 Movie Night Picker

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.

---

**Made with ❤️ for movie lovers everywhere**
