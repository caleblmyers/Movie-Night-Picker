import { useState, useCallback } from "react";
import { useLazyQuery } from "@apollo/client/react";
import { SHUFFLE_MOVIE } from "@/lib/graphql";
import { Movie, Person } from "@/types/suggest";
import { generateYearRange, isDefaultYearRange } from "@/lib/utils/year-range";

const MIN_YEAR = 1950;
const MAX_YEAR = new Date().getFullYear();

/**
 * Hook for managing shuffle movie functionality
 */
export function useShuffleMovie() {
  const [selectedGenres, setSelectedGenres] = useState<string[]>([]);
  const [yearRange, setYearRange] = useState<number[]>([MIN_YEAR, MAX_YEAR]);
  const [selectedCast, setSelectedCast] = useState<Person[]>([]);

  const [shuffleMovie, { data, loading, error }] = useLazyQuery<{
    shuffleMovie: Movie;
  }>(SHUFFLE_MOVIE, {
    fetchPolicy: "network-only",
  });

  const handleShuffle = useCallback(() => {
    const genres = selectedGenres.length > 0 ? selectedGenres : undefined;
    const years = !isDefaultYearRange(yearRange, MIN_YEAR, MAX_YEAR)
      ? generateYearRange(yearRange[0], yearRange[1])
      : undefined;
    const cast =
      selectedCast.length > 0
        ? selectedCast.map((person) => person.id)
        : undefined;

    shuffleMovie({
      variables: {
        genres,
        yearRange: years,
        cast,
      },
    });
  }, [selectedGenres, yearRange, selectedCast, shuffleMovie]);

  return {
    selectedGenres,
    setSelectedGenres,
    yearRange,
    setYearRange,
    selectedCast,
    setSelectedCast,
    handleShuffle,
    movie: data?.shuffleMovie,
    loading,
    error,
    MIN_YEAR,
    MAX_YEAR,
  };
}

