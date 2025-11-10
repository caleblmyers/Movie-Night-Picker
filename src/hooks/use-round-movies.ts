import { useQuery } from "@apollo/client/react";
import { SUGGEST_MOVIE_ROUND } from "@/lib/graphql";
import { Movie } from "@/types/suggest";

/**
 * Hook to fetch movies for a specific round of the suggest flow
 * Each round returns 4 movies representing different category combinations
 */
export function useRoundMovies(round: number) {
  const { data, loading, error, refetch } = useQuery<{
    suggestMovieRound: Movie[];
  }>(SUGGEST_MOVIE_ROUND, {
    variables: { round },
    skip: round < 1 || round > 10,
    fetchPolicy: "network-only", // Always fetch fresh results
    errorPolicy: "all", // Continue rendering even on error
  });

  return {
    movies: data?.suggestMovieRound || [],
    loading,
    error,
    refetch,
  };
}

