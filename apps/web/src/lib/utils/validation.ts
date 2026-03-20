/**
 * Validation utilities for API requests
 */

export function validateTmdbId(tmdbId: unknown, fieldName = "TMDB ID"): number {
  if (tmdbId === undefined || tmdbId === null) {
    throw { status: 400, error: `${fieldName} is required` };
  }

  const parsed = typeof tmdbId === "string" ? parseInt(tmdbId, 10) : Number(tmdbId);

  if (isNaN(parsed) || parsed <= 0) {
    throw { status: 400, error: `${fieldName} must be a positive number` };
  }

  return parsed;
}

export function validateRequired<T>(
  value: T | undefined | null,
  fieldName: string
): T {
  if (value === undefined || value === null || value === "") {
    throw { status: 400, error: `${fieldName} is required` };
  }
  return value;
}

export function validateRating(rating: unknown, min: number, max: number): number {
  const parsed = typeof rating === "string" ? parseInt(rating, 10) : Number(rating);

  if (isNaN(parsed)) {
    throw { status: 400, error: "Rating must be a number" };
  }

  if (parsed < min || parsed > max) {
    throw { status: 400, error: `Rating must be between ${min} and ${max}` };
  }

  return parsed;
}

