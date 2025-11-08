import { NextRequest } from "next/server";
import { withApiHandler, executeGraphQLMutation, executeGraphQLQuery } from "@/lib/utils/api-helpers";
import { RATE_MOVIE } from "@/lib/graphql/queries";
import { print } from "graphql";
import { RATING_MIN, RATING_MAX } from "@/lib/config";

const MY_RATINGS_QUERY = `
  query MyRatings {
    myRatings {
      id
      value
      savedMovie {
        tmdbId
      }
    }
  }
`;

export async function POST(request: NextRequest) {
  return withApiHandler(async (session) => {
    const body = await request.json();
    const { tmdbId, rating } = body;

    if (!tmdbId || !rating) {
      throw { status: 400, error: "TMDB ID and rating are required" };
    }

    if (rating < RATING_MIN || rating > RATING_MAX) {
      throw { status: 400, error: `Rating must be between ${RATING_MIN} and ${RATING_MAX}` };
    }

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
    const tmdbId = searchParams.get("tmdbId");

    if (!tmdbId) {
      throw { status: 400, error: "TMDB ID is required" };
    }

    const data = await executeGraphQLQuery<{ myRatings: Array<{
      id: string;
      value: number;
      savedMovie: { tmdbId: number };
    }> }>(
      MY_RATINGS_QUERY,
      {},
      session.authToken
    );

    const rating = data.myRatings?.find(
      (r) => r.savedMovie?.tmdbId === parseInt(tmdbId, 10)
    );

    return { rating: rating || null };
  });
}
