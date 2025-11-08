import { NextRequest } from "next/server";
import { withApiHandler, executeGraphQLMutation } from "@/lib/utils/api-helpers";
import { SAVE_MOVIE } from "@/lib/graphql/queries";
import { print } from "graphql";

export async function POST(request: NextRequest) {
  return withApiHandler(async (session) => {
    const body = await request.json();
    const { tmdbId } = body;

    if (!tmdbId) {
      throw { status: 400, error: "TMDB ID is required" };
    }

    const data = await executeGraphQLMutation<{ saveMovie: { id: string; tmdbId: number; createdAt: string } }>(
      print(SAVE_MOVIE),
      { tmdbId },
      session.authToken
    );

    return data.saveMovie;
  });
}
