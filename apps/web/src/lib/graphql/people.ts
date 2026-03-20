import { gql } from "@apollo/client";

/**
 * Get a single person by TMDB ID
 * Includes movies where the person has credits (cast and crew combined, duplicates removed)
 * Movies are sorted by release date (newest first)
 */
export const GET_PERSON = gql`
  query GetPerson($id: Int!) {
    getPerson(id: $id) {
      id
      name
      biography
      profileUrl
      birthday
      placeOfBirth
      knownForDepartment
      popularity
      movies {
        id
        title
        posterUrl
        releaseDate
        voteAverage
      }
    }
  }
`;

/**
 * Search people by query string with optional role type filter
 * Optimized for autocomplete use cases
 * 
 * Features:
 * - Debounced search (300-500ms recommended on frontend)
 * - Minimum query length: 2-3 characters
 * - Limit: 10-15 for autocomplete dropdowns, 20-100 for full results
 * - Caching: Backend caches results for 5 minutes
 * - Fuzzy matching: TMDB handles partial/case-insensitive matching automatically
 * 
 * roleType: ACTOR (actors only), CREW (directors/writers only), BOTH (all)
 * limit: Maximum number of results (default: 20, max: 100)
 * options: Optional TMDB options (region, language, etc.)
 */
export const SEARCH_PEOPLE = gql`
  query SearchPeople(
    $query: String!
    $roleType: PersonRoleType
    $limit: Int
    $options: TMDBOptionsInput
  ) {
    searchPeople(query: $query, roleType: $roleType, limit: $limit, options: $options) {
      id
      name
      profileUrl
      knownForDepartment
      popularity
      biography
      birthday
      placeOfBirth
    }
  }
`;

/**
 * Get a random actor from any source (source is randomized)
 * If source is not provided, backend randomly selects from available sources
 */
export const RANDOM_ACTOR_FROM_SOURCE = gql`
  query RandomActorFromSource($options: TMDBOptionsInput, $source: PersonSource) {
    randomActorFromSource(options: $options, source: $source) {
      id
      name
      profileUrl
      biography
      birthday
      placeOfBirth
      knownForDepartment
      popularity
    }
  }
`;

/**
 * @deprecated Use RANDOM_ACTOR_FROM_SOURCE instead
 * Kept for backward compatibility
 */
export const RANDOM_PERSON = RANDOM_ACTOR_FROM_SOURCE;

/**
 * Get trending people with optional role type filter
 * roleType: ACTOR (actors only), CREW (directors/writers only), BOTH (all)
 */
export const TRENDING_PEOPLE = gql`
  query TrendingPeople($roleType: PersonRoleType) {
    trendingPeople(roleType: $roleType) {
      id
      name
      biography
      profileUrl
      birthday
      placeOfBirth
      knownForDepartment
      popularity
    }
  }
`;

