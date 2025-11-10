/**
 * Central export point for all GraphQL queries and mutations
 * 
 * This file re-exports all GraphQL operations organized by domain:
 * - Fragments: Reusable GraphQL fragments
 * - Movies: Movie-related queries and mutations
 * - People: Person/actor/director-related queries
 * - Auth: Authentication mutations
 * - User: User profile, saved movies, ratings, reviews
 * - Collections: Collection management queries and mutations
 */

// Fragments
export { MOVIE_FRAGMENT } from "./fragments";

// Movies
export {
  SUGGEST_MOVIE,
  SUGGEST_MOVIE_ROUND,
  GET_MOVIE,
  SEARCH_MOVIES,
  RANDOM_MOVIE,
  RANDOM_MOVIE_FROM_SOURCE,
  SHUFFLE_MOVIE,
  DISCOVER_MOVIES,
  NOW_PLAYING_MOVIES,
  POPULAR_MOVIES,
  TOP_RATED_MOVIES,
  MOVIE_SELECTION_OPTIONS,
  ACTORS_FROM_FEATURED_MOVIES,
  CREW_FROM_FEATURED_MOVIES,
} from "./movies";

// People
export {
  GET_PERSON,
  SEARCH_PEOPLE,
  RANDOM_PERSON,
  RANDOM_ACTOR_FROM_SOURCE,
  TRENDING_PEOPLE,
} from "./people";

// Authentication
export {
  REGISTER,
  LOGIN,
} from "./auth";

// User
export {
  ME,
  RATINGS,
  REVIEWS,
  RATE_MOVIE,
  REVIEW_MOVIE,
  DELETE_REVIEW,
  UPDATE_NAME,
} from "./user";

// Collections
export {
  COLLECTIONS,
  GET_COLLECTION,
  CREATE_COLLECTION,
  UPDATE_COLLECTION,
  DELETE_COLLECTION,
  ADD_MOVIE_TO_COLLECTION,
  REMOVE_MOVIE_FROM_COLLECTION,
} from "./collections";

// Keywords
export { SEARCH_KEYWORDS } from "./keywords";
export type { Keyword } from "./keywords";

