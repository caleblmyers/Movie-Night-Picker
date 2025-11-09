"use client";

import { memo, useMemo } from "react";
import { MovieResult, Movie } from "@/types/suggest";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { SaveMovieButton } from "./save-movie-button";
import { RatingReviewSection } from "./rating-review-section";
import { MovieTrailerDisplay } from "./movie-trailer";

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
  const posterUrl = useMemo(
    () => movie.posterUrl || "/placeholder-poster.jpg",
    [movie.posterUrl]
  );
  const releaseYear = useMemo(
    () => (movie.releaseDate ? new Date(movie.releaseDate).getFullYear() : null),
    [movie.releaseDate]
  );

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
              {releaseYear && (
                <p className="text-muted-foreground">{releaseYear}</p>
              )}
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
            <div className="pt-2 border-t text-xs text-muted-foreground">
              <p>
                Movie data from{" "}
                <a
                  href="https://www.themoviedb.org"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[#01b4e4] hover:underline"
                >
                  The Movie Database
                </a>
              </p>
            </div>
            {showActions && (
              <div className="flex flex-col gap-4 pt-4">
                <div className="flex gap-4 flex-wrap">
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
        </div>
      </div>
    </div>
  );
}

export const MovieResultDisplay = memo(MovieResultDisplayComponent);
