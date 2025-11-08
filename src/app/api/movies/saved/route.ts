import { withApiHandler, executeGraphQLQuery } from "@/lib/utils/api-helpers";
import { SAVED_MOVIES } from "@/lib/graphql";
import { print } from "graphql";

export async function GET() {
  return withApiHandler(async (session) => {
    const data = await executeGraphQLQuery<{ savedMovies: Array<{
      id: string;
      tmdbId: number;
      createdAt: string;
      rating?: { id: string; value: number };
      review?: { id: string; content: string };
    }> }>(
      print(SAVED_MOVIES),
      {},
      session.authToken
    );

    return data.savedMovies || [];
  });
}
