import { NextRequest } from "next/server";
import { withApiHandler, executeGraphQLMutation, executeGraphQLQuery } from "@/lib/utils/api-helpers";
import { RATE_MOVIE, RATINGS } from "@/lib/graphql";
import { validateTmdbId, validateRating, validateRequired } from "@/lib/utils/validation";
import { RATING_MIN, RATING_MAX } from "@/lib/config";
import { print } from "graphql";

export async function POST(request: NextRequest) {
  return withApiHandler(async (session) => {
    const body = await request.json();
    const tmdbId = validateTmdbId(body.tmdbId);
    const rating = validateRating(validateRequired(body.rating, "Rating"), RATING_MIN, RATING_MAX);

    const data = await executeGraphQLMutation<{ rateMovie: { id: string; value: number } }>(
      print(RATE_MOVIE),
      { tmdbId, rating },
      session.authToken
    );

    return { rating: data.rateMovie };
  });
}

export async function GET(request: NextRequest) {
  return withApiHandler(async (session) => {
    const { searchParams } = new URL(request.url);
    const tmdbId = validateTmdbId(searchParams.get("tmdbId"));

    const data = await executeGraphQLQuery<{ ratings: Array<{
      id: number | string;
      tmdbId: number;
      value: number;
    }> }>(
      print(RATINGS),
      {},
      session.authToken
    );

    const rating = data.ratings?.find((r) => r.tmdbId === tmdbId) || null;

    return { rating };
  });
}
