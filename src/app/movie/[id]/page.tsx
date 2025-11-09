"use client";

import { useParams } from "next/navigation";
import { useQuery } from "@apollo/client/react";
import { GET_MOVIE } from "@/lib/graphql";
import { Movie } from "@/types/suggest";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { SaveMovieButton } from "@/components/suggest/save-movie-button";
import { MovieTrailerDisplay } from "@/components/suggest/movie-trailer";
import { RatingReviewSection } from "@/components/suggest/rating-review-section";
import { LoadingState } from "@/components/shared/loading-state";
import { ErrorState } from "@/components/shared/error-state";
import {
  Calendar,
  Clock,
  Star,
  ExternalLink,
  User,
  Film,
  Users,
} from "lucide-react";
import Link from "next/link";

export default function MovieDetailPage() {
  const params = useParams();
  const movieId = parseInt(params.id as string, 10);

  const { data, loading, error } = useQuery<{ getMovie: Movie }>(GET_MOVIE, {
    variables: { id: movieId },
    skip: !movieId || isNaN(movieId),
    fetchPolicy: "cache-first",
  });

  if (loading) {
    return <LoadingState message="Loading movie..." />;
  }

  if (error) {
    return (
      <ErrorState
        message={error.message || "Failed to load movie. Please try again."}
        onRetry={() => window.location.reload()}
      />
    );
  }

  const movie = data?.getMovie;
  if (!movie) {
    return (
      <div className="min-h-screen bg-background px-4 py-16">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-2xl font-bold text-foreground mb-4">
            Movie not found
          </h1>
          <Button asChild>
            <Link href="/">Go Home</Link>
          </Button>
        </div>
      </div>
    );
  }

  const releaseYear = movie.releaseDate
    ? new Date(movie.releaseDate).getFullYear()
    : null;

  const formatRuntime = (minutes?: number | null) => {
    if (!minutes) return null;
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0) {
      return `${hours}h ${mins}m`;
    }
    return `${mins}m`;
  };

  const directors = movie.crew?.filter((c) => c.job === "Director") || [];
  const writers = movie.crew?.filter((c) => c.job === "Writer") || [];
  const producers = movie.crew?.filter((c) => c.job === "Producer") || [];

  return (
    <div className="min-h-screen bg-background px-4 py-8 md:py-16">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Back Button */}
        <Button variant="ghost" asChild>
          <Link href="/">← Back</Link>
        </Button>

        {/* Main Movie Info */}
        <div className="bg-card border rounded-lg p-6 md:p-8 shadow-lg">
          <div className="flex flex-col md:flex-row gap-6">
            {/* Poster */}
            <div className="shrink-0 mx-auto md:mx-0">
              <Image
                src={movie.posterUrl || "/placeholder-poster.jpg"}
                alt={movie.title}
                width={300}
                height={450}
                className="rounded-lg object-cover shadow-md"
                priority
              />
            </div>

            {/* Movie Details */}
            <div className="flex-1 space-y-5">
              <div className="space-y-3">
                <h1 className="text-3xl md:text-4xl font-bold text-foreground">
                  {movie.title}
                </h1>

                <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                  {releaseYear && (
                    <div className="flex items-center gap-1.5">
                      <Calendar className="h-4 w-4" />
                      <span>{releaseYear}</span>
                    </div>
                  )}
                  {movie.runtime && (
                    <div className="flex items-center gap-1.5">
                      <Clock className="h-4 w-4" />
                      <span>{formatRuntime(movie.runtime)}</span>
                    </div>
                  )}
                  {movie.voteAverage !== undefined && (
                    <div className="flex items-center gap-1.5">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span className="font-medium">
                        {movie.voteAverage.toFixed(1)}
                      </span>
                      <span>/10</span>
                      {movie.voteCount !== undefined && (
                        <span className="text-xs">
                          ({movie.voteCount.toLocaleString()} votes)
                        </span>
                      )}
                    </div>
                  )}
                </div>

                {movie.genres && movie.genres.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {movie.genres.map((genre) => (
                      <span
                        key={genre.id}
                        className="px-3 py-1 bg-secondary text-secondary-foreground rounded-full text-sm"
                      >
                        {genre.name}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {movie.overview && (
                <div className="space-y-2">
                  <h2 className="text-lg font-semibold text-foreground">
                    Overview
                  </h2>
                  <p className="text-muted-foreground leading-relaxed">
                    {movie.overview}
                  </p>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-3 pt-4 border-t">
                <SaveMovieButton tmdbId={movie.id} />
                <Button asChild variant="outline">
                  <a
                    href={`https://www.themoviedb.org/movie/${movie.id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2"
                  >
                    <ExternalLink className="h-4 w-4" />
                    View on TMDB
                  </a>
                </Button>
              </div>
            </div>
          </div>
        </div>

        {/* Trailer */}
        {movie.trailer && movie.trailer.key && movie.trailer.url && (
          <div className="bg-card border rounded-lg p-6 md:p-8 shadow-lg space-y-4">
            <h2 className="text-2xl font-bold text-foreground flex items-center gap-2">
              <Film className="h-6 w-6" />
              Trailer
            </h2>
            <MovieTrailerDisplay trailer={movie.trailer} />
          </div>
        )}

        {/* Cast */}
        {movie.cast && movie.cast.length > 0 && (
          <div className="bg-card border rounded-lg p-6 md:p-8 shadow-lg space-y-4">
            <h2 className="text-2xl font-bold text-foreground flex items-center gap-2">
              <Users className="h-6 w-6" />
              Cast
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {movie.cast.slice(0, 20).map((actor) => (
                <div
                  key={actor.id}
                  className="flex flex-col items-center text-center space-y-2"
                >
                  <div className="relative w-20 h-20 rounded-full overflow-hidden bg-muted">
                    {actor.profileUrl ? (
                      <Image
                        src={actor.profileUrl}
                        alt={actor.name}
                        fill
                        className="object-cover"
                        sizes="80px"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <User className="h-8 w-8 text-muted-foreground" />
                      </div>
                    )}
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-medium text-foreground">
                      {actor.name}
                    </p>
                    {actor.character && (
                      <p className="text-xs text-muted-foreground">
                        {actor.character}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Crew */}
        {movie.crew && movie.crew.length > 0 && (
          <div className="bg-card border rounded-lg p-6 md:p-8 shadow-lg space-y-6">
            <h2 className="text-2xl font-bold text-foreground flex items-center gap-2">
              <User className="h-6 w-6" />
              Crew
            </h2>

            {directors.length > 0 && (
              <div className="space-y-3">
                <h3 className="text-lg font-semibold text-foreground">
                  Directors
                </h3>
                <div className="flex flex-wrap gap-3">
                  {directors.map((director) => (
                    <div
                      key={director.id}
                      className="flex items-center gap-2 px-3 py-2 bg-secondary rounded-lg"
                    >
                      {director.profileUrl && (
                        <div className="relative w-8 h-8 rounded-full overflow-hidden bg-muted">
                          <Image
                            src={director.profileUrl}
                            alt={director.name}
                            fill
                            className="object-cover"
                            sizes="32px"
                          />
                        </div>
                      )}
                      <span className="text-sm text-foreground">
                        {director.name}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {writers.length > 0 && (
              <div className="space-y-3">
                <h3 className="text-lg font-semibold text-foreground">
                  Writers
                </h3>
                <div className="flex flex-wrap gap-3">
                  {writers.map((writer) => (
                    <div
                      key={writer.id}
                      className="flex items-center gap-2 px-3 py-2 bg-secondary rounded-lg"
                    >
                      {writer.profileUrl && (
                        <div className="relative w-8 h-8 rounded-full overflow-hidden bg-muted">
                          <Image
                            src={writer.profileUrl}
                            alt={writer.name}
                            fill
                            className="object-cover"
                            sizes="32px"
                          />
                        </div>
                      )}
                      <span className="text-sm text-foreground">
                        {writer.name}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {producers.length > 0 && (
              <div className="space-y-3">
                <h3 className="text-lg font-semibold text-foreground">
                  Producers
                </h3>
                <div className="flex flex-wrap gap-3">
                  {producers.map((producer) => (
                    <div
                      key={producer.id}
                      className="flex items-center gap-2 px-3 py-2 bg-secondary rounded-lg"
                    >
                      {producer.profileUrl && (
                        <div className="relative w-8 h-8 rounded-full overflow-hidden bg-muted">
                          <Image
                            src={producer.profileUrl}
                            alt={producer.name}
                            fill
                            className="object-cover"
                            sizes="32px"
                          />
                        </div>
                      )}
                      <span className="text-sm text-foreground">
                        {producer.name}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Rating & Review Section */}
        <div className="bg-card border rounded-lg p-6 md:p-8 shadow-lg">
          <RatingReviewSection tmdbId={movie.id} />
        </div>
      </div>
    </div>
  );
}

