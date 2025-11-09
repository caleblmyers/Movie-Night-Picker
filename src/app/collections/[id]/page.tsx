"use client";

import { useParams } from "next/navigation";
import { useQuery, useMutation } from "@apollo/client/react";
import { GET_COLLECTION, REMOVE_MOVIE_FROM_COLLECTION } from "@/lib/graphql";
import { Collection } from "@/types/suggest";
import { LoadingState } from "@/components/shared/loading-state";
import { ErrorState } from "@/components/shared/error-state";
import { CardContainer } from "@/components/common/card-container";
import { SectionHeader } from "@/components/common/section-header";
import { Button } from "@/components/ui/button";
import { Film, Users, TrendingUp, Calendar, Clock, Star, X, ArrowLeft } from "lucide-react";
import Link from "next/link";
import Image from "next/image";

export default function CollectionDetailPage() {
  const params = useParams();
  const collectionId = parseInt(params.id as string, 10);

  const { data, loading, error, refetch } = useQuery<{ getCollection: Collection }>(
    GET_COLLECTION,
    {
      variables: { id: collectionId },
      skip: !collectionId || isNaN(collectionId),
      fetchPolicy: "cache-first",
    }
  );

  const [removeMovie] = useMutation(REMOVE_MOVIE_FROM_COLLECTION, {
    onCompleted: () => {
      refetch();
    },
  });

  if (loading) {
    return <LoadingState message="Loading collection..." />;
  }

  if (error) {
    return (
      <ErrorState
        message={error.message || "Failed to load collection. Please try again."}
        onRetry={() => refetch()}
      />
    );
  }

  const collection = data?.getCollection;
  if (!collection) {
    return (
      <div className="min-h-screen bg-background px-4 py-16">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-2xl font-bold text-foreground mb-4">
            Collection not found
          </h1>
          <Button asChild>
            <Link href="/collections">Go to Collections</Link>
          </Button>
        </div>
      </div>
    );
  }

  const insights = collection.insights;
  const movies = collection.movies || [];

  const handleRemoveMovie = async (tmdbId: number) => {
    if (confirm("Remove this movie from the collection?")) {
      await removeMovie({
        variables: { collectionId: collection.id, tmdbId },
      });
    }
  };

  const releaseYear = (date?: string | null) => {
    if (!date) return null;
    try {
      return new Date(date).getFullYear();
    } catch {
      return null;
    }
  };

  return (
    <div className="min-h-screen bg-background px-4 py-8 md:py-16">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Back Button */}
        <Button variant="ghost" asChild>
          <Link href="/collections">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Collections
          </Link>
        </Button>

        {/* Collection Header */}
        <CardContainer>
          <div className="space-y-4">
            <div className="flex items-start justify-between">
              <div>
                <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
                  {collection.name}
                </h1>
                {collection.description && (
                  <p className="text-lg text-muted-foreground">
                    {collection.description}
                  </p>
                )}
              </div>
              {collection.isPublic && (
                <span className="text-sm bg-primary/20 text-primary px-3 py-1 rounded">
                  Public
                </span>
              )}
            </div>
            <div className="flex items-center gap-4 text-sm text-muted-foreground pt-4 border-t">
              <span className="flex items-center gap-1">
                <Film className="h-4 w-4" />
                {collection.movieCount} movie{collection.movieCount !== 1 ? "s" : ""}
              </span>
              <span className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                Updated {new Date(collection.updatedAt).toLocaleDateString()}
              </span>
            </div>
          </div>
        </CardContainer>

        {/* Insights */}
        {insights && (
          <CardContainer>
            <div className="space-y-6">
              <SectionHeader icon={<TrendingUp className="h-6 w-6" />}>
                Collection Insights
              </SectionHeader>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Total Movies</p>
                  <p className="text-2xl font-bold text-foreground">{insights.totalMovies ?? 0}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Unique Genres</p>
                  <p className="text-2xl font-bold text-foreground">{insights.uniqueGenres ?? 0}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Unique Actors</p>
                  <p className="text-2xl font-bold text-foreground">{insights.uniqueActors ?? 0}</p>
                </div>
                <div className="space-y-1">
                  <p className="text-sm text-muted-foreground">Unique Crew</p>
                  <p className="text-2xl font-bold text-foreground">{insights.uniqueCrew ?? 0}</p>
                </div>
              </div>

              {insights.yearRange && insights.yearRange.min !== null && insights.yearRange.max !== null && (
                <div className="space-y-1 pt-4 border-t">
                  <p className="text-sm text-muted-foreground">Year Range</p>
                  <p className="text-lg font-semibold text-foreground">
                    {insights.yearRange.min} - {insights.yearRange.max}
                  </p>
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t">
                {insights.averageRuntime !== null && (
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      Average Runtime
                    </p>
                    <p className="text-lg font-semibold text-foreground">
                      {Math.round(insights.averageRuntime)} minutes
                    </p>
                  </div>
                )}
                {insights.averageVoteAverage !== null && (
                  <div className="space-y-1">
                    <p className="text-sm text-muted-foreground flex items-center gap-1">
                      <Star className="h-4 w-4" />
                      Average Rating
                    </p>
                    <p className="text-lg font-semibold text-foreground">
                      {insights.averageVoteAverage.toFixed(1)}/10
                    </p>
                  </div>
                )}
              </div>

              {/* Top Genres */}
              {insights.moviesByGenre && Array.isArray(insights.moviesByGenre) && insights.moviesByGenre.length > 0 && (
                <div className="space-y-3 pt-4 border-t">
                  <h3 className="text-lg font-semibold text-foreground">Top Genres</h3>
                  <div className="flex flex-wrap gap-2">
                    {insights.moviesByGenre.slice(0, 10).map((item) => (
                      <div
                        key={item.genre.id}
                        className="flex items-center gap-2 bg-secondary px-3 py-1 rounded-md"
                      >
                        <span className="text-sm font-medium text-foreground">
                          {item.genre.name}
                        </span>
                        <span className="text-xs text-muted-foreground">({item.count})</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Top Actors */}
              {insights.topActors && Array.isArray(insights.topActors) && insights.topActors.length > 0 && (
                <div className="space-y-3 pt-4 border-t">
                  <h3 className="text-lg font-semibold text-foreground">Top Actors</h3>
                  <div className="flex flex-wrap gap-3">
                    {insights.topActors.map((item) => (
                      <Link
                        key={item.person.id}
                        href={`/person/${item.person.id}`}
                        className="flex items-center gap-2 bg-secondary px-3 py-2 rounded-md transition-opacity hover:opacity-80"
                      >
                        {item.person.profileUrl ? (
                          <div className="relative h-8 w-8 overflow-hidden rounded-full">
                            <Image
                              src={item.person.profileUrl}
                              alt={item.person.name}
                              fill
                              sizes="32px"
                              className="object-cover"
                            />
                          </div>
                        ) : (
                          <Users className="h-4 w-4 text-muted-foreground" />
                        )}
                        <div>
                          <p className="text-sm font-medium text-foreground">
                            {item.person.name}
                          </p>
                          <p className="text-xs text-muted-foreground">{item.count} movies</p>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* Top Crew */}
              {insights.topCrew && Array.isArray(insights.topCrew) && insights.topCrew.length > 0 && (
                <div className="space-y-3 pt-4 border-t">
                  <h3 className="text-lg font-semibold text-foreground">Top Crew</h3>
                  <div className="flex flex-wrap gap-3">
                    {insights.topCrew.map((item) => (
                      <Link
                        key={item.person.id}
                        href={`/person/${item.person.id}`}
                        className="flex items-center gap-2 bg-secondary px-3 py-2 rounded-md transition-opacity hover:opacity-80"
                      >
                        {item.person.profileUrl ? (
                          <div className="relative h-8 w-8 overflow-hidden rounded-full">
                            <Image
                              src={item.person.profileUrl}
                              alt={item.person.name}
                              fill
                              sizes="32px"
                              className="object-cover"
                            />
                          </div>
                        ) : (
                          <Users className="h-4 w-4 text-muted-foreground" />
                        )}
                        <div>
                          <p className="text-sm font-medium text-foreground">
                            {item.person.name}
                          </p>
                          <p className="text-xs text-muted-foreground">{item.count} movies</p>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </CardContainer>
        )}

        {/* Movies */}
        {movies.length > 0 ? (
          <CardContainer>
            <div className="space-y-4">
              <SectionHeader icon={<Film className="h-6 w-6" />}>
                Movies ({movies.length})
              </SectionHeader>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {movies.map((collectionMovie) => {
                  const movie = collectionMovie.movie;
                  if (!movie) return null;
                  return (
                    <div key={collectionMovie.id} className="group relative">
                      <Link
                        href={`/movie/${movie.id}`}
                        className="flex flex-col space-y-2 transition-opacity hover:opacity-80"
                      >
                        <div className="relative aspect-2/3 w-full overflow-hidden rounded-lg bg-muted">
                          {movie.posterUrl ? (
                            <Image
                              src={movie.posterUrl}
                              alt={movie.title}
                              fill
                              sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, 20vw"
                              className="object-cover"
                            />
                          ) : (
                            <div className="flex h-full w-full items-center justify-center">
                              <Film className="h-12 w-12 text-muted-foreground" />
                            </div>
                          )}
                        </div>
                        <div className="space-y-1">
                          <p className="text-sm font-medium text-foreground line-clamp-2 group-hover:text-primary transition-colors">
                            {movie.title}
                          </p>
                          <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            {releaseYear(movie.releaseDate) && (
                              <span>{releaseYear(movie.releaseDate)}</span>
                            )}
                            {movie.voteAverage !== null && movie.voteAverage !== undefined && (
                              <>
                                {releaseYear(movie.releaseDate) && <span>•</span>}
                                <span>{movie.voteAverage.toFixed(1)}/10</span>
                              </>
                            )}
                          </div>
                        </div>
                      </Link>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity bg-background/80 hover:bg-destructive/20"
                        onClick={(e) => {
                          e.preventDefault();
                          handleRemoveMovie(collectionMovie.tmdbId);
                        }}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  );
                })}
              </div>
            </div>
          </CardContainer>
        ) : (
          <CardContainer>
            <div className="text-center py-12">
              <Film className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-xl font-semibold text-foreground mb-2">
                No movies in this collection
              </h3>
              <p className="text-muted-foreground">
                Add movies to this collection from movie detail pages
              </p>
            </div>
          </CardContainer>
        )}
      </div>
    </div>
  );
}

