"use client";

import { memo } from "react";
import { Movie } from "@/types/suggest";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { RefreshCw } from "lucide-react";
import Image from "next/image";

interface MovieSelectionRoundProps {
  round: number;
  totalRounds: number;
  movies: Movie[];
  onSelect: (movie: Movie) => void;
  onRefresh?: () => void;
  loading?: boolean;
}

function MovieSelectionRoundComponent({
  round,
  totalRounds,
  movies,
  onSelect,
  onRefresh,
  loading = false,
}: MovieSelectionRoundProps) {
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center gap-8 px-4 py-16 max-w-6xl mx-auto">
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold tracking-tight text-foreground">
            Round {round} of {totalRounds}
          </h1>
          <p className="text-lg text-muted-foreground">Loading movies...</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 w-full">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="animate-pulse bg-muted rounded-lg aspect-2/3"
            />
          ))}
        </div>
      </div>
    );
  }

  if (movies.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center gap-8 px-4 py-16 max-w-6xl mx-auto">
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold tracking-tight text-foreground">
            Round {round} of {totalRounds}
          </h1>
          <p className="text-lg text-muted-foreground">
            No movies available for this round
          </p>
        </div>
        {onRefresh && (
          <Button
            variant="outline"
            onClick={onRefresh}
            className="gap-2"
          >
            <RefreshCw className="h-4 w-4" />
            <span>Try Again</span>
          </Button>
        )}
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center gap-8 px-4 py-16 max-w-6xl mx-auto">
      <div className="text-center space-y-2">
        <h1 className="text-4xl font-bold tracking-tight text-foreground">
          Round {round} of {totalRounds}
        </h1>
        <p className="text-lg text-muted-foreground">
          Pick a movie that interests you
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 w-full">
        {movies.map((movie, index) => (
          <button
            key={movie.id}
            onClick={() => onSelect(movie)}
            className={cn(
              "group flex flex-col overflow-hidden rounded-lg border-2 border-transparent",
              "bg-card hover:border-primary transition-all duration-200",
              "hover:scale-105 hover:shadow-lg",
              "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
            )}
          >
            {/* Poster */}
            <div className="relative aspect-2/3 w-full overflow-hidden bg-muted">
              {movie.posterUrl ? (
                <Image
                  src={movie.posterUrl}
                  alt={movie.title}
                  fill
                  sizes="(max-width: 768px) 50vw, (max-width: 1200px) 25vw, 20vw"
                  className="object-cover transition-transform group-hover:scale-105"
                  priority={index === 0}
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center">
                  <span className="text-muted-foreground">No Poster</span>
                </div>
              )}
            </div>

            {/* Movie Info */}
            <div className="flex flex-col gap-2 p-4">
              <h3 className="font-semibold text-foreground line-clamp-2 text-left">
                {movie.title}
              </h3>
              {movie.releaseDate && (
                <p className="text-sm text-muted-foreground text-left">
                  {new Date(movie.releaseDate).getFullYear()}
                </p>
              )}
              {movie.genres && movie.genres.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {movie.genres.slice(0, 2).map((genre) => (
                    <span
                      key={genre.id}
                      className="rounded-full bg-secondary px-2 py-0.5 text-xs text-secondary-foreground"
                    >
                      {genre.name}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </button>
        ))}
      </div>

      {onRefresh && (
        <Button
          variant="ghost"
          size="sm"
          onClick={onRefresh}
          className="mt-4 gap-2 text-muted-foreground hover:text-foreground"
        >
          <RefreshCw className="h-4 w-4" />
          <span>Refresh Options</span>
        </Button>
      )}
    </div>
  );
}

export const MovieSelectionRound = memo(MovieSelectionRoundComponent);

