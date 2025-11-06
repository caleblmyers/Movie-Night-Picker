"use client";

import { useState, useMemo, useEffect } from "react";
import { useQuery } from "@apollo/client/react";
import { useApolloClient } from "@apollo/client/react";
import { SelectionRound } from "@/components/suggest/selection-round";
import { MovieResultDisplay } from "@/components/suggest/movie-result";
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

const TOTAL_ROUNDS = 5;

// Determine the type and count for each round
function getRoundConfig(round: number): {
  type: "genre" | "actor" | "movie" | "yearRange";
  count: number;
} {
  const optionCount = round % 2 === 1 ? 2 : 4; // Round 1,3,5: 2 options; Round 2,4: 4 options
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

  // Fetch options when round changes
  useEffect(() => {
    if (currentRound > TOTAL_ROUNDS) return;

    setLoadingOptions(true);
    const { type, count } = roundConfig;

    if (type === "genre" || type === "yearRange") {
      // Static options
      const options = generateStaticOptions(type, count);
      setRoundOptions(options);
      setLoadingOptions(false);
    } else if (type === "movie") {
      // Fetch multiple random movies sequentially to avoid duplicates
      const fetchMovies = async () => {
        try {
          const movies: Movie[] = [];
          const seenIds = new Set<number>();
          const maxAttempts = count * 3; // Allow some retries for duplicates
          let attempts = 0;

          while (movies.length < count && attempts < maxAttempts) {
            const result = await apolloClient.query<{ randomMovie: Movie }>({
              query: RANDOM_MOVIE,
              fetchPolicy: "network-only",
              // Add a unique fetch key to prevent caching
              context: {
                fetchOptions: {
                  cache: "no-store",
                },
              },
            });

            const movie = result.data?.randomMovie;
            if (movie && !seenIds.has(movie.id)) {
              movies.push(movie);
              seenIds.add(movie.id);
            }

            attempts++;
            // Small delay to help ensure different results
            if (movies.length < count) {
              await new Promise((resolve) => setTimeout(resolve, 100));
            }
          }

          const options = movies.map(movieToOption);
          setRoundOptions(options);
        } catch (error) {
          console.error("Error fetching movies:", error);
          setRoundOptions([]);
        } finally {
          setLoadingOptions(false);
        }
      };

      fetchMovies();
    } else if (type === "actor") {
      // Fetch multiple random people sequentially to avoid duplicates
      const fetchPeople = async () => {
        try {
          const people: Person[] = [];
          const seenIds = new Set<number>();
          const maxAttempts = count * 3; // Allow some retries for duplicates
          let attempts = 0;

          while (people.length < count && attempts < maxAttempts) {
            const result = await apolloClient.query<{ randomPerson: Person }>({
              query: RANDOM_PERSON,
              fetchPolicy: "network-only",
              // Add a unique fetch key to prevent caching
              context: {
                fetchOptions: {
                  cache: "no-store",
                },
              },
            });

            const person = result.data?.randomPerson;
            if (person && !seenIds.has(person.id)) {
              people.push(person);
              seenIds.add(person.id);
            }

            attempts++;
            // Small delay to help ensure different results
            if (people.length < count) {
              await new Promise((resolve) => setTimeout(resolve, 100));
            }
          }

          const options = people.map(personToOption);
          setRoundOptions(options);
        } catch (error) {
          console.error("Error fetching people:", error);
          setRoundOptions([]);
        } finally {
          setLoadingOptions(false);
        }
      };

      fetchPeople();
    }
  }, [currentRound, roundConfig, apolloClient]);

  // Prepare preferences when all rounds are complete
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
          case "actor":
            // Convert string ID to number
            const actorId = parseInt(value, 10);
            if (!isNaN(actorId)) {
              prefs.actors?.push(actorId);
            }
            break;
          case "movie":
            // Movies are not part of MoviePreferencesInput, skip
            break;
          case "yearRange":
            // Convert year range string (e.g., "2020-2029") to array of years
            const [startYear, endYear] = value.split("-").map((y) => parseInt(y, 10));
            if (!isNaN(startYear) && !isNaN(endYear)) {
              const years: number[] = [];
              for (let year = startYear; year <= endYear; year++) {
                years.push(year);
              }
              prefs.yearRange?.push(...years);
            }
            break;
        }
      });

      // Only return preferences if at least one field has values
      if (
        (prefs.genres && prefs.genres.length > 0) ||
        (prefs.actors && prefs.actors.length > 0) ||
        (prefs.yearRange && prefs.yearRange.length > 0)
      ) {
        return prefs;
      }
      return null;
    }
    return null;
  }, [currentRound, selections]);

  // GraphQL query for final suggestion
  const { data, loading, error } = useQuery<{ suggestMovie: MovieResult }>(
    SUGGEST_MOVIE,
    {
      variables: { preferences },
      skip: !preferences,
    }
  );

  const handleSelect = (option: SelectionOption) => {
    const newSelection: RoundSelection = {
      round: currentRound,
      selectedOption: option,
    };

    setSelections((prev) => [...prev, newSelection]);

    if (currentRound < TOTAL_ROUNDS) {
      setCurrentRound((prev) => prev + 1);
    } else {
      setCurrentRound((prev) => prev + 1); // Move to result state
    }
  };

  // Show loading state for final suggestion
  if (preferences && loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="text-center space-y-4">
          <div className="text-2xl font-semibold text-foreground">
            Finding your perfect movie...
          </div>
          <div className="text-muted-foreground">Please wait</div>
        </div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="text-center space-y-4 max-w-md px-4">
          <div className="text-2xl font-semibold text-destructive">Error</div>
          <div className="text-muted-foreground">
            {error.message ||
              "Failed to fetch movie suggestion. Please try again."}
          </div>
          <button
            onClick={() => {
              setCurrentRound(1);
              setSelections([]);
            }}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
          >
            Start Over
          </button>
        </div>
      </div>
    );
  }

  // Show result
  if (data?.suggestMovie) {
    return <MovieResultDisplay movie={data.suggestMovie} />;
  }

  // Show loading state while fetching options
  if (
    loadingOptions ||
    (currentRound <= TOTAL_ROUNDS && roundOptions.length === 0)
  ) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <div className="text-center space-y-4">
          <div className="text-2xl font-semibold text-foreground">
            Loading options...
          </div>
          <div className="text-muted-foreground">Please wait</div>
        </div>
      </div>
    );
  }

  // Show selection round
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

  // Fallback loading state
  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <div className="text-center space-y-4">
        <div className="text-2xl font-semibold text-foreground">Loading...</div>
      </div>
    </div>
  );
}
