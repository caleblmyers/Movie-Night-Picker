import { useState, useMemo, useCallback } from "react";
import { SelectionOption, RoundSelection, MoviePreferences } from "@/types/suggest";

const TOTAL_ROUNDS = 5;

export interface SuggestRoundConfig {
  type: "genre" | "mood" | "era" | "actor" | "director";
  count: number;
}

/**
 * Get the configuration for a specific round
 */
export function getRoundConfig(round: number): SuggestRoundConfig {
  const roundConfigs: SuggestRoundConfig[] = [
    { type: "genre", count: 4 }, // Round 1: 4 genres
    { type: "mood", count: 4 }, // Round 2: 4 moods
    { type: "era", count: 4 }, // Round 3: 4 era options
    { type: "actor", count: 4 }, // Round 4: 4 actors
    { type: "actor", count: 4 }, // Round 5: 4 actors
  ];

  return roundConfigs[round - 1] || { type: "genre", count: 4 };
}

/**
 * Build movie preferences from selections
 * Backend handles progressive fallback automatically
 */
export function buildMoviePreferences(
  selections: RoundSelection[]
): MoviePreferences | null {
  if (selections.length !== TOTAL_ROUNDS) {
    return null;
  }

  const prefs: MoviePreferences = {
    genres: [],
    actors: [],
    crew: [],
  };

  selections.forEach((selection) => {
    const { type, value } = selection.selectedOption;
    
    // Skip "Any" selections - they don't store preferences
    if (value === "__ANY__") {
      return;
    }
    
    switch (type) {
      case "genre":
        prefs.genres?.push(value);
        break;
      case "mood":
        prefs.mood = value;
        break;
      case "era":
        // Pass era value directly to backend - it handles interpretation
        // Backend will convert to year ranges or use abstract values
        prefs.era = value;
        break;
      case "actor": {
        const actorId = parseInt(value, 10);
        if (!isNaN(actorId)) {
          prefs.actors?.push(actorId);
        }
        break;
      }
    }
  });

  const hasPreferences =
    (prefs.genres && prefs.genres.length > 0) ||
    prefs.mood ||
    prefs.era ||
    (prefs.actors && prefs.actors.length > 0) ||
    (prefs.crew && prefs.crew.length > 0);

  return hasPreferences ? prefs : null;
}

/**
 * Hook for managing the suggest movie flow
 */
export function useSuggestFlow() {
  const [currentRound, setCurrentRound] = useState(1);
  const [selections, setSelections] = useState<RoundSelection[]>([]);

  const roundConfig = useMemo(
    () => getRoundConfig(currentRound),
    [currentRound]
  );

  const preferences = useMemo<MoviePreferences | null>(() => {
    return buildMoviePreferences(selections);
  }, [selections]);

  const handleSelect = useCallback(
    (option: SelectionOption) => {
      setSelections((prev) => [
        ...prev,
        { round: currentRound, selectedOption: option },
      ]);
      setCurrentRound((prev) => Math.min(prev + 1, TOTAL_ROUNDS + 1));
    },
    [currentRound]
  );

  const handleReset = useCallback(() => {
    setCurrentRound(1);
    setSelections([]);
  }, []);

  const isComplete = currentRound > TOTAL_ROUNDS && selections.length === TOTAL_ROUNDS;

  return {
    currentRound,
    selections,
    roundConfig,
    preferences,
    isComplete,
    handleSelect,
    handleReset,
    TOTAL_ROUNDS,
  };
}

