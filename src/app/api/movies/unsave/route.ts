import { NextRequest } from "next/server";
import { withApiHandler, executeGraphQLMutation } from "@/lib/utils/api-helpers";
import { UNSAVE_MOVIE } from "@/lib/graphql/queries";
import { validateTmdbId } from "@/lib/utils/validation";
import { print } from "graphql";

export async function DELETE(request: NextRequest) {
  return withApiHandler(async (session) => {
    const { searchParams } = new URL(request.url);
    const tmdbId = validateTmdbId(searchParams.get("tmdbId"));

    await executeGraphQLMutation(
      print(UNSAVE_MOVIE),
      { tmdbId },
      session.authToken
    );

    return { success: true };
  });
}
