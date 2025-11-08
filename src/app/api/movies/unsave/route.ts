import { NextRequest } from "next/server";
import { withApiHandler, executeGraphQLMutation } from "@/lib/utils/api-helpers";
import { UNSAVE_MOVIE } from "@/lib/graphql/queries";
import { print } from "graphql";

export async function DELETE(request: NextRequest) {
  return withApiHandler(async (session) => {
    const { searchParams } = new URL(request.url);
    const tmdbId = searchParams.get("tmdbId");

    if (!tmdbId) {
      throw { status: 400, error: "TMDB ID is required" };
    }

    await executeGraphQLMutation(
      print(UNSAVE_MOVIE),
      { tmdbId: parseInt(tmdbId, 10) },
      session.authToken
    );

    return { success: true };
  });
}
