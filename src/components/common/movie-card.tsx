"use client";

import { memo, useMemo } from "react";
import Image from "next/image";
import { Movie, MovieResult } from "@/types/suggest";
import { Calendar, Star } from "lucide-react";

interface MovieCardProps {
  movie: Movie | MovieResult;
  showOverview?: boolean;
  showGenres?: boolean;
  posterSize?: { width: number; height: number };
  className?: string;
  priority?: boolean;
}

/**
 * Reusable movie card component with consistent styling
 * Standardizes the layout, spacing, and visual hierarchy
 */
export const MovieCard = memo(function MovieCard({
  movie,
  showOverview = true,
  showGenres = false,
  posterSize = { width: 300, height: 450 },
  className = "",
  priority = false,
}: MovieCardProps) {
  const posterUrl = useMemo(
    () => movie.posterUrl || "/placeholder-poster.jpg",
    [movie.posterUrl]
  );

  const releaseYear = useMemo(
    () => (movie.releaseDate ? new Date(movie.releaseDate).getFullYear() : null),
    [movie.releaseDate]
  );

  return (
    <div className={`flex flex-col gap-6 md:flex-row ${className}`}>
      {/* Poster - layout → spacing → visual */}
      <div className="mx-auto shrink-0 md:mx-0">
        <Image
          src={posterUrl}
          alt={movie.title}
          width={posterSize.width}
          height={posterSize.height}
          className="rounded-lg object-cover shadow-md"
          priority={priority}
          sizes="(max-width: 768px) 100vw, 300px"
        />
      </div>

      {/* Movie Details - layout → spacing → typography → visual */}
      <div className="flex-1 space-y-5">
        <div className="space-y-2">
          {/* Typography: size → weight → color */}
          <h2 className="text-2xl font-bold text-foreground md:text-3xl">
            {movie.title}
          </h2>

          {/* Layout: flex → spacing → typography → visual */}
          <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
            {releaseYear && (
              <div className="flex items-center gap-1.5">
                <Calendar className="h-4 w-4" />
                <span>{releaseYear}</span>
              </div>
            )}
            {movie.voteAverage !== undefined && movie.voteAverage !== null && (
              <div className="flex items-center gap-1.5">
                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                <span className="font-medium">{movie.voteAverage.toFixed(1)}</span>
                <span className="text-muted-foreground">/10</span>
                {movie.voteCount !== undefined && (
                  <span className="text-xs text-muted-foreground">
                    ({movie.voteCount.toLocaleString()} votes)
                  </span>
                )}
              </div>
            )}
          </div>

          {/* Layout: flex → spacing → visual */}
          {showGenres && movie.genres && movie.genres.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {movie.genres.map((genre) => (
                <span
                  key={genre.id}
                  className="rounded-full bg-secondary px-3 py-1 text-sm text-secondary-foreground"
                >
                  {genre.name}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Layout: spacing → typography → visual */}
        {showOverview && movie.overview && (
          <div className="space-y-2">
            <h3 className="text-base font-semibold text-foreground md:text-lg">
              Overview
            </h3>
            <p className="text-sm leading-relaxed text-muted-foreground md:text-base">
              {movie.overview}
            </p>
          </div>
        )}
      </div>
    </div>
  );
});

