import { getGraphQLUrl } from "@/lib/config";

export interface GraphQLResponse<T = unknown> {
  data?: T;
  errors?: Array<{ message: string; extensions?: Record<string, unknown> }>;
}

export interface GraphQLRequestOptions {
  query: string;
  variables?: Record<string, unknown>;
  token?: string;
}

/**
 * Makes a GraphQL request to the backend
 */
export async function graphqlRequest<T = unknown>(
  options: GraphQLRequestOptions
): Promise<GraphQLResponse<T>> {
  const { query, variables, token } = options;
  const url = getGraphQLUrl();

  const headers: HeadersInit = {
    "Content-Type": "application/json",
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  try {
    const response = await fetch(url, {
      method: "POST",
      headers,
      body: JSON.stringify({
        query,
        variables,
      }),
    });

    if (!response.ok) {
      throw new Error(`GraphQL request failed: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error("GraphQL request error:", error);
    throw error;
  }
}

/**
 * Extracts the first error message from a GraphQL response
 */
export function getGraphQLErrorMessage(
  errors?: Array<{ message: string }>
): string {
  return errors?.[0]?.message || "An error occurred";
}

