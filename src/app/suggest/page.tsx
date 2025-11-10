"use client";

import { useQuery } from "@apollo/client/react";
import { MovieSelectionRound } from "@/components/suggest/movie-selection-round";
import { MovieResultDisplay } from "@/components/suggest/movie-result";
import { LoadingState } from "@/components/shared/loading-state";
import { ErrorState } from "@/components/shared/error-state";
import { SUGGEST_MOVIE } from "@/lib/graphql";
import { MovieResult } from "@/types/suggest";
import { useSuggestFlow } from "@/hooks/use-suggest-flow";
import { useRoundMovies } from "@/hooks/use-round-movies";

export default function SuggestPage() {
  const {
    currentRound,
    selectedMovieIds,
    handleSelect,
    handleReset,
    TOTAL_ROUNDS,
    isComplete,
  } = useSuggestFlow();

  const { movies, loading: loadingMovies, error: moviesError, refetch } = useRoundMovies(
    currentRound
  );

  // Only call suggestMovie after all rounds are completed
  const { data, loading, error } = useQuery<{ suggestMovie: MovieResult }>(
    SUGGEST_MOVIE,
    {
      variables: { 
        selectedMovieIds 
      },
      skip: !isComplete || selectedMovieIds.length === 0, // Only query when all rounds are complete
      fetchPolicy: "network-only", // Always fetch fresh results
      errorPolicy: "all", // Continue rendering even on error
    }
  );

  // Log the selected movie IDs being sent
  if (isComplete && selectedMovieIds.length > 0) {
    console.log("SuggestMovie selectedMovieIds:", selectedMovieIds);
  }

  // Show final result when all rounds are complete and query completes
  if (isComplete && loading) {
    return (
      <LoadingState
        message="Finding your perfect movie..."
        submessage="Please wait"
      />
    );
  }

  if (isComplete && error) {
    return (
      <ErrorState
        message={
          error.message || "Failed to fetch movie suggestion. Please try again."
        }
        onRetry={handleReset}
        retryLabel="Start Over"
      />
    );
  }

  if (isComplete && data?.suggestMovie) {
    return <MovieResultDisplay movie={data.suggestMovie} />;
  }

  // Show error if round movies fail to load
  if (moviesError && currentRound <= TOTAL_ROUNDS) {
    return (
      <ErrorState
        message={
          moviesError.message || "Failed to load movies for this round. Please try again."
        }
        onRetry={() => refetch()}
        retryLabel="Retry"
      />
    );
  }

  // Show movie selection round
  if (currentRound <= TOTAL_ROUNDS) {
    return (
      <MovieSelectionRound
        round={currentRound}
        totalRounds={TOTAL_ROUNDS}
        movies={movies}
        onSelect={handleSelect}
        onRefresh={() => refetch()}
        loading={loadingMovies}
      />
    );
  }

  return <LoadingState />;
}
