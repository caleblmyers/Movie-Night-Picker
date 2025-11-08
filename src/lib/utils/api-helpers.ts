import { NextResponse } from "next/server";
import { graphqlRequest, getGraphQLErrorMessage } from "./graphql-client";
import { requireAuth } from "./auth-session";

export interface ApiHandlerOptions {
  requireAuthentication?: boolean;
}

interface ApiError {
  status: number;
  error: string;
}

/**
 * Wraps an API handler with common error handling and authentication
 */
export async function withApiHandler<T>(
  handler: (session: Awaited<ReturnType<typeof requireAuth>>) => Promise<T>,
  options: ApiHandlerOptions = {}
): Promise<NextResponse> {
  try {
    // Authentication is required by default - session is guaranteed to exist
    const session = await requireAuth();

    const result = await handler(session);

    return NextResponse.json(result);
  } catch (error: unknown) {
    const apiError = error as ApiError;
    if (apiError.status && apiError.error) {
      return NextResponse.json(
        { error: apiError.error },
        { status: apiError.status }
      );
    }

    console.error("API handler error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

/**
 * Executes a GraphQL mutation with authentication
 */
export async function executeGraphQLMutation<T = unknown>(
  query: string,
  variables: Record<string, unknown>,
  token: string
): Promise<T> {
  const response = await graphqlRequest<T>({
    query,
    variables,
    token,
  });

  if (response.errors) {
    throw { status: 400, error: getGraphQLErrorMessage(response.errors) };
  }

  if (!response.data) {
    throw { status: 500, error: "No data returned from GraphQL mutation" };
  }

  return response.data;
}

/**
 * Executes a GraphQL query with authentication
 */
export async function executeGraphQLQuery<T = unknown>(
  query: string,
  variables: Record<string, unknown> = {},
  token: string
): Promise<T> {
  const response = await graphqlRequest<T>({
    query,
    variables,
    token,
  });

  if (response.errors) {
    throw { status: 400, error: getGraphQLErrorMessage(response.errors) };
  }

  if (!response.data) {
    throw { status: 500, error: "No data returned from GraphQL query" };
  }

  return response.data;
}

