import { useMemo, useState, useCallback } from "react";
import type { SuggestRoundConfig } from "./use-suggest-flow";
import { useSelectionOptions } from "./use-selection-options";
import type { SelectionOption } from "@/types/suggest";

/**
 * Create an "Any" option that doesn't store preferences
 */
function createAnyOption(type: "genre" | "mood" | "era" | "actor" | "director"): SelectionOption {
  return {
    id: `any-${type}`,
    type,
    label: "Any",
    value: "__ANY__", // Special value to identify "Any" selections
    icon: "lucide:more-horizontal",
  };
}

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
    const anyOption = createAnyOption(type);
    let options: SelectionOption[] = [];

    switch (type) {
      case "genre":
        if (allGenres.length > 0) {
          options = shuffleAndTake(allGenres, count);
        }
        break;
      case "mood":
        if (allMoods.length > 0) {
          options = shuffleAndTake(allMoods, count);
        }
        break;
      case "era":
        if (allEras.length > 0) {
          options = shuffleAndTake(allEras, count);
        }
        break;
      case "actor":
        if (allActors.length > 0) {
          options = shuffleAndTake(allActors, count);
        }
        break;
      case "director":
        if (allCrew.length > 0) {
          options = shuffleAndTake(allCrew, count);
        }
        break;
    }

    // Append "Any" option to the end of the list
    return [...options, anyOption];
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

