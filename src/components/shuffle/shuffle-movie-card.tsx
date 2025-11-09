"use client";

import { memo } from "react";
import { Movie } from "@/types/suggest";
import { Button } from "@/components/ui/button";
import { SaveMovieButton } from "@/components/suggest/save-movie-button";
import { MovieTrailerDisplay } from "@/components/suggest/movie-trailer";
import { CardContainer } from "@/components/common/card-container";
import { MovieCard } from "@/components/common/movie-card";
import { ExternalLink } from "lucide-react";

interface ShuffleMovieCardProps {
  movie: Movie;
  onShuffleAgain: () => void;
}

function ShuffleMovieCardComponent({ movie, onShuffleAgain }: ShuffleMovieCardProps) {
  const tmdbUrl = `https://www.themoviedb.org/movie/${movie.id}`;

  return (
    <CardContainer className="w-full">
      <MovieCard movie={movie} showOverview showGenres={false} />
      
      <div className="space-y-5 mt-5">
        {movie.trailer && movie.trailer.key && movie.trailer.url && (
          <div className="space-y-3 pt-4 border-t">
            <h3 className="text-base md:text-lg font-semibold text-foreground">
              Trailer
            </h3>
            <MovieTrailerDisplay trailer={movie.trailer} />
          </div>
        )}

        <div className="flex flex-wrap gap-3 pt-4 border-t">
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
    </CardContainer>
  );
}

export const ShuffleMovieCard = memo(ShuffleMovieCardComponent);

