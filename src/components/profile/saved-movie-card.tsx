"use client";

import { memo, useMemo, useCallback } from "react";
import { useQuery } from "@apollo/client/react";
import { GET_MOVIE } from "@/lib/graphql";
import { Movie } from "@/types/suggest";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { RatingReviewSection } from "@/components/suggest/rating-review-section";
import { MovieTrailerDisplay } from "@/components/suggest/movie-trailer";
import { CardContainer } from "@/components/common/card-container";
import { SavedMovie } from "@/hooks/use-saved-movies";

interface SavedMovieCardProps {
  savedMovie: SavedMovie;
  onUnsave: () => void;
  priority?: boolean;
}

function SavedMovieCardComponent({ savedMovie, onUnsave, priority = false }: SavedMovieCardProps) {
  const { data, loading, error } = useQuery<{ getMovie: Movie }>(GET_MOVIE, {
    variables: { id: savedMovie.tmdbId },
    skip: !savedMovie.tmdbId,
    fetchPolicy: "cache-first", // Use cache when available
    errorPolicy: "all",
  });

  const handleUnsave = useCallback(async () => {
    try {
      await fetch(`/api/movies/unsave?tmdbId=${savedMovie.tmdbId}`, {
        method: "DELETE",
      });
      onUnsave();
    } catch {
      // Error is handled silently - user can try again
    }
  }, [savedMovie.tmdbId, onUnsave]);

  // Memoize computed values before early returns
  const movie = data?.getMovie;
  const moviePosterUrl = movie?.posterUrl;
  const movieReleaseDate = movie?.releaseDate;
  
  const posterUrl = useMemo(
    () => moviePosterUrl || "/placeholder-poster.jpg",
    [moviePosterUrl]
  );
  const releaseYear = useMemo(
    () => (movieReleaseDate ? new Date(movieReleaseDate).getFullYear() : null),
    [movieReleaseDate]
  );

  if (loading) {
    return (
      <CardContainer className="animate-pulse">
        <div className="h-64 bg-muted rounded mb-4" />
        <div className="h-4 bg-muted rounded w-3/4 mb-2" />
        <div className="h-4 bg-muted rounded w-1/2" />
      </CardContainer>
    );
  }

  if (error || !movie) {
    return (
      <CardContainer>
        <p className="text-muted-foreground">Failed to load movie</p>
      </CardContainer>
    );
  }

  return (
    <CardContainer className="space-y-4">
      <div className="relative aspect-2/3 w-full overflow-hidden rounded-lg">
        <Image
          src={posterUrl}
          alt={movie.title}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className="object-cover"
          priority={priority}
          loading={priority ? undefined : "lazy"}
        />
      </div>
      <div className="space-y-2">
        <h3 className="font-bold text-lg">{movie.title}</h3>
        {releaseYear && (
          <p className="text-sm text-muted-foreground">{releaseYear}</p>
        )}
        {savedMovie.rating && (
          <div className="flex items-center gap-2 text-sm">
            <span className="text-muted-foreground">Your Rating:</span>
            <span className="font-semibold">{savedMovie.rating.value}/10</span>
          </div>
        )}
        {savedMovie.review && (
          <div className="text-sm">
            <p className="text-muted-foreground mb-1">Your Review:</p>
            <p className="line-clamp-2">{savedMovie.review.content}</p>
          </div>
        )}
      </div>
      {movie.trailer && movie.trailer.key && movie.trailer.url && (
        <div className="pt-2 border-t">
          <h4 className="text-sm font-semibold text-foreground mb-2">Trailer</h4>
          <MovieTrailerDisplay trailer={movie.trailer} />
        </div>
      )}
      <div className="space-y-2">
        <Button
          variant="outline"
          size="sm"
          onClick={handleUnsave}
          className="w-full"
        >
          Remove from Saved
        </Button>
        <RatingReviewSection tmdbId={savedMovie.tmdbId} />
        <p className="text-xs text-muted-foreground pt-2 border-t">
          Data from{" "}
          <a
            href="https://www.themoviedb.org"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#01b4e4] hover:underline"
          >
            TMDB
          </a>
        </p>
      </div>
    </CardContainer>
  );
}

export const SavedMovieCard = memo(SavedMovieCardComponent);

