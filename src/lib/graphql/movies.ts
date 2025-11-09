import { gql } from "@apollo/client";
import { MOVIE_FRAGMENT } from "./fragments";

/**
 * Suggest a movie based on user preferences
 * Uses progressive fallback automatically if no results found
 */
export const SUGGEST_MOVIE = gql`
  ${MOVIE_FRAGMENT}
  query SuggestMovie($preferences: MoviePreferencesInput) {
    suggestMovie(preferences: $preferences) {
      ...MovieFields
    }
  }
`;

/**
 * Get a single movie by TMDB ID
 * Automatically includes credits (cast and crew) for detail pages
 * Cast is limited to top 20 members
 * Crew is filtered to directors, writers, and producers (top 15)
 */
export const GET_MOVIE = gql`
  ${MOVIE_FRAGMENT}
  query GetMovie($id: Int!) {
    getMovie(id: $id) {
      ...MovieFields
      reviews {
        id
        content
        user {
          id
          email
          name
        }
        createdAt
      }
      ratings {
        id
        value
        user {
          id
          email
          name
        }
        createdAt
      }
    }
  }
`;

/**
 * Search movies by query string
 * Supports smart, case-insensitive partial matching
 * Results are cached for 5 minutes on the backend
 */
export const SEARCH_MOVIES = gql`
  query SearchMovies($query: String!, $limit: Int) {
    searchMovies(query: $query, limit: $limit) {
      id
      title
      posterUrl
      releaseDate
      voteAverage
      genres {
        id
        name
      }
    }
  }
`;

/**
 * Get a random movie
 */
export const RANDOM_MOVIE = gql`
  ${MOVIE_FRAGMENT}
  query RandomMovie {
    randomMovie {
      ...MovieFields
    }
  }
`;

/**
 * Shuffle/random movie with filters
 * cast: Filters to actors only (automatically filtered by backend)
 * crew: Filters to directors/writers only (automatically filtered by backend)
 */
export const SHUFFLE_MOVIE = gql`
  ${MOVIE_FRAGMENT}
  query ShuffleMovie(
    $genres: [Int!]
    $yearRange: [Int!]
    $cast: [Int!]
    $crew: [Int!]
    $minVoteAverage: Float
    $minVoteCount: Int
    $runtimeRange: [Int!]
    $originalLanguage: String
  ) {
    shuffleMovie(
      genres: $genres
      yearRange: $yearRange
      cast: $cast
      crew: $crew
      minVoteAverage: $minVoteAverage
      minVoteCount: $minVoteCount
      runtimeRange: $runtimeRange
      originalLanguage: $originalLanguage
    ) {
      ...MovieFields
    }
  }
`;

/**
 * Discover movies with filters
 * cast: Filters to actors only (automatically filtered by backend)
 * crew: Filters to directors/writers only (automatically filtered by backend)
 */
export const DISCOVER_MOVIES = gql`
  ${MOVIE_FRAGMENT}
  query DiscoverMovies($genres: [String!], $yearRange: [Int!], $cast: [Int!], $crew: [Int!]) {
    discoverMovies(genres: $genres, yearRange: $yearRange, cast: $cast, crew: $crew) {
      ...MovieFields
    }
  }
`;

/**
 * Save a movie to user's saved list
 */
export const SAVE_MOVIE = gql`
  mutation SaveMovie($tmdbId: Int!) {
    saveMovie(tmdbId: $tmdbId) {
      id
      tmdbId
      createdAt
      movie {
        id
        title
        posterUrl
        releaseDate
      }
      rating {
        id
        value
      }
      review {
        id
        content
      }
    }
  }
`;

/**
 * Remove a movie from user's saved list
 */
export const UNSAVE_MOVIE = gql`
  mutation UnsaveMovie($tmdbId: Int!) {
    unsaveMovie(tmdbId: $tmdbId)
  }
`;

/**
 * Get movies currently playing in theaters
 * options: Optional TMDB options (region, language, page, etc.)
 */
export const NOW_PLAYING_MOVIES = gql`
  ${MOVIE_FRAGMENT}
  query NowPlayingMovies($options: TMDBOptionsInput) {
    nowPlayingMovies(options: $options) {
      ...MovieFields
    }
  }
`;

/**
 * Get popular movies
 * options: Optional TMDB options (region, language, page, etc.)
 */
export const POPULAR_MOVIES = gql`
  ${MOVIE_FRAGMENT}
  query PopularMovies($options: TMDBOptionsInput) {
    popularMovies(options: $options) {
      ...MovieFields
    }
  }
`;

/**
 * Get top rated movies
 * options: Optional TMDB options (region, language, page, etc.)
 */
export const TOP_RATED_MOVIES = gql`
  ${MOVIE_FRAGMENT}
  query TopRatedMovies($options: TMDBOptionsInput) {
    topRatedMovies(options: $options) {
      ...MovieFields
    }
  }
`;

/**
 * Get all available selection options for the suggest flow
 * Returns genres, moods, and eras
 */
export const MOVIE_SELECTION_OPTIONS = gql`
  query MovieSelectionOptions {
    movieSelectionOptions {
      genres {
        id
        name
        icon
      }
      moods {
        id
        label
        icon
      }
      eras {
        id
        label
        value
        icon
      }
    }
  }
`;

/**
 * Get actors from featured movies (top rated, popular, now playing)
 * options: Optional TMDB options (region, language, etc.)
 */
export const ACTORS_FROM_FEATURED_MOVIES = gql`
  query ActorsFromFeaturedMovies($options: TMDBOptionsInput) {
    actorsFromFeaturedMovies(options: $options) {
      id
      name
      profileUrl
      knownForDepartment
      popularity
    }
  }
`;

/**
 * Get crew (directors/writers) from featured movies (top rated, popular, now playing)
 * options: Optional TMDB options (region, language, etc.)
 */
export const CREW_FROM_FEATURED_MOVIES = gql`
  query CrewFromFeaturedMovies($options: TMDBOptionsInput) {
    crewFromFeaturedMovies(options: $options) {
      id
      name
      profileUrl
      knownForDepartment
      popularity
    }
  }
`;

