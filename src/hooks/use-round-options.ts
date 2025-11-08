import { useMemo, useState, useCallback } from "react";
import type { SuggestRoundConfig } from "./use-suggest-flow";
import { useSelectionOptions } from "./use-selection-options";

/**
 * Shuffle array and return first N items
 */
function shuffleAndTake<T>(array: T[], count: number): T[] {
  const shuffled = [...array].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}

/**
 * Hook for fetching and managing round options based on round configuration
 * Uses pre-loaded options from useSelectionOptions
 */
export function useRoundOptions(
  currentRound: number,
  roundConfig: SuggestRoundConfig,
  totalRounds: number
) {
  const { allGenres, allMoods, allEras, allActors, allCrew, loading: loadingAllOptions } =
    useSelectionOptions();
  const [refreshKey, setRefreshKey] = useState(0);

  const roundOptions = useMemo(() => {
    if (currentRound > totalRounds || loadingAllOptions) {
      return [];
    }

    const { type, count } = roundConfig;

    switch (type) {
      case "genre":
        if (allGenres.length > 0) {
          return shuffleAndTake(allGenres, count);
        }
        break;
      case "mood":
        if (allMoods.length > 0) {
          return shuffleAndTake(allMoods, count);
        }
        break;
      case "era":
        if (allEras.length > 0) {
          return shuffleAndTake(allEras, count);
        }
        break;
      case "actor":
        if (allActors.length > 0) {
          return shuffleAndTake(allActors, count);
        }
        break;
      case "director":
        if (allCrew.length > 0) {
          return shuffleAndTake(allCrew, count);
        }
        break;
    }

    return [];
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    currentRound,
    roundConfig,
    totalRounds,
    loadingAllOptions,
    allGenres,
    allMoods,
    allEras,
    allActors,
    allCrew,
    refreshKey, // Include refreshKey to trigger re-shuffle
  ]);

  const refreshOptions = useCallback(() => {
    setRefreshKey((prev) => prev + 1);
  }, []);

  return { roundOptions, loadingOptions: loadingAllOptions, refreshOptions };
}

