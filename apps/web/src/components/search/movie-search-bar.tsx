"use client";

import { useState, useRef, useEffect, useCallback, useMemo } from "react";
import { useQuery } from "@apollo/client/react";
import { useRouter } from "next/navigation";
import { Search, X, Film, User } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { SEARCH_MOVIES, SEARCH_PEOPLE } from "@/lib/graphql";
import { useDebounce } from "@/hooks/use-debounce";
import Image from "next/image";

interface SearchMovie {
  id: number;
  title: string;
  posterUrl?: string | null;
  releaseDate?: string | null;
  voteAverage?: number | null;
  genres?: Array<{
    id: number;
    name: string;
  }>;
}

interface SearchPerson {
  id: number;
  name: string;
  profileUrl?: string | null;
  knownForDepartment?: string | null;
}

const MIN_QUERY_LENGTH = 2;
const DEBOUNCE_DELAY = 300;
const SEARCH_LIMIT = 5; // Reduced since we're showing both movies and people

export function MovieSearchBar() {
  const [query, setQuery] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const debouncedQuery = useDebounce(query, DEBOUNCE_DELAY);
  const router = useRouter();
  const searchRef = useRef<HTMLDivElement>(null);

  const shouldSearch = debouncedQuery.trim().length >= MIN_QUERY_LENGTH;

  const { data: moviesData, loading: moviesLoading, error: moviesError } = useQuery<{ searchMovies: SearchMovie[] }>(
    SEARCH_MOVIES,
    {
      variables: {
        query: debouncedQuery,
        limit: SEARCH_LIMIT,
      },
      skip: !shouldSearch,
      fetchPolicy: "cache-first",
    }
  );

  const { data: peopleData, loading: peopleLoading, error: peopleError } = useQuery<{ searchPeople: SearchPerson[] }>(
    SEARCH_PEOPLE,
    {
      variables: {
        query: debouncedQuery,
        limit: SEARCH_LIMIT,
      },
      skip: !shouldSearch,
      fetchPolicy: "cache-first",
    }
  );

  const movies = useMemo(() => moviesData?.searchMovies || [], [moviesData?.searchMovies]);
  const people = useMemo(() => peopleData?.searchPeople || [], [peopleData?.searchPeople]);
  const loading = moviesLoading || peopleLoading;
  const error = moviesError || peopleError;
  const hasResults = useMemo(() => movies.length > 0 || people.length > 0, [movies.length, people.length]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const handleMovieClick = useCallback((movieId: number) => {
    setQuery("");
    setIsOpen(false);
    router.push(`/movie/${movieId}`);
  }, [router]);

  const handlePersonClick = useCallback((personId: number) => {
    setQuery("");
    setIsOpen(false);
    router.push(`/person/${personId}`);
  }, [router]);

  const handleInputChange = useCallback((value: string) => {
    setQuery(value);
    setIsOpen(true);
  }, []);

  const handleClear = useCallback(() => {
    setQuery("");
    setIsOpen(false);
  }, []);

  const releaseYear = useCallback((date?: string | null) => {
    if (!date) return null;
    return new Date(date).getFullYear();
  }, []);

  return (
    <div ref={searchRef} className="relative w-full max-w-md">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          type="text"
          value={query}
          onChange={(e) => handleInputChange(e.target.value)}
          onFocus={() => setIsOpen(true)}
          placeholder="Search movies and people..."
          className="pl-9 pr-9 w-full"
        />
        {query && (
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7"
            onClick={handleClear}
            aria-label="Clear search"
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>

      {isOpen && shouldSearch && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-card border rounded-lg shadow-lg z-50 max-h-[400px] overflow-y-auto">
          {loading && (
            <div className="p-4 text-center text-sm text-muted-foreground">
              Searching...
            </div>
          )}

          {error && (
            <div className="p-4 text-center text-sm text-destructive">
              Error searching. Please try again.
            </div>
          )}

          {!loading && !error && !hasResults && (
            <div className="p-4 text-center text-sm text-muted-foreground">
              No results found
            </div>
          )}

          {!loading && !error && hasResults && (
            <div className="py-2">
              {/* Movies Section */}
              {movies.length > 0 && (
                <>
                  <div className="px-4 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    Movies
                  </div>
                  {movies.map((movie, index) => (
                    <button
                      key={movie.id}
                      onClick={() => handleMovieClick(movie.id)}
                      className="w-full px-4 py-3 hover:bg-accent transition-colors text-left flex items-center gap-3 group"
                    >
                      <div className="relative shrink-0 h-18 w-12 overflow-hidden rounded bg-muted">
                        {movie.posterUrl ? (
                          <Image
                            src={movie.posterUrl}
                            alt={movie.title}
                            fill
                            sizes="48px"
                            className="object-cover"
                            priority={index === 0}
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <Film className="h-6 w-6 text-muted-foreground" />
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-foreground group-hover:text-primary transition-colors truncate">
                          {movie.title}
                        </div>
                        <div className="text-xs text-muted-foreground flex items-center gap-2 mt-1">
                          {releaseYear(movie.releaseDate) && (
                            <span>{releaseYear(movie.releaseDate)}</span>
                          )}
                          {movie.voteAverage !== null && movie.voteAverage !== undefined && (
                            <>
                              {releaseYear(movie.releaseDate) && <span>•</span>}
                              <span>{movie.voteAverage.toFixed(1)}/10</span>
                            </>
                          )}
                          {movie.genres && movie.genres.length > 0 && (
                            <>
                              {(releaseYear(movie.releaseDate) || movie.voteAverage !== null) && (
                                <span>•</span>
                              )}
                              <span className="truncate">
                                {movie.genres.slice(0, 2).map((g) => g.name).join(", ")}
                              </span>
                            </>
                          )}
                        </div>
                      </div>
                    </button>
                  ))}
                </>
              )}

              {/* People Section */}
              {people.length > 0 && (
                <>
                  {movies.length > 0 && (
                    <div className="border-t my-1" />
                  )}
                  <div className="px-4 py-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                    People
                  </div>
                  {people.map((person, index) => (
                    <button
                      key={person.id}
                      onClick={() => handlePersonClick(person.id)}
                      className="w-full px-4 py-3 hover:bg-accent transition-colors text-left flex items-center gap-3 group"
                    >
                      <div className="relative shrink-0 h-12 w-12 overflow-hidden rounded-full bg-muted">
                        {person.profileUrl ? (
                          <Image
                            src={person.profileUrl}
                            alt={person.name}
                            fill
                            sizes="48px"
                            className="object-cover"
                            priority={index === 0 && movies.length === 0}
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center">
                            <User className="h-6 w-6 text-muted-foreground" />
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-foreground group-hover:text-primary transition-colors truncate">
                          {person.name}
                        </div>
                        {person.knownForDepartment && (
                          <div className="text-xs text-muted-foreground truncate mt-1">
                            {person.knownForDepartment}
                          </div>
                        )}
                      </div>
                    </button>
                  ))}
                </>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

