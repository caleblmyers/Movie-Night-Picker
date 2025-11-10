import { useState, useCallback } from "react";
import { Movie } from "@/types/suggest";

const TOTAL_ROUNDS = 5;

/**
 * Hook for managing the suggest movie flow with 5 rounds of movie selections
 * Tracks selected movie IDs and passes them to the backend for aggregation
 */
export function useSuggestFlow() {
  const [currentRound, setCurrentRound] = useState(1);
  const [selectedMovieIds, setSelectedMovieIds] = useState<number[]>([]);

  const handleSelect = useCallback(
    (movie: Movie) => {
      setSelectedMovieIds((prev) => [...prev, movie.id]);
      setCurrentRound((prev) => Math.min(prev + 1, TOTAL_ROUNDS + 1));
    },
    []
  );

  const handleReset = useCallback(() => {
    setCurrentRound(1);
    setSelectedMovieIds([]);
  }, []);

  const isComplete = currentRound > TOTAL_ROUNDS && selectedMovieIds.length === TOTAL_ROUNDS;

  return {
    currentRound,
    selectedMovieIds,
    isComplete,
    handleSelect,
    handleReset,
    TOTAL_ROUNDS,
  };
}
