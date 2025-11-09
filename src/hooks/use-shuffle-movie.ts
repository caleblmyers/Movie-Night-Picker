import { useState, useCallback } from "react";
import { useLazyQuery } from "@apollo/client/react";
import { SHUFFLE_MOVIE } from "@/lib/graphql";
import { Movie, Person } from "@/types/suggest";
import { isDefaultYearRange } from "@/lib/utils/year-range";

const MIN_YEAR = 1950;
const MAX_YEAR = new Date().getFullYear();

/**
 * Hook for managing shuffle movie functionality
 */
export function useShuffleMovie() {
  const [selectedGenres, setSelectedGenres] = useState<string[]>([]);
  const [yearRange, setYearRange] = useState<number[]>([MIN_YEAR, MAX_YEAR]);
  const [selectedCast, setSelectedCast] = useState<Person[]>([]);
  const [selectedCrew, setSelectedCrew] = useState<Person[]>([]);
  const [minVoteAverage, setMinVoteAverage] = useState<number>(0);
  const [minVoteCount, setMinVoteCount] = useState<number>(0);
  const [runtimeRange, setRuntimeRange] = useState<number[]>([0, 300]);
  const [originalLanguage, setOriginalLanguage] = useState<string>("any");

  const [shuffleMovie, { data, loading, error }] = useLazyQuery<{
    shuffleMovie: Movie | null;
  }>(SHUFFLE_MOVIE, {
    fetchPolicy: "network-only",
    errorPolicy: "all", // Continue even if there's an error (e.g., no matches)
  });

  const handleShuffle = useCallback(() => {
    const genres = selectedGenres.length > 0 
      ? selectedGenres.map(id => parseInt(id, 10)).filter(id => !isNaN(id))
      : undefined;
    const years = !isDefaultYearRange(yearRange, MIN_YEAR, MAX_YEAR)
      ? [yearRange[0], yearRange[1]]
      : undefined;
    const cast =
      selectedCast.length > 0
        ? selectedCast.map((person) => person.id)
        : undefined;
    const crew =
      selectedCrew.length > 0
        ? selectedCrew.map((person) => person.id)
        : undefined;
    const voteAvg = minVoteAverage > 0 ? minVoteAverage : undefined;
    const voteCount = minVoteCount > 0 ? minVoteCount : undefined;
    const runtime = runtimeRange[0] > 0 || runtimeRange[1] < 300
      ? runtimeRange
      : undefined;
    const language = originalLanguage && originalLanguage !== "any" ? originalLanguage : undefined;

    shuffleMovie({
      variables: {
        genres,
        yearRange: years,
        cast,
        crew,
        minVoteAverage: voteAvg,
        minVoteCount: voteCount,
        runtimeRange: runtime,
        originalLanguage: language,
      },
    });
  }, [
    selectedGenres,
    yearRange,
    selectedCast,
    selectedCrew,
    minVoteAverage,
    minVoteCount,
    runtimeRange,
    originalLanguage,
    shuffleMovie,
  ]);

  const handleReset = useCallback(() => {
    setSelectedGenres([]);
    setYearRange([MIN_YEAR, MAX_YEAR]);
    setSelectedCast([]);
    setSelectedCrew([]);
    setMinVoteAverage(0);
    setMinVoteCount(0);
    setRuntimeRange([0, 300]);
    setOriginalLanguage("any");
  }, []);

  return {
    selectedGenres,
    setSelectedGenres,
    yearRange,
    setYearRange,
    selectedCast,
    setSelectedCast,
    selectedCrew,
    setSelectedCrew,
    minVoteAverage,
    setMinVoteAverage,
    minVoteCount,
    setMinVoteCount,
    runtimeRange,
    setRuntimeRange,
    originalLanguage,
    setOriginalLanguage,
    handleShuffle,
    handleReset,
    movie: data?.shuffleMovie || undefined,
    hasSearched: !!data, // Track if a search has been performed
    loading,
    error,
    MIN_YEAR,
    MAX_YEAR,
  };
}

