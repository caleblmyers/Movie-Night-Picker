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
    <div className="w-full bg-card border rounded-lg p-8 shadow-lg">
      <div className="flex flex-col md:flex-row gap-6">
        <div className="shrink-0 mx-auto md:mx-0">
          <Image
            src={posterUrl}
            alt={movie.title}
            width={300}
            height={450}
            className="rounded-lg object-cover"
            priority
            loading="eager"
          />
        </div>
        <div className="flex-1 space-y-4">
          <div>
            <h2 className="text-3xl font-bold text-foreground mb-2">
              {movie.title}
            </h2>
            <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
              {releaseYear && (
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  <span>{releaseYear}</span>
                </div>
              )}
              {movie.voteAverage !== undefined && (
                <div className="flex items-center gap-1">
                  <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                  <span>{movie.voteAverage.toFixed(1)}/10</span>
                  {movie.voteCount !== undefined && (
                    <span className="text-xs">({movie.voteCount.toLocaleString()} votes)</span>
                  )}
                </div>
              )}
            </div>
          </div>

          {movie.overview && (
            <div>
              <h3 className="text-lg font-semibold text-foreground mb-2">
                Overview
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                {movie.overview}
              </p>
            </div>
          )}

          {movie.trailer && movie.trailer.key && movie.trailer.url && (
            <div className="pt-4 border-t">
              <h3 className="text-lg font-semibold text-foreground mb-3">
                Trailer
              </h3>
              <MovieTrailerDisplay trailer={movie.trailer} />
            </div>
          )}

          <div className="pt-4 border-t space-y-3">
            <div className="flex gap-4 flex-wrap">
              <Button onClick={onShuffleAgain} variant="default">
                Pick Another Random Movie
              </Button>
              <Button asChild variant="outline">
                <a
                  href={tmdbUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2"
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

