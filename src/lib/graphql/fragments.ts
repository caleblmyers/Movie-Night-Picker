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
    runtime
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
    genres {
      id
      name
      icon
    }
    trailer {
      key
      site
      name
      type
      url
    }
    cast {
      id
      name
      character
      profileUrl
      order
    }
    crew {
      id
      name
      job
      department
      profileUrl
    }
  }
`;

