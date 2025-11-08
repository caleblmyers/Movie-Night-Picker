import { gql } from "@apollo/client";

/**
 * Get a single person by TMDB ID
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
    }
  }
`;

/**
 * Search people by query string with optional role type filter
 * roleType: ACTOR (actors only), CREW (directors/writers only), BOTH (all)
 */
export const SEARCH_PEOPLE = gql`
  query SearchPeople($query: String!, $roleType: PersonRoleType) {
    searchPeople(query: $query, roleType: $roleType) {
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

/**
 * Get a random person
 */
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

