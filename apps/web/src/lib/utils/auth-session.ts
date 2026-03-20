import { auth } from "@/lib/auth";

export interface AuthenticatedSession {
  user: {
    id: string;
    email: string;
    name?: string | null;
  };
  authToken: string;
}

/**
 * Gets the authenticated session with token
 * Returns null if not authenticated
 */
export async function getAuthenticatedSession(): Promise<AuthenticatedSession | null> {
  const session = await auth();

  if (!session?.user?.id || !session.authToken) {
    return null;
  }

  return {
    user: {
      id: session.user.id,
      email: session.user.email,
      name: session.user.name,
    },
    authToken: session.authToken,
  };
}

interface AuthError {
  status: number;
  error: string;
}

/**
 * Validates that a session is authenticated
 * Throws an error response if not authenticated
 */
export async function requireAuth(): Promise<AuthenticatedSession> {
  const session = await getAuthenticatedSession();

  if (!session) {
    const error: AuthError = { status: 401, error: "Unauthorized" };
    throw error;
  }

  return session;
}

