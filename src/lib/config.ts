/**
 * Application configuration constants
 */

export const AUTH_TOKEN_KEY = "authToken";

/**
 * Gets the GraphQL API URL from environment variables
 * @throws Error if the required environment variable is not set
 */
export const getGraphQLUrl = (): string => {
  if (typeof window !== "undefined") {
    // Client-side: use NEXT_PUBLIC_ prefix for client-side access
    const backendUrl = process.env.NEXT_PUBLIC_BACKEND_API_URL;
    if (!backendUrl) {
      throw new Error(
        "NEXT_PUBLIC_BACKEND_API_URL environment variable is required. " +
        "Please set it in your .env.local file (e.g., NEXT_PUBLIC_BACKEND_API_URL=http://localhost:4000)"
      );
    }
    return `${backendUrl}/graphql`;
  }
  
  // Server-side: use BACKEND_API_URL (without NEXT_PUBLIC_ prefix)
  const backendUrl = process.env.BACKEND_API_URL;
  if (!backendUrl) {
    throw new Error(
      "BACKEND_API_URL environment variable is required. " +
      "Please set it in your .env.local file (e.g., BACKEND_API_URL=http://localhost:4000)"
    );
  }
  return `${backendUrl}/graphql`;
};

export const RATING_MIN = 1;
export const RATING_MAX = 10;
export const PASSWORD_MIN_LENGTH = 6;

