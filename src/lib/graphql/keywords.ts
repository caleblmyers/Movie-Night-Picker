import { gql } from "@apollo/client";

/**
 * Keyword type from TMDB
 */
export interface Keyword {
  id: number;
  name: string;
}

/**
 * Search for keywords by query string
 * Used for autocomplete in filter UI
 * Supports limit parameter (default: 20, max: 100)
 * Results are cached for 24 hours on the backend
 */
export const SEARCH_KEYWORDS = gql`
  query SearchKeywords($query: String!, $limit: Int) {
    searchKeywords(query: $query, limit: $limit) {
      id
      name
    }
  }
`;

