"use client";

import { useState, useMemo, useCallback, useEffect } from "react";
import { useLazyQuery } from "@apollo/client/react";
import { useApolloClient } from "@apollo/client/react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { SHUFFLE_MOVIE, SEARCH_PEOPLE } from "@/lib/graphql/queries";
import { Movie, Person } from "@/types/suggest";
import { MovieResultDisplay } from "@/components/suggest/movie-result";
import { GENRES } from "@/lib/tmdb-options";
import { Check, ChevronsUpDown, X } from "lucide-react";
import { cn } from "@/lib/utils";

const MIN_YEAR = 1950;
const MAX_YEAR = new Date().getFullYear();

export default function ShufflePage() {
  const [selectedGenres, setSelectedGenres] = useState<string[]>([]);
  const [yearRange, setYearRange] = useState<number[]>([MIN_YEAR, MAX_YEAR]);
  const [castSearchQuery, setCastSearchQuery] = useState("");
  const [castSearchResults, setCastSearchResults] = useState<Person[]>([]);
  const [selectedCast, setSelectedCast] = useState<Person[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  const apolloClient = useApolloClient();

  // Debounced search for cast members
  useEffect(() => {
    if (castSearchQuery.trim().length < 2) {
      setCastSearchResults([]);
      return;
    }

    const timeoutId = setTimeout(async () => {
      setIsSearching(true);
      try {
        const result = await apolloClient.query<{ searchPeople: Person[] }>({
          query: SEARCH_PEOPLE,
          variables: { query: castSearchQuery },
          fetchPolicy: "network-only",
        });

        if (result.data?.searchPeople) {
          // Filter out already selected cast members
          const selectedIds = new Set(selectedCast.map((c) => c.id));
          const filtered = result.data.searchPeople.filter(
            (person) => !selectedIds.has(person.id)
          );
          setCastSearchResults(filtered);
        }
      } catch (error) {
        console.error("Error searching people:", error);
        setCastSearchResults([]);
      } finally {
        setIsSearching(false);
      }
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [castSearchQuery, apolloClient, selectedCast]);

  // Shuffle movie query
  const [shuffleMovie, { data, loading, error }] = useLazyQuery<{
    shuffleMovie: Movie;
  }>(SHUFFLE_MOVIE, {
    fetchPolicy: "network-only",
  });

  const handleShuffle = useCallback(() => {
    const genres = selectedGenres.length > 0 ? selectedGenres : undefined;
    const years = yearRange[0] !== MIN_YEAR || yearRange[1] !== MAX_YEAR
      ? Array.from(
          { length: yearRange[1] - yearRange[0] + 1 },
          (_, i) => yearRange[0] + i
        )
      : undefined;
    const cast =
      selectedCast.length > 0
        ? selectedCast.map((person) => person.id)
        : undefined;

    shuffleMovie({
      variables: {
        genres,
        yearRange: years,
        cast,
      },
    });
  }, [selectedGenres, yearRange, selectedCast, shuffleMovie]);

  const toggleGenre = (genreId: string) => {
    setSelectedGenres((prev) =>
      prev.includes(genreId)
        ? prev.filter((id) => id !== genreId)
        : [...prev, genreId]
    );
  };

  const addCastMember = (person: Person) => {
    if (!selectedCast.find((p) => p.id === person.id)) {
      setSelectedCast((prev) => [...prev, person]);
      setCastSearchQuery("");
      setCastSearchResults([]);
      setIsOpen(false);
    }
  };

  const removeCastMember = (personId: number) => {
    setSelectedCast((prev) => prev.filter((p) => p.id !== personId));
  };

  const selectedGenreLabels = useMemo(() => {
    return selectedGenres
      .map((id) => GENRES.find((g) => g.id === id)?.label)
      .filter(Boolean);
  }, [selectedGenres]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4 py-16">
      <main className="w-full max-w-4xl space-y-8">
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold tracking-tight text-foreground">
            Shuffle Mode
          </h1>
          <p className="text-lg text-muted-foreground">
            Filter by genre, year range, and cast before randomizing. Get a
            random movie selection based on your preferences.
          </p>
        </div>

        {data?.shuffleMovie ? (
          <div className="space-y-4">
            <div className="flex justify-center">
              <Button
                variant="outline"
                onClick={() => {
                  // Shuffle again with same filters
                  handleShuffle();
                }}
              >
                Shuffle Again
              </Button>
            </div>
            <MovieResultDisplay movie={data.shuffleMovie} />
          </div>
        ) : (
          <div className="space-y-6 bg-card border rounded-lg p-6">
            {/* Genre Filter */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">
                Genres
              </label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    className="w-full justify-between"
                  >
                    {selectedGenres.length > 0
                      ? `${selectedGenres.length} genre(s) selected`
                      : "Select genres..."}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-full p-0" align="start">
                  <Command>
                    <CommandInput placeholder="Search genres..." />
                    <CommandList>
                      <CommandEmpty>No genres found.</CommandEmpty>
                      <CommandGroup>
                        {GENRES.map((genre) => (
                          <CommandItem
                            key={genre.id}
                            value={genre.label}
                            onSelect={() => toggleGenre(genre.id)}
                          >
                            <Check
                              className={cn(
                                "mr-2 h-4 w-4",
                                selectedGenres.includes(genre.id)
                                  ? "opacity-100"
                                  : "opacity-0"
                              )}
                            />
                            {genre.label}
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
              {selectedGenreLabels.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {selectedGenreLabels.map((label, idx) => (
                    <div
                      key={selectedGenres[idx]}
                      className="inline-flex items-center gap-1 px-2 py-1 bg-secondary text-secondary-foreground rounded-md text-sm"
                    >
                      {label}
                      <button
                        onClick={() => toggleGenre(selectedGenres[idx])}
                        className="ml-1 hover:opacity-70"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Year Range Slider */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">
                Release Year Range: {yearRange[0]} - {yearRange[1]}
              </label>
              <Slider
                value={yearRange}
                onValueChange={setYearRange}
                min={MIN_YEAR}
                max={MAX_YEAR}
                step={1}
                className="w-full"
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>{MIN_YEAR}</span>
                <span>{MAX_YEAR}</span>
              </div>
            </div>

            {/* Cast Member Search */}
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">
                Cast Members
              </label>
              <Popover open={isOpen} onOpenChange={setIsOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    className="w-full justify-between"
                  >
                    {selectedCast.length > 0
                      ? `${selectedCast.length} cast member(s) selected`
                      : "Search and add cast members..."}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-full p-0" align="start">
                  <Command>
                    <CommandInput
                      placeholder="Search cast members..."
                      value={castSearchQuery}
                      onValueChange={setCastSearchQuery}
                    />
                    <CommandList>
                      {isSearching ? (
                        <CommandEmpty>Searching...</CommandEmpty>
                      ) : castSearchResults.length === 0 ? (
                        <CommandEmpty>
                          {castSearchQuery.trim().length < 2
                            ? "Type at least 2 characters to search"
                            : "No cast members found."}
                        </CommandEmpty>
                      ) : (
                        <CommandGroup>
                          {castSearchResults.map((person) => (
                            <CommandItem
                              key={person.id}
                              value={person.name}
                              onSelect={() => addCastMember(person)}
                            >
                              {person.name}
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      )}
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
              {selectedCast.length > 0 && (
                <div className="flex flex-wrap gap-2 mt-2">
                  {selectedCast.map((person) => (
                    <div
                      key={person.id}
                      className="inline-flex items-center gap-1 px-2 py-1 bg-secondary text-secondary-foreground rounded-md text-sm"
                    >
                      {person.name}
                      <button
                        onClick={() => removeCastMember(person.id)}
                        className="ml-1 hover:opacity-70"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Shuffle Button */}
            <div className="pt-4">
              <Button
                onClick={handleShuffle}
                disabled={loading}
                size="lg"
                className="w-full"
              >
                {loading ? "Shuffling..." : "Shuffle Movie"}
              </Button>
            </div>

            {/* Error Display */}
            {error && (
              <div className="p-4 bg-destructive/10 border border-destructive rounded-md">
                <p className="text-sm text-destructive">
                  {error.message || "Failed to shuffle movie. Please try again."}
                </p>
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
