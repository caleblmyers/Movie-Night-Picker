"use client";

import { useEffect } from "react";
import { useQuery } from "@apollo/client/react";
import { SelectionRound } from "@/components/suggest/selection-round";
import { MovieResultDisplay } from "@/components/suggest/movie-result";
import { LoadingState } from "@/components/shared/loading-state";
import { ErrorState } from "@/components/shared/error-state";
import { SUGGEST_MOVIE } from "@/lib/graphql";
import { MovieResult } from "@/types/suggest";
import { useSuggestFlow } from "@/hooks/use-suggest-flow";
import { useRoundOptions } from "@/hooks/use-round-options";

export default function SuggestPage() {
  const {
    currentRound,
    preferences,
    handleSelect,
    handleReset,
    roundConfig,
    TOTAL_ROUNDS,
  } = useSuggestFlow();

  const { roundOptions, loadingOptions, refreshOptions } = useRoundOptions(
    currentRound,
    roundConfig,
    TOTAL_ROUNDS
  );

  const { data, loading, error } = useQuery<{ suggestMovie: MovieResult }>(
    SUGGEST_MOVIE,
    {
      variables: { preferences },
      skip: !preferences,
    }
  );

  // Log preferences when they're ready
  useEffect(() => {
    if (preferences) {
      console.log("=== Suggest Movie Request ===");
      console.log("Preferences sent:", JSON.stringify(preferences, null, 2));
    }
  }, [preferences]);

  // Log response when data is received
  useEffect(() => {
    if (data?.suggestMovie) {
      console.log("=== Suggest Movie Response ===");
      console.log("Full Response:", JSON.stringify(data, null, 2));
      console.log("Movie Data:", data.suggestMovie);
    }
  }, [data]);

  // Log errors
  useEffect(() => {
    if (error) {
      console.error("=== Suggest Movie Error ===");
      console.error("Error:", error);
    }
  }, [error]);

  if (preferences && loading) {
    return (
      <LoadingState
        message="Finding your perfect movie..."
        submessage="Please wait"
      />
    );
  }

  if (error) {
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

  if (data?.suggestMovie) {
    return <MovieResultDisplay movie={data.suggestMovie} />;
  }

  if (
    loadingOptions ||
    (currentRound <= TOTAL_ROUNDS && roundOptions.length === 0)
  ) {
    return (
      <LoadingState message="Loading options..." submessage="Please wait" />
    );
  }

  if (currentRound <= TOTAL_ROUNDS && roundOptions.length > 0) {
    return (
      <SelectionRound
        round={currentRound}
        totalRounds={TOTAL_ROUNDS}
        options={roundOptions}
        onSelect={handleSelect}
        onRefresh={refreshOptions}
      />
    );
  }

  return <LoadingState />;
}
