import { withApiHandler, executeGraphQLQuery } from "@/lib/utils/api-helpers";
import { MY_SAVED_MOVIES } from "@/lib/graphql/queries";
import { print } from "graphql";

export async function GET() {
  return withApiHandler(async (session) => {
    const data = await executeGraphQLQuery<{ mySavedMovies: Array<{
      id: string;
      tmdbId: number;
      createdAt: string;
      rating?: { id: string; value: number };
      review?: { id: string; content: string };
    }> }>(
      print(MY_SAVED_MOVIES),
      {},
      session.authToken
    );

    return data.mySavedMovies || [];
  });
}
