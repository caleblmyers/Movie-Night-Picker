"use client";

import { memo } from "react";
import { MovieResult, Movie } from "@/types/suggest";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { SaveMovieButton } from "./save-movie-button";
import { RatingReviewSection } from "./rating-review-section";
import { MovieTrailerDisplay } from "./movie-trailer";
import { CardContainer } from "@/components/common/card-container";
import { MovieCard } from "@/components/common/movie-card";

interface MovieResultDisplayProps {
  movie: MovieResult | Movie;
  title?: string;
  subtitle?: string;
  showActions?: boolean;
}

function MovieResultDisplayComponent({
  movie,
  title = "Your Movie Pick",
  subtitle = "Based on your preferences",
  showActions = true,
}: MovieResultDisplayProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-8 px-4 py-16 max-w-4xl mx-auto">
      <div className="text-center space-y-2">
        <h1 className="text-4xl font-bold tracking-tight text-foreground">
          {title}
        </h1>
        {subtitle && (
          <p className="text-lg text-muted-foreground">{subtitle}</p>
        )}
      </div>

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
          
          <div className="pt-3 border-t">
            <p className="text-xs text-muted-foreground">
              Movie data from{" "}
              <a
                href="https://www.themoviedb.org"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#01b4e4] hover:underline transition-colors"
              >
                The Movie Database
              </a>
            </p>
          </div>
          
          {showActions && (
            <div className="flex flex-col gap-4 pt-4 border-t">
              <div className="flex flex-wrap gap-3">
                <Button asChild>
                  <Link href="/">Start Over</Link>
                </Button>
                <Button asChild variant="outline">
                  <Link href="/suggest">Try Again</Link>
                </Button>
                <SaveMovieButton tmdbId={movie.id} />
              </div>
              <RatingReviewSection tmdbId={movie.id} />
            </div>
          )}
        </div>
      </CardContainer>
    </div>
  );
}

export const MovieResultDisplay = memo(MovieResultDisplayComponent);
