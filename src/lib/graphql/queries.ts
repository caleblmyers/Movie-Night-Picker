import { gql } from "@apollo/client";

// Movie fragment for reusable fields
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
  }
`;

export const SUGGEST_MOVIE = gql`
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
  }
  query SuggestMovie($preferences: MoviePreferencesInput) {
    suggestMovie(preferences: $preferences) {
      ...MovieFields
    }
  }
`;

export const GET_MOVIE = gql`
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
  }
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

export const SEARCH_MOVIES = gql`
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
  }
  query SearchMovies($query: String!) {
    searchMovies(query: $query) {
      ...MovieFields
    }
  }
`;

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
    }
  }
`;

export const SEARCH_PEOPLE = gql`
  query SearchPeople($query: String!) {
    searchPeople(query: $query) {
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

export const RANDOM_MOVIE = gql`
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
  }
  query RandomMovie {
    randomMovie {
      ...MovieFields
    }
  }
`;

export const RANDOM_PERSON = gql`
  query RandomPerson {
    randomPerson {
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

export const SHUFFLE_MOVIE = gql`
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
  }
  query ShuffleMovie($genres: [String!], $yearRange: [Int!], $cast: [Int!]) {
    shuffleMovie(genres: $genres, yearRange: $yearRange, cast: $cast) {
      ...MovieFields
    }
  }
`;

export const DISCOVER_MOVIES = gql`
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
  }
  query DiscoverMovies($genres: [String!], $yearRange: [Int!], $cast: [Int!]) {
    discoverMovies(genres: $genres, yearRange: $yearRange, cast: $cast) {
      ...MovieFields
    }
  }
`;

// Authentication mutations
export const REGISTER = gql`
  mutation Register($email: String!, $password: String!) {
    register(email: $email, password: $password) {
      token
      user {
        id
        email
        name
      }
    }
  }
`;

export const LOGIN = gql`
  mutation Login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      token
      user {
        id
        email
        name
      }
    }
  }
`;

// User queries
export const ME = gql`
  query Me {
    me {
      id
      email
      name
      createdAt
      savedMovies {
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

export const SAVED_MOVIES = gql`
  query SavedMovies {
    savedMovies {
      id
      tmdbId
      createdAt
      movie {
        id
        title
        overview
        posterUrl
        releaseDate
        voteAverage
      }
      rating {
        id
        value
        createdAt
        updatedAt
      }
      review {
        id
        content
        createdAt
        updatedAt
      }
    }
  }
`;

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

// Movie mutations
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

export const UNSAVE_MOVIE = gql`
  mutation UnsaveMovie($tmdbId: Int!) {
    unsaveMovie(tmdbId: $tmdbId)
  }
`;

// Rating mutations
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

// Review mutations
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

export const DELETE_REVIEW = gql`
  mutation DeleteReview($tmdbId: Int!) {
    deleteReview(tmdbId: $tmdbId)
  }
`;

// User mutations
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

// Collection queries
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

// Collection mutations
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

export const DELETE_COLLECTION = gql`
  mutation DeleteCollection($id: Int!) {
    deleteCollection(id: $id)
  }
`;

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

export const REMOVE_MOVIE_FROM_COLLECTION = gql`
  mutation RemoveMovieFromCollection($collectionId: Int!, $tmdbId: Int!) {
    removeMovieFromCollection(collectionId: $collectionId, tmdbId: $tmdbId)
  }
`;