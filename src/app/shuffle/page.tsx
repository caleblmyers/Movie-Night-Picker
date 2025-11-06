"use client";

import { useState, useCallback } from "react";
import { useLazyQuery } from "@apollo/client/react";
import { Button } from "@/components/ui/button";
import { GenreFilter } from "@/components/shuffle/genre-filter";
import { YearRangeFilter } from "@/components/shuffle/year-range-filter";
import { CastFilter } from "@/components/shuffle/cast-filter";
import { LoadingState } from "@/components/shared/loading-state";
import { ErrorState } from "@/components/shared/error-state";
import { SHUFFLE_MOVIE } from "@/lib/graphql/queries";
import { Movie, Person } from "@/types/suggest";
import { MovieResultDisplay } from "@/components/suggest/movie-result";
import { generateYearRange, isDefaultYearRange } from "@/lib/utils/year-range";

const MIN_YEAR = 1950;
const MAX_YEAR = new Date().getFullYear();

export default function ShufflePage() {
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

  if (loading) {
    return <LoadingState message="Shuffling..." submessage="Finding your movie..." />;
  }

  if (error) {
    return (
      <ErrorState
        message={error.message || "Failed to shuffle movie. Please try again."}
        onRetry={handleShuffle}
      />
    );
  }

  if (data?.shuffleMovie) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background px-4 py-16">
        <main className="w-full max-w-4xl space-y-4">
          <div className="flex justify-center">
            <Button variant="outline" onClick={handleShuffle}>
              Shuffle Again
            </Button>
          </div>
          <MovieResultDisplay movie={data.shuffleMovie} />
        </main>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4 py-16">
      <main className="w-full max-w-4xl space-y-8">
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold tracking-tight text-foreground">
            Shuffle Mode
          </h1>
          <p className="text-lg text-muted-foreground">
            Filter by genre, year range, and cast before randomizing. Get a
            random movie selection based on your preferences.
          </p>
        </div>

        <div className="space-y-6 bg-card border rounded-lg p-6">
          <GenreFilter
            selectedGenres={selectedGenres}
            onGenresChange={setSelectedGenres}
          />

          <YearRangeFilter
            yearRange={yearRange}
            onYearRangeChange={setYearRange}
            minYear={MIN_YEAR}
            maxYear={MAX_YEAR}
          />

          <CastFilter
            selectedCast={selectedCast}
            onCastChange={setSelectedCast}
          />

          <div className="pt-4">
            <Button onClick={handleShuffle} size="lg" className="w-full">
              Shuffle Movie
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}
