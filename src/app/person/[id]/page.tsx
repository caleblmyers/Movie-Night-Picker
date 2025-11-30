"use client";

import { useState, useMemo, useEffect } from "react";
import { useParams } from "next/navigation";
import { useQuery } from "@apollo/client/react";
import { GET_PERSON } from "@/lib/graphql";
import { Person } from "@/types/suggest";
import { Button } from "@/components/ui/button";
import { LoadingState } from "@/components/shared/loading-state";
import { ErrorState } from "@/components/shared/error-state";
import { CardContainer } from "@/components/common/card-container";
import { SectionHeader } from "@/components/common/section-header";
import { User, Calendar, MapPin, TrendingUp, Film, ChevronLeft, ChevronRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

const MOVIES_PER_PAGE = 20;

export default function PersonDetailPage() {
  const params = useParams();
  const personId = parseInt(params.id as string, 10);
  const [currentPage, setCurrentPage] = useState(1);

  const { data, loading, error } = useQuery<{ getPerson: Person }>(GET_PERSON, {
    variables: { id: personId },
    skip: !personId || isNaN(personId),
    fetchPolicy: "cache-first",
  });

  const person = data?.getPerson;

  // Memoize movies array to prevent unnecessary re-renders
  const allMovies = useMemo(() => person?.movies || [], [person?.movies]);

  // Pagination calculations
  const totalPages = Math.ceil(allMovies.length / MOVIES_PER_PAGE);
  const startIndex = (currentPage - 1) * MOVIES_PER_PAGE;
  const endIndex = startIndex + MOVIES_PER_PAGE;
  const paginatedMovies = useMemo(
    () => allMovies.slice(startIndex, endIndex),
    [allMovies, startIndex, endIndex]
  );

  // Reset to page 1 when person changes
  useEffect(() => {
    setCurrentPage(1);
  }, [personId]);

  // Reset to page 1 if current page is out of bounds
  useEffect(() => {
    if (currentPage > totalPages && totalPages > 0) {
      setCurrentPage(1);
    }
  }, [totalPages, currentPage]);

  if (loading) {
    return <LoadingState message="Loading person..." />;
  }

  if (error) {
    return (
      <ErrorState
        message={error.message || "Failed to load person. Please try again."}
        onRetry={() => window.location.reload()}
      />
    );
  }

  if (!person) {
    return (
      <div className="min-h-screen bg-background px-4 py-16">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-2xl font-bold text-foreground mb-4">
            Person not found
          </h1>
          <Button asChild>
            <Link href="/">Go Home</Link>
          </Button>
        </div>
      </div>
    );
  }

  const formatDate = (dateString?: string | null) => {
    if (!dateString) return null;
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    } catch {
      return dateString;
    }
  };

  const formatAge = (birthday?: string | null) => {
    if (!birthday) return null;
    try {
      const birth = new Date(birthday);
      const today = new Date();
      let age = today.getFullYear() - birth.getFullYear();
      const monthDiff = today.getMonth() - birth.getMonth();
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
        age--;
      }
      return age;
    } catch {
      return null;
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

  const handlePreviousPage = () => {
    setCurrentPage((prev) => Math.max(1, prev - 1));
  };

  const handleNextPage = () => {
    setCurrentPage((prev) => Math.min(totalPages, prev + 1));
  };

  return (
    <div className="min-h-screen bg-background px-4 py-8 md:py-16">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Back Button */}
        <Button variant="ghost" asChild>
          <Link href="/">← Back</Link>
        </Button>

        {/* Main Person Info */}
        <CardContainer>
          <div className="flex flex-col md:flex-row gap-6">
            {/* Profile Image */}
            <div className="relative h-64 w-48 md:h-80 md:w-60 shrink-0 overflow-hidden rounded-lg bg-muted">
              {person.profileUrl ? (
                <Image
                  src={person.profileUrl}
                  alt={person.name}
                  fill
                  sizes="(max-width: 768px) 192px, 240px"
                  className="object-cover"
                  priority
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center">
                  <User className="h-24 w-24 text-muted-foreground" />
                </div>
              )}
            </div>

            {/* Person Details */}
            <div className="flex-1 space-y-4">
              <div>
                <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
                  {person.name}
                </h1>
                {person.knownForDepartment && (
                  <p className="text-lg text-muted-foreground">
                    {person.knownForDepartment}
                  </p>
                )}
              </div>

              {/* Info Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t">
                {person.birthday && (
                  <div className="flex items-start gap-2">
                    <Calendar className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-foreground">
                        {formatDate(person.birthday)}
                        {formatAge(person.birthday) && (
                          <span className="text-muted-foreground ml-1">
                            ({formatAge(person.birthday)} years old)
                          </span>
                        )}
                      </p>
                      <p className="text-xs text-muted-foreground">Birthday</p>
                    </div>
                  </div>
                )}

                {person.placeOfBirth && (
                  <div className="flex items-start gap-2">
                    <MapPin className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-foreground">
                        {person.placeOfBirth}
                      </p>
                      <p className="text-xs text-muted-foreground">Place of Birth</p>
                    </div>
                  </div>
                )}

                {person.popularity !== null && person.popularity !== undefined && (
                  <div className="flex items-start gap-2">
                    <TrendingUp className="h-5 w-5 text-muted-foreground shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-foreground">
                        {person.popularity.toFixed(1)}
                      </p>
                      <p className="text-xs text-muted-foreground">Popularity</p>
                    </div>
                  </div>
                )}
              </div>

              {/* TMDB Link */}
              <div className="pt-4 border-t">
                <Button variant="outline" asChild>
                  <a
                    href={`https://www.themoviedb.org/person/${person.id}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2"
                  >
                    <Film className="h-4 w-4" />
                    View on TMDB
                  </a>
                </Button>
              </div>
            </div>
          </div>
        </CardContainer>

        {/* Biography */}
        {person.biography && (
          <CardContainer>
            <div className="space-y-4">
              <SectionHeader icon={<User className="h-6 w-6" />}>
                Biography
              </SectionHeader>
              <p className="text-foreground leading-relaxed whitespace-pre-line">
                {person.biography}
              </p>
            </div>
          </CardContainer>
        )}

        {/* Movie Credits */}
        {allMovies.length > 0 && (
          <CardContainer>
            <div className="space-y-4">
              <SectionHeader icon={<Film className="h-6 w-6" />}>
                Movie Credits ({allMovies.length})
              </SectionHeader>
              
              {/* Pagination Controls */}
              {totalPages > 1 && (
                <div className="flex items-center justify-between pb-4 border-b">
                  <div className="text-sm text-muted-foreground">
                    Showing {startIndex + 1}-{Math.min(endIndex, allMovies.length)} of {allMovies.length} movies
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handlePreviousPage}
                      disabled={currentPage === 1}
                      className="gap-2"
                    >
                      <ChevronLeft className="h-4 w-4" />
                      Previous
                    </Button>
                    <div className="text-sm text-muted-foreground px-4">
                      Page {currentPage} of {totalPages}
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleNextPage}
                      disabled={currentPage === totalPages}
                      className="gap-2"
                    >
                      Next
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}
              
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {paginatedMovies.map((movie) => (
                  <Link
                    key={movie.id}
                    href={`/movie/${movie.id}`}
                    className="group flex flex-col space-y-2 transition-opacity hover:opacity-80"
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
                ))}
              </div>
            </div>
          </CardContainer>
        )}
      </div>
    </div>
  );
}

