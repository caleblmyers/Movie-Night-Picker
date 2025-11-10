import { gql } from "@apollo/client";

/**
 * Get current authenticated user's profile
 */
export const ME = gql`
  query Me {
    me {
      id
      email
      name
      createdAt
      ratings {
        id
        tmdbId
        value
        createdAt
        updatedAt
        movie {
          id
          title
          posterUrl
        }
      }
      reviews {
        id
        tmdbId
        content
        createdAt
        updatedAt
        movie {
          id
          title
          posterUrl
        }
      }
      collections {
        id
        name
        description
        isPublic
        movieCount
      }
    }
  }
`;

/**
 * Get user's ratings
 */
export const RATINGS = gql`
  query Ratings {
    ratings {
      id
      tmdbId
      value
      createdAt
      updatedAt
      movie {
        id
        title
        overview
        posterUrl
        releaseDate
        voteAverage
      }
      user {
        id
        email
        name
      }
    }
  }
`;

/**
 * Get user's reviews
 */
export const REVIEWS = gql`
  query Reviews {
    reviews {
      id
      tmdbId
      content
      createdAt
      updatedAt
      movie {
        id
        title
        overview
        posterUrl
        releaseDate
        voteAverage
      }
      user {
        id
        email
        name
      }
    }
  }
`;

/**
 * Rate a movie
 */
export const RATE_MOVIE = gql`
  mutation RateMovie($tmdbId: Int!, $rating: Int!) {
    rateMovie(tmdbId: $tmdbId, rating: $rating) {
      id
      tmdbId
      value
      createdAt
      updatedAt
      movie {
        id
        title
        posterUrl
        releaseDate
      }
      user {
        id
        email
        name
      }
    }
  }
`;

/**
 * Create or update a review for a movie
 */
export const REVIEW_MOVIE = gql`
  mutation ReviewMovie($tmdbId: Int!, $content: String!) {
    reviewMovie(tmdbId: $tmdbId, content: $content) {
      id
      tmdbId
      content
      createdAt
      updatedAt
      movie {
        id
        title
        posterUrl
        releaseDate
      }
      user {
        id
        email
        name
      }
    }
  }
`;

/**
 * Delete a review
 */
export const DELETE_REVIEW = gql`
  mutation DeleteReview($tmdbId: Int!) {
    deleteReview(tmdbId: $tmdbId)
  }
`;

/**
 * Update user's name
 */
export const UPDATE_NAME = gql`
  mutation UpdateName($name: String!) {
    updateName(name: $name) {
      id
      email
      name
      createdAt
    }
  }
`;

