import { gql } from "@apollo/client";

export const SUGGEST_MOVIE = gql`
  query SuggestMovie($preferences: MoviePreferencesInput) {
    suggestMovie(preferences: $preferences) {
      id
      title
      overview
      posterUrl
      releaseDate
      voteAverage
      voteCount
    }
  }
`;

export const GET_MOVIE = gql`
  query GetMovie($id: Int!) {
    getMovie(id: $id) {
      id
      title
      overview
      posterUrl
      releaseDate
      voteAverage
      voteCount
    }
  }
`;

export const SEARCH_MOVIES = gql`
  query SearchMovies($query: String!) {
    searchMovies(query: $query) {
      id
      title
      overview
      posterUrl
      releaseDate
      voteAverage
      voteCount
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
  query RandomMovie {
    randomMovie {
      id
      title
      overview
      posterUrl
      releaseDate
      voteAverage
      voteCount
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
  query ShuffleMovie($genres: [String!], $yearRange: [Int!], $cast: [Int!]) {
    shuffleMovie(genres: $genres, yearRange: $yearRange, cast: $cast) {
      id
      title
      overview
      posterUrl
      releaseDate
      voteAverage
      voteCount
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
    }
  }
`;

export const MY_SAVED_MOVIES = gql`
  query MySavedMovies {
    mySavedMovies {
      id
      tmdbId
      createdAt
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

// Movie mutations
export const SAVE_MOVIE = gql`
  mutation SaveMovie($tmdbId: Int!) {
    saveMovie(tmdbId: $tmdbId) {
      id
      tmdbId
      createdAt
    }
  }
`;

export const UNSAVE_MOVIE = gql`
  mutation UnsaveMovie($tmdbId: Int!) {
    unsaveMovie(tmdbId: $tmdbId) {
      id
      tmdbId
    }
  }
`;

// Rating mutations
export const RATE_MOVIE = gql`
  mutation RateMovie($tmdbId: Int!, $rating: Int!) {
    rateMovie(tmdbId: $tmdbId, rating: $rating) {
      id
      value
    }
  }
`;

// Review mutations
export const REVIEW_MOVIE = gql`
  mutation ReviewMovie($tmdbId: Int!, $content: String!) {
    reviewMovie(tmdbId: $tmdbId, content: $content) {
      id
      content
    }
  }
`;

export const DELETE_REVIEW = gql`
  mutation DeleteReview($tmdbId: Int!) {
    deleteReview(tmdbId: $tmdbId) {
      id
    }
  }
`;