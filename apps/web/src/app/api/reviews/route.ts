import { NextRequest } from "next/server";
import { withApiHandler, executeGraphQLMutation, executeGraphQLQuery } from "@/lib/utils/api-helpers";
import { REVIEW_MOVIE, DELETE_REVIEW, REVIEWS } from "@/lib/graphql";
import { validateTmdbId, validateRequired } from "@/lib/utils/validation";
import { print } from "graphql";

async function handleReviewMutation(
  tmdbId: number,
  content: string,
  authToken: string
) {
  const data = await executeGraphQLMutation<{ reviewMovie: { id: string; content: string } }>(
    print(REVIEW_MOVIE),
    { tmdbId, content },
    authToken
  );

  return { review: data.reviewMovie };
}

export async function POST(request: NextRequest) {
  return withApiHandler(async (session) => {
    const body = await request.json();
    const tmdbId = validateTmdbId(body.tmdbId);
    const content = validateRequired(body.content, "Content");

    return handleReviewMutation(tmdbId, content, session.authToken);
  });
}

export async function GET(request: NextRequest) {
  return withApiHandler(async (session) => {
    const { searchParams } = new URL(request.url);
    const tmdbId = validateTmdbId(searchParams.get("tmdbId"));

    const data = await executeGraphQLQuery<{ reviews: Array<{
      id: number | string;
      tmdbId: number;
      content: string;
    }> }>(
      print(REVIEWS),
      {},
      session.authToken
    );

    const review = data.reviews?.find((r) => r.tmdbId === tmdbId) || null;

    return { review };
  });
}

export async function PUT(request: NextRequest) {
  return withApiHandler(async (session) => {
    const body = await request.json();
    const tmdbId = validateTmdbId(body.tmdbId);
    const content = validateRequired(body.content, "Content");

    // PUT uses the same mutation as POST (reviewMovie creates or updates)
    return handleReviewMutation(tmdbId, content, session.authToken);
  });
}

export async function DELETE(request: NextRequest) {
  return withApiHandler(async (session) => {
    const { searchParams } = new URL(request.url);
    const tmdbId = validateTmdbId(searchParams.get("tmdbId"));

    await executeGraphQLMutation(
      print(DELETE_REVIEW),
      { tmdbId },
      session.authToken
    );

    return { success: true };
  });
}
