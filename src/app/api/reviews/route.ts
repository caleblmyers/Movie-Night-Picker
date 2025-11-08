import { NextRequest } from "next/server";
import { withApiHandler, executeGraphQLMutation, executeGraphQLQuery } from "@/lib/utils/api-helpers";
import { REVIEW_MOVIE, DELETE_REVIEW } from "@/lib/graphql/queries";
import { print } from "graphql";

const MY_REVIEWS_QUERY = `
  query MyReviews {
    myReviews {
      id
      content
      savedMovie {
        tmdbId
      }
    }
  }
`;

export async function POST(request: NextRequest) {
  return withApiHandler(async (session) => {
    const body = await request.json();
    const { tmdbId, content } = body;

    if (!tmdbId || !content) {
      throw { status: 400, error: "TMDB ID and content are required" };
    }

    const data = await executeGraphQLMutation<{ reviewMovie: { id: string; content: string } }>(
      print(REVIEW_MOVIE),
      { tmdbId, content },
      session.authToken
    );

    return { review: data.reviewMovie };
  });
}

export async function GET(request: NextRequest) {
  return withApiHandler(async (session) => {
    const { searchParams } = new URL(request.url);
    const tmdbId = searchParams.get("tmdbId");

    if (!tmdbId) {
      throw { status: 400, error: "TMDB ID is required" };
    }

    const data = await executeGraphQLQuery<{ myReviews: Array<{
      id: string;
      content: string;
      savedMovie: { tmdbId: number };
    }> }>(
      MY_REVIEWS_QUERY,
      {},
      session.authToken
    );

    const review = data.myReviews?.find(
      (r) => r.savedMovie?.tmdbId === parseInt(tmdbId, 10)
    );

    return { review: review || null };
  });
}

export async function PUT(request: NextRequest) {
  return withApiHandler(async (session) => {
    const body = await request.json();
    const { tmdbId, content } = body;

    if (!tmdbId || !content) {
      throw { status: 400, error: "TMDB ID and content are required" };
    }

    const data = await executeGraphQLMutation<{ reviewMovie: { id: string; content: string } }>(
      print(REVIEW_MOVIE),
      { tmdbId, content },
      session.authToken
    );

    return { review: data.reviewMovie };
  });
}

export async function DELETE(request: NextRequest) {
  return withApiHandler(async (session) => {
    const { searchParams } = new URL(request.url);
    const tmdbId = searchParams.get("tmdbId");

    if (!tmdbId) {
      throw { status: 400, error: "TMDB ID is required" };
    }

    await executeGraphQLMutation(
      print(DELETE_REVIEW),
      { tmdbId: parseInt(tmdbId, 10) },
      session.authToken
    );

    return { success: true };
  });
}
