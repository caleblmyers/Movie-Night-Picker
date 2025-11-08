/**
 * Application configuration constants
 */

export const AUTH_TOKEN_KEY = "authToken";
export const DEFAULT_GRAPHQL_URL = "http://localhost:4000/graphql";

export const getGraphQLUrl = (): string => {
  if (typeof window !== "undefined") {
    // Client-side
    return process.env.NEXT_PUBLIC_BACKEND_API_URL
      ? `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/graphql`
      : DEFAULT_GRAPHQL_URL;
  }
  // Server-side
  return process.env.BACKEND_API_URL
    ? `${process.env.BACKEND_API_URL}/graphql`
    : DEFAULT_GRAPHQL_URL;
};

export const RATING_MIN = 1;
export const RATING_MAX = 10;
export const PASSWORD_MIN_LENGTH = 6;

