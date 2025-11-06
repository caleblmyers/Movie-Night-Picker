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
