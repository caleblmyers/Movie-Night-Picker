"use client";

import { memo, useMemo } from "react";
import { Movie } from "@/types/suggest";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { SaveMovieButton } from "@/components/suggest/save-movie-button";
import { MovieTrailerDisplay } from "@/components/suggest/movie-trailer";
import { ExternalLink, Star, Calendar } from "lucide-react";

interface ShuffleMovieCardProps {
  movie: Movie;
  onShuffleAgain: () => void;
}

function ShuffleMovieCardComponent({ movie, onShuffleAgain }: ShuffleMovieCardProps) {
  const posterUrl = useMemo(
    () => movie.posterUrl || "/placeholder-poster.jpg",
    [movie.posterUrl]
  );
  const releaseYear = useMemo(
    () => (movie.releaseDate ? new Date(movie.releaseDate).getFullYear() : null),
    [movie.releaseDate]
  );

  const tmdbUrl = `https://www.themoviedb.org/movie/${movie.id}`;

  return (
    <div className="w-full bg-card border rounded-lg p-6 md:p-8 shadow-lg">
      <div className="flex flex-col md:flex-row gap-6">
        <div className="shrink-0 mx-auto md:mx-0">
          <Image
            src={posterUrl}
            alt={movie.title}
            width={300}
            height={450}
            className="rounded-lg object-cover shadow-md"
            priority
            loading="eager"
          />
        </div>
        <div className="flex-1 space-y-5">
          <div className="space-y-2">
            <h2 className="text-2xl md:text-3xl font-bold text-foreground">
              {movie.title}
            </h2>
            <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
              {releaseYear && (
                <div className="flex items-center gap-1.5">
                  <Calendar className="h-4 w-4" />
                  <span>{releaseYear}</span>
                </div>
              )}
              {movie.voteAverage !== undefined && (
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
          </div>

          {movie.overview && (
            <div className="space-y-2">
              <h3 className="text-base md:text-lg font-semibold text-foreground">
                Overview
              </h3>
              <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
                {movie.overview}
              </p>
            </div>
          )}

          {movie.trailer && movie.trailer.key && movie.trailer.url && (
            <div className="space-y-3 pt-4 border-t">
              <h3 className="text-base md:text-lg font-semibold text-foreground">
                Trailer
              </h3>
              <MovieTrailerDisplay trailer={movie.trailer} />
            </div>
          )}

          <div className="pt-4 border-t space-y-3">
            <div className="flex flex-wrap gap-3">
              <Button onClick={onShuffleAgain} variant="default" className="flex-1 min-w-[140px]">
                Pick Another Random Movie
              </Button>
              <Button asChild variant="outline" className="flex-1 min-w-[140px]">
                <a
                  href={tmdbUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2"
                >
                  <ExternalLink className="h-4 w-4" />
                  View on TMDB
                </a>
              </Button>
              <SaveMovieButton tmdbId={movie.id} />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export const ShuffleMovieCard = memo(ShuffleMovieCardComponent);

