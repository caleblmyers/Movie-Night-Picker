"use client";

import { useState, useMemo, useEffect } from "react";
import { useQuery } from "@apollo/client/react";
import { useApolloClient } from "@apollo/client/react";
import { SelectionRound } from "@/components/suggest/selection-round";
import { MovieResultDisplay } from "@/components/suggest/movie-result";
import { LoadingState } from "@/components/shared/loading-state";
import { ErrorState } from "@/components/shared/error-state";
import {
  generateStaticOptions,
  movieToOption,
  personToOption,
} from "@/lib/tmdb-options";
import {
  SUGGEST_MOVIE,
  RANDOM_MOVIE,
  RANDOM_PERSON,
} from "@/lib/graphql/queries";
import {
  SelectionOption,
  RoundSelection,
  MovieResult,
  MoviePreferences,
  Movie,
  Person,
} from "@/types/suggest";
import { fetchUniqueItems } from "@/lib/utils/fetch-unique-items";
import { generateYearRange } from "@/lib/utils/year-range";

const TOTAL_ROUNDS = 5;

function getRoundConfig(round: number): {
  type: "genre" | "actor" | "movie" | "yearRange";
  count: number;
} {
  const optionCount = round % 2 === 1 ? 2 : 4;
  const optionTypes: Array<"genre" | "actor" | "movie" | "yearRange"> = [
    "genre",
    "actor",
    "movie",
    "yearRange",
  ];
  const type = optionTypes[(round - 1) % optionTypes.length];

  return { type, count: optionCount };
}

export default function SuggestPage() {
  const [currentRound, setCurrentRound] = useState(1);
  const [selections, setSelections] = useState<RoundSelection[]>([]);
  const [roundOptions, setRoundOptions] = useState<SelectionOption[]>([]);
  const [loadingOptions, setLoadingOptions] = useState(false);
  const apolloClient = useApolloClient();

  const roundConfig = useMemo(
    () => getRoundConfig(currentRound),
    [currentRound]
  );

  useEffect(() => {
    if (currentRound > TOTAL_ROUNDS) return;

    setLoadingOptions(true);
    const { type, count } = roundConfig;

    if (type === "genre" || type === "yearRange") {
      const options = generateStaticOptions(type, count);
      setRoundOptions(options);
      setLoadingOptions(false);
    } else if (type === "movie") {
      const fetchMovies = async () => {
        try {
          const movies = await fetchUniqueItems<Movie>({
            count,
            fetchFn: async () => {
              const result = await apolloClient.query<{ randomMovie: Movie }>({
                query: RANDOM_MOVIE,
                fetchPolicy: "network-only",
                context: {
                  fetchOptions: { cache: "no-store" },
                },
              });
              return result.data?.randomMovie;
            },
          });

          setRoundOptions(movies.map(movieToOption));
        } catch {
          // Silently fail - user will see empty options
          setRoundOptions([]);
        } finally {
          setLoadingOptions(false);
        }
      };

      fetchMovies();
    } else if (type === "actor") {
      const fetchPeople = async () => {
        try {
          const people = await fetchUniqueItems<Person>({
            count,
            fetchFn: async () => {
              const result = await apolloClient.query<{ randomPerson: Person }>(
                {
                  query: RANDOM_PERSON,
                  fetchPolicy: "network-only",
                  context: {
                    fetchOptions: { cache: "no-store" },
                  },
                }
              );
              return result.data?.randomPerson;
            },
          });

          setRoundOptions(people.map(personToOption));
        } catch {
          // Silently fail - user will see empty options
          setRoundOptions([]);
        } finally {
          setLoadingOptions(false);
        }
      };

      fetchPeople();
    }
  }, [currentRound, roundConfig, apolloClient]);

  const preferences = useMemo<MoviePreferences | null>(() => {
    if (currentRound > TOTAL_ROUNDS && selections.length === TOTAL_ROUNDS) {
      const prefs: MoviePreferences = {
        genres: [],
        actors: [],
        yearRange: [],
      };

      selections.forEach((selection) => {
        const { type, value } = selection.selectedOption;
        switch (type) {
          case "genre":
            prefs.genres?.push(value);
            break;
          case "actor": {
            const actorId = parseInt(value, 10);
            if (!isNaN(actorId)) {
              prefs.actors?.push(actorId);
            }
            break;
          }
          case "yearRange": {
            const [startYear, endYear] = value
              .split("-")
              .map((y) => parseInt(y, 10));
            if (!isNaN(startYear) && !isNaN(endYear)) {
              prefs.yearRange?.push(...generateYearRange(startYear, endYear));
            }
            break;
          }
        }
      });

      const hasPreferences =
        (prefs.genres && prefs.genres.length > 0) ||
        (prefs.actors && prefs.actors.length > 0) ||
        (prefs.yearRange && prefs.yearRange.length > 0);

      return hasPreferences ? prefs : null;
    }
    return null;
  }, [currentRound, selections]);

  const { data, loading, error } = useQuery<{ suggestMovie: MovieResult }>(
    SUGGEST_MOVIE,
    {
      variables: { preferences },
      skip: !preferences,
    }
  );

  const handleSelect = (option: SelectionOption) => {
    setSelections((prev) => [
      ...prev,
      { round: currentRound, selectedOption: option },
    ]);

    setCurrentRound((prev) => (prev < TOTAL_ROUNDS ? prev + 1 : prev + 1));
  };

  const handleReset = () => {
    setCurrentRound(1);
    setSelections([]);
  };

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
      />
    );
  }

  return <LoadingState />;
}
