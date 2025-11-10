import { useState, useCallback, useMemo } from "react";
import { useLazyQuery } from "@apollo/client/react";
import { SHUFFLE_MOVIE } from "@/lib/graphql";
import { Movie, Person } from "@/types/suggest";
import { isDefaultYearRange } from "@/lib/utils/year-range";

const MIN_YEAR = 1950;
const MAX_YEAR = new Date().getFullYear();
const MIN_POPULARITY = 0;
const MAX_POPULARITY = 1000;

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
  const [selectedProviders, setSelectedProviders] = useState<string[]>([]);
  const [excludeGenres, setExcludeGenres] = useState<string[]>([]);
  const [excludeCast, setExcludeCast] = useState<Person[]>([]);
  const [excludeCrew, setExcludeCrew] = useState<Person[]>([]);
  const [popularityRange, setPopularityRange] = useState<number[]>([MIN_POPULARITY, MAX_POPULARITY]);
  const [originCountries, setOriginCountries] = useState<string[]>([]);
  const [inCollections, setInCollections] = useState<number[]>([]);
  const [excludeCollections, setExcludeCollections] = useState<number[]>([]);
  const [notInAnyCollection, setNotInAnyCollection] = useState<boolean>(false);

  const [shuffleMovie, { data, loading, error }] = useLazyQuery<{
    shuffleMovie: Movie | null;
  }>(SHUFFLE_MOVIE, {
    fetchPolicy: "network-only",
    errorPolicy: "all", // Continue even if there's an error (e.g., no matches)
  });

  // Memoize variables object to avoid recreating on every render
  const shuffleVariables = useMemo(() => {
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
    const watchProviders = selectedProviders.length > 0
      ? selectedProviders.join(",")
      : undefined;
    const excludeGenresInt = excludeGenres.length > 0
      ? excludeGenres.map(id => parseInt(id, 10)).filter(id => !isNaN(id))
      : undefined;
    const excludeCastIds = excludeCast.length > 0
      ? excludeCast.map((person) => person.id)
      : undefined;
    const excludeCrewIds = excludeCrew.length > 0
      ? excludeCrew.map((person) => person.id)
      : undefined;
    const popularity = (popularityRange[0] !== MIN_POPULARITY || popularityRange[1] !== MAX_POPULARITY)
      ? [popularityRange[0], popularityRange[1]]
      : undefined;
    const countries = originCountries.length > 0
      ? originCountries
      : undefined;
    const includeCollections = inCollections.length > 0
      ? inCollections
      : undefined;
    const excludeCollectionsIds = excludeCollections.length > 0
      ? excludeCollections
      : undefined;
    const notInAny = notInAnyCollection ? true : undefined;

    return {
      genres,
      yearRange: years,
      cast,
      crew,
      minVoteAverage: voteAvg,
      minVoteCount: voteCount,
      runtimeRange: runtime,
      originalLanguage: language,
      watchProviders,
      excludeGenres: excludeGenresInt,
      excludeCast: excludeCastIds,
      excludeCrew: excludeCrewIds,
      popularityRange: popularity,
      originCountries: countries,
      inCollections: includeCollections,
      excludeCollections: excludeCollectionsIds,
      notInAnyCollection: notInAny,
    };
  }, [
    selectedGenres,
    yearRange,
    selectedCast,
    selectedCrew,
    minVoteAverage,
    minVoteCount,
    runtimeRange,
    originalLanguage,
    selectedProviders,
    excludeGenres,
    excludeCast,
    excludeCrew,
    popularityRange,
    originCountries,
    inCollections,
    excludeCollections,
    notInAnyCollection,
  ]);

  const handleShuffle = useCallback(() => {
    shuffleMovie({ variables: shuffleVariables });
  }, [shuffleMovie, shuffleVariables]);

  const handleReset = useCallback(() => {
    setSelectedGenres([]);
    setYearRange([MIN_YEAR, MAX_YEAR]);
    setSelectedCast([]);
    setSelectedCrew([]);
    setMinVoteAverage(0);
    setMinVoteCount(0);
    setRuntimeRange([0, 300]);
    setOriginalLanguage("any");
    setSelectedProviders([]);
    setExcludeGenres([]);
    setExcludeCast([]);
    setExcludeCrew([]);
    setPopularityRange([MIN_POPULARITY, MAX_POPULARITY]);
    setOriginCountries([]);
    setInCollections([]);
    setExcludeCollections([]);
    setNotInAnyCollection(false);
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
    selectedProviders,
    setSelectedProviders,
    excludeGenres,
    setExcludeGenres,
    excludeCast,
    setExcludeCast,
    excludeCrew,
    setExcludeCrew,
    popularityRange,
    setPopularityRange,
    originCountries,
    setOriginCountries,
    inCollections,
    setInCollections,
    excludeCollections,
    setExcludeCollections,
    notInAnyCollection,
    setNotInAnyCollection,
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

