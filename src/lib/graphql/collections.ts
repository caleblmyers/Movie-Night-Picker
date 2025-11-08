import { gql } from "@apollo/client";

/**
 * Get all collections for the authenticated user
 */
export const COLLECTIONS = gql`
  query Collections {
    collections {
      id
      name
      description
      isPublic
      createdAt
      updatedAt
      user {
        id
        email
        name
      }
      movies {
        id
        tmdbId
        addedAt
        movie {
          id
          title
          posterUrl
          releaseDate
        }
      }
      movieCount
    }
  }
`;

/**
 * Get a single collection by ID
 */
export const GET_COLLECTION = gql`
  query GetCollection($id: Int!) {
    getCollection(id: $id) {
      id
      name
      description
      isPublic
      createdAt
      updatedAt
      user {
        id
        email
        name
      }
      movies {
        id
        tmdbId
        addedAt
        movie {
          id
          title
          overview
          posterUrl
          releaseDate
          voteAverage
        }
      }
      movieCount
    }
  }
`;

/**
 * Create a new collection
 */
export const CREATE_COLLECTION = gql`
  mutation CreateCollection($name: String!, $description: String, $isPublic: Boolean) {
    createCollection(name: $name, description: $description, isPublic: $isPublic) {
      id
      name
      description
      isPublic
      createdAt
      updatedAt
      user {
        id
        email
        name
      }
      movies {
        id
        tmdbId
        addedAt
      }
      movieCount
    }
  }
`;

/**
 * Update a collection
 */
export const UPDATE_COLLECTION = gql`
  mutation UpdateCollection($id: Int!, $name: String, $description: String, $isPublic: Boolean) {
    updateCollection(id: $id, name: $name, description: $description, isPublic: $isPublic) {
      id
      name
      description
      isPublic
      createdAt
      updatedAt
      user {
        id
        email
        name
      }
      movies {
        id
        tmdbId
        addedAt
      }
      movieCount
    }
  }
`;

/**
 * Delete a collection
 */
export const DELETE_COLLECTION = gql`
  mutation DeleteCollection($id: Int!) {
    deleteCollection(id: $id)
  }
`;

/**
 * Add a movie to a collection
 */
export const ADD_MOVIE_TO_COLLECTION = gql`
  mutation AddMovieToCollection($collectionId: Int!, $tmdbId: Int!) {
    addMovieToCollection(collectionId: $collectionId, tmdbId: $tmdbId) {
      id
      tmdbId
      addedAt
      movie {
        id
        title
        posterUrl
        releaseDate
      }
    }
  }
`;

/**
 * Remove a movie from a collection
 */
export const REMOVE_MOVIE_FROM_COLLECTION = gql`
  mutation RemoveMovieFromCollection($collectionId: Int!, $tmdbId: Int!) {
    removeMovieFromCollection(collectionId: $collectionId, tmdbId: $tmdbId)
  }
`;

