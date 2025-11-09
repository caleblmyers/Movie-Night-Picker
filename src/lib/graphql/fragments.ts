import { gql } from "@apollo/client";

/**
 * Reusable fragment for Movie fields
 * Used across multiple queries to ensure consistency
 */
export const MOVIE_FRAGMENT = gql`
  fragment MovieFields on Movie {
    id
    title
    overview
    posterUrl
    releaseDate
    voteAverage
    voteCount
    isSaved
    rating {
      id
      value
    }
    review {
      id
      content
    }
    averageUserRating
    inCollections {
      id
      name
      description
      isPublic
    }
    trailer {
      key
      site
      name
      type
      url
    }
  }
`;

