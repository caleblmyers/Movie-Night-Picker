"use client";

import { memo } from "react";
import { Movie } from "@/types/suggest";
import { Button } from "@/components/ui/button";
import { SaveMovieButton } from "@/components/suggest/save-movie-button";
import { MovieTrailerDisplay } from "@/components/suggest/movie-trailer";
import { CardContainer } from "@/components/common/card-container";
import { MovieCard } from "@/components/common/movie-card";
import { TMDBLinkButton } from "@/components/common/tmdb-link-button";

interface ShuffleMovieCardProps {
  movie: Movie;
  onShuffleAgain: () => void;
}

function ShuffleMovieCardComponent({ movie, onShuffleAgain }: ShuffleMovieCardProps) {
  return (
    <CardContainer className="w-full">
      <MovieCard movie={movie} showOverview showGenres={false} priority={true} />
      
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
          <TMDBLinkButton movieId={movie.id} className="flex-1 min-w-[140px]" />
          <SaveMovieButton tmdbId={movie.id} />
        </div>
      </div>
    </CardContainer>
  );
}

export const ShuffleMovieCard = memo(ShuffleMovieCardComponent);

