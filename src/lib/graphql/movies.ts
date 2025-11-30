import { gql } from "@apollo/client";
import { MOVIE_FRAGMENT } from "./fragments";

/**
 * Suggest a movie based on selected movie IDs
 * Backend automatically extracts and aggregates preferences from selected movies
 * Uses progressive fallback automatically if no results found
 */
export const SUGGEST_MOVIE = gql`
  ${MOVIE_FRAGMENT}
  query SuggestMovie($selectedMovieIds: [Int!]!) {
    suggestMovie(selectedMovieIds: $selectedMovieIds) {
      ...MovieFields
    }
  }
`;

/**
 * Get 4 movies for a specific round of the suggest flow
 * Each round presents movies representing different category combinations
 * (genres, moods, eras, keywords, year ranges, actors, directors, etc.)
 */
export const SUGGEST_MOVIE_ROUND = gql`
  ${MOVIE_FRAGMENT}
  query SuggestMovieRound($round: Int!) {
    suggestMovieRound(round: $round) {
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
 * Get a random movie from any source (source is randomized)
 * If source is not provided, backend randomly selects from available sources
 */
export const RANDOM_MOVIE_FROM_SOURCE = gql`
  ${MOVIE_FRAGMENT}
  query RandomMovieFromSource($options: TMDBOptionsInput, $source: MovieSource) {
    randomMovieFromSource(options: $options, source: $source) {
      ...MovieFields
    }
  }
`;

/**
 * @deprecated Use RANDOM_MOVIE_FROM_SOURCE instead
 * Kept for backward compatibility
 */
export const RANDOM_MOVIE = RANDOM_MOVIE_FROM_SOURCE;

/**
 * Shuffle/random movie with filters
 * cast: Filters to actors only (automatically filtered by backend)
 * crew: Filters to directors/writers only (automatically filtered by backend)
 * Supports collection filtering: inCollections, excludeCollections, notInAnyCollection
 * Supports keyword filtering: keywordIds (TMDB keyword IDs)
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
    $watchProviders: String
    $excludeGenres: [Int!]
    $excludeCast: [Int!]
    $excludeCrew: [Int!]
    $popularityRange: [Float!]
    $originCountries: [String!]
    $inCollections: [Int!]
    $excludeCollections: [Int!]
    $notInAnyCollection: Boolean
    $keywordIds: [Int!]
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
      watchProviders: $watchProviders
      excludeGenres: $excludeGenres
      excludeCast: $excludeCast
      excludeCrew: $excludeCrew
      popularityRange: $popularityRange
      originCountries: $originCountries
      inCollections: $inCollections
      excludeCollections: $excludeCollections
      notInAnyCollection: $notInAnyCollection
      keywordIds: $keywordIds
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

/**
 * Get user's 10 most recently suggested movies
 * Returns movies in reverse chronological order (most recent first)
 */
export const SUGGEST_HISTORY = gql`
  ${MOVIE_FRAGMENT}
  query SuggestHistory {
    suggestHistory {
      ...MovieFields
    }
  }
`;

