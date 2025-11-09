"use client";

import { useParams } from "next/navigation";
import { useQuery } from "@apollo/client/react";
import { GET_MOVIE } from "@/lib/graphql";
import { Movie } from "@/types/suggest";
import { Button } from "@/components/ui/button";
import { SaveMovieButton } from "@/components/suggest/save-movie-button";
import { MovieTrailerDisplay } from "@/components/suggest/movie-trailer";
import { RatingReviewSection } from "@/components/suggest/rating-review-section";
import { AddToCollectionButton } from "@/components/collections/add-to-collection-button";
import { LoadingState } from "@/components/shared/loading-state";
import { ErrorState } from "@/components/shared/error-state";
import { CardContainer } from "@/components/common/card-container";
import { SectionHeader } from "@/components/common/section-header";
import { MovieCard } from "@/components/common/movie-card";
import { CastMemberCard } from "@/components/common/cast-member-card";
import { CrewMemberCard } from "@/components/common/crew-member-card";
import { Clock, User, Film, Users } from "lucide-react";
import { TMDBLinkButton } from "@/components/common/tmdb-link-button";
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
        <CardContainer>
          <MovieCard movie={movie} showOverview showGenres priority={true} />
          
          {/* Runtime Display (not in MovieCard) */}
          {movie.runtime && (
            <div className="flex items-center gap-1.5 pt-4 border-t text-sm text-muted-foreground">
              <Clock className="h-4 w-4" />
              <span>{formatRuntime(movie.runtime)}</span>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-3 pt-4 border-t">
            <SaveMovieButton tmdbId={movie.id} />
            <AddToCollectionButton 
              tmdbId={movie.id} 
              currentCollections={movie.inCollections}
            />
            <TMDBLinkButton movieId={movie.id} />
          </div>
        </CardContainer>

        {/* Trailer */}
        {movie.trailer && movie.trailer.key && movie.trailer.url && (
          <CardContainer>
            <div className="space-y-4">
              <SectionHeader icon={<Film className="h-6 w-6" />}>
                Trailer
              </SectionHeader>
              <MovieTrailerDisplay trailer={movie.trailer} />
            </div>
          </CardContainer>
        )}

        {/* Cast */}
        {movie.cast && movie.cast.length > 0 && (
          <CardContainer>
            <div className="space-y-4">
              <SectionHeader icon={<Users className="h-6 w-6" />}>
                Cast
              </SectionHeader>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {movie.cast.slice(0, 20).map((actor) => (
                  <CastMemberCard key={actor.id} actor={actor} />
                ))}
              </div>
            </div>
          </CardContainer>
        )}

        {/* Crew */}
        {movie.crew && movie.crew.length > 0 && (
          <CardContainer>
            <div className="space-y-6">
              <SectionHeader icon={<User className="h-6 w-6" />}>
                Crew
              </SectionHeader>

              {directors.length > 0 && (
                <div className="space-y-3">
                  <h3 className="text-lg font-semibold text-foreground">
                    Directors
                  </h3>
                  <div className="flex flex-wrap gap-3">
                    {directors.map((director) => (
                      <CrewMemberCard key={director.id} member={director} />
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
                      <CrewMemberCard key={writer.id} member={writer} />
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
                      <CrewMemberCard key={producer.id} member={producer} />
                    ))}
                  </div>
                </div>
              )}
            </div>
          </CardContainer>
        )}

        {/* Rating & Review Section */}
        <CardContainer>
          <RatingReviewSection tmdbId={movie.id} />
        </CardContainer>
      </div>
    </div>
  );
}

