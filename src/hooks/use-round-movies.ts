import { useQuery } from "@apollo/client/react";
import { SUGGEST_MOVIE_ROUND } from "@/lib/graphql";
import { SuggestMovieRoundResult } from "@/types/suggest";

/**
 * Hook to fetch movies for a specific round of the suggest flow
 * Each round returns 4 movies representing different category combinations
 */
export function useRoundMovies(round: number, selectedMovieIds: number[] = []) {
  const { data, loading, error, refetch, variables } = useQuery<
    { suggestMovieRound: SuggestMovieRoundResult },
    { round: number; selectedMovieIds: number[] }
  >(SUGGEST_MOVIE_ROUND, {
    variables: { round, selectedMovieIds },
    skip: round < 1 || round > 10,
    fetchPolicy: "network-only",
    errorPolicy: "all",
  });

  // Only expose data when Apollo has settled on the current round's variables
  const dataIsForCurrentRound = !!(variables && variables.round === round);
  const freshData = dataIsForCurrentRound && !loading ? data?.suggestMovieRound : undefined;

  // Deduplicate within the round only — backend is responsible for excluding selectedMovieIds
  const movies = (freshData?.movies ?? []).filter(
    (m, i, arr) => arr.findIndex((x) => x.id === m.id) === i
  );

  if (freshData && movies.length < 4) {
    console.warn(
      `[suggestMovieRound] Backend returned ${movies.length} distinct movie(s) for round ${round} (expected 4).`
    );
  }

  return {
    movies,
    category: freshData?.category,
    categoryLabel: freshData?.categoryLabel,
    loading: loading || !dataIsForCurrentRound,
    error,
    refetch,
  };
}

