/**
 * Centralized error handling utilities
 */

export interface AppError {
  message: string;
  status?: number;
  code?: string;
}

/**
 * Safely logs errors with context
 */
export function logError(error: unknown, context?: string): void {
  const errorMessage = error instanceof Error ? error.message : String(error);
  const logMessage = context ? `[${context}] ${errorMessage}` : errorMessage;
  
  // In production, you might want to send this to an error tracking service
  if (process.env.NODE_ENV === "development") {
    console.error(logMessage, error);
  }
}

/**
 * Creates a standardized error response
 */
export function createErrorResponse(
  message: string,
  status = 500,
  code?: string
): AppError {
  return {
    message,
    status,
    code,
  };
}

