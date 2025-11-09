"use client";

import { Button } from "@/components/ui/button";
import { Shuffle } from "lucide-react";
import { GenreFilter } from "@/components/shuffle/genre-filter";
import { YearRangeFilter } from "@/components/shuffle/year-range-filter";
import { CastFilter } from "@/components/shuffle/cast-filter";
import { CrewFilter } from "@/components/shuffle/crew-filter";
import { VoteAverageFilter } from "@/components/shuffle/vote-average-filter";
import { VoteCountFilter } from "@/components/shuffle/vote-count-filter";
import { RuntimeFilter } from "@/components/shuffle/runtime-filter";
import { LanguageFilter } from "@/components/shuffle/language-filter";
import { StreamingFilter } from "@/components/shuffle/streaming-filter";
import { ExcludeGenreFilter } from "@/components/shuffle/exclude-genre-filter";
import { ExcludeCastFilter } from "@/components/shuffle/exclude-cast-filter";
import { ExcludeCrewFilter } from "@/components/shuffle/exclude-crew-filter";
import { PopularityFilter } from "@/components/shuffle/popularity-filter";
import { CountryFilter } from "@/components/shuffle/country-filter";
import { CollectionFilter } from "@/components/shuffle/collection-filter";
import { ExcludeCollectionFilter } from "@/components/shuffle/exclude-collection-filter";
import { KeywordFilter } from "@/components/shuffle/keyword-filter";
import { LoadingState } from "@/components/shared/loading-state";
import { ErrorState } from "@/components/shared/error-state";
import { ShuffleMovieCard } from "@/components/shuffle/shuffle-movie-card";
import { NoResults } from "@/components/shuffle/no-results";
import { useShuffleMovie } from "@/hooks/use-shuffle-movie";

export default function ShufflePage() {
  const {
    selectedGenres,
    setSelectedGenres,
    yearRange,
    setYearRange,
    selectedCast,
    setSelectedCast,
    selectedCrew,
    setSelectedCrew,
    minVoteAverage,
    setMinVoteAverage,
    minVoteCount,
    setMinVoteCount,
    runtimeRange,
    setRuntimeRange,
    originalLanguage,
    setOriginalLanguage,
    selectedProviders,
    setSelectedProviders,
    excludeGenres,
    setExcludeGenres,
    excludeCast,
    setExcludeCast,
    excludeCrew,
    setExcludeCrew,
    popularityRange,
    setPopularityRange,
    originCountries,
    setOriginCountries,
    inCollections,
    setInCollections,
    excludeCollections,
    setExcludeCollections,
    notInAnyCollection,
    setNotInAnyCollection,
    selectedKeywords,
    setSelectedKeywords,
    handleShuffle,
    handleReset,
    movie,
    hasSearched,
    loading,
    error,
    MIN_YEAR,
    MAX_YEAR,
  } = useShuffleMovie();

  if (loading) {
    return (
      <LoadingState message="Shuffling..." submessage="Finding your movie..." />
    );
  }

  if (error) {
    return (
      <ErrorState
        message={error.message || "Failed to shuffle movie. Please try again."}
        onRetry={handleShuffle}
      />
    );
  }

  if (movie) {
    return (
      <div className="min-h-screen bg-background px-4 py-16">
        <main className="w-full max-w-4xl mx-auto space-y-4">
          <ShuffleMovieCard movie={movie} onShuffleAgain={handleShuffle} />
        </main>
      </div>
    );
  }

  // Handle no results case (backend returns null when no matches found)
  if (hasSearched && !loading && !error && !movie) {
    return (
      <div className="min-h-screen bg-background px-4 py-16">
        <main className="w-full max-w-4xl mx-auto">
          <NoResults onReset={handleReset} />
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-linear-to-b from-background via-background to-muted/20 px-4 py-16">
      <main className="w-full max-w-4xl mx-auto space-y-8">
        <div className="text-center space-y-4">
          <div className="flex items-center justify-center gap-3">
            <Shuffle className="h-8 w-8 text-primary" />
            <h1 className="text-5xl font-bold tracking-tight bg-linear-to-r from-primary via-primary/80 to-primary bg-clip-text text-transparent">
              Shuffle & Discover
            </h1>
            <Shuffle className="h-8 w-8 text-primary" />
          </div>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Set your preferences and discover a random movie that matches your criteria. All filters are optional!
          </p>
        </div>

        <div className="space-y-6 bg-card/50 backdrop-blur-sm border rounded-lg p-6 shadow-lg">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <GenreFilter
              selectedGenres={selectedGenres}
              onGenresChange={setSelectedGenres}
            />

            <ExcludeGenreFilter
              selectedGenres={excludeGenres}
              onGenresChange={setExcludeGenres}
            />

            <YearRangeFilter
              yearRange={yearRange}
              onYearRangeChange={setYearRange}
              minYear={MIN_YEAR}
              maxYear={MAX_YEAR}
            />

            <CastFilter
              selectedCast={selectedCast}
              onCastChange={setSelectedCast}
            />

            <ExcludeCastFilter
              selectedCast={excludeCast}
              onCastChange={setExcludeCast}
            />

            <CrewFilter
              selectedCrew={selectedCrew}
              onCrewChange={setSelectedCrew}
            />

            <ExcludeCrewFilter
              selectedCrew={excludeCrew}
              onCrewChange={setExcludeCrew}
            />

            <VoteAverageFilter
              minVoteAverage={minVoteAverage}
              onVoteAverageChange={setMinVoteAverage}
            />

            <VoteCountFilter
              minVoteCount={minVoteCount}
              onVoteCountChange={setMinVoteCount}
            />

            <PopularityFilter
              popularityRange={popularityRange}
              onPopularityRangeChange={setPopularityRange}
            />

            <RuntimeFilter
              runtimeRange={runtimeRange}
              onRuntimeRangeChange={setRuntimeRange}
            />

            <LanguageFilter
              language={originalLanguage}
              onLanguageChange={setOriginalLanguage}
            />

            <StreamingFilter
              selectedProviders={selectedProviders}
              onProvidersChange={setSelectedProviders}
            />

            <CountryFilter
              selectedCountries={originCountries}
              onCountriesChange={setOriginCountries}
            />

            <CollectionFilter
              selectedCollections={inCollections}
              onCollectionsChange={setInCollections}
            />

            <ExcludeCollectionFilter
              selectedCollections={excludeCollections}
              onCollectionsChange={setExcludeCollections}
            />

            <KeywordFilter
              selectedKeywords={selectedKeywords}
              onKeywordsChange={setSelectedKeywords}
            />
          </div>

          {/* Not in Any Collection Checkbox */}
          <div className="flex items-center space-x-2 pt-2 border-t">
            <input
              type="checkbox"
              id="notInAnyCollection"
              checked={notInAnyCollection}
              onChange={(e) => setNotInAnyCollection(e.target.checked)}
              className="h-4 w-4 rounded border-input bg-background text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 cursor-pointer"
            />
            <label
              htmlFor="notInAnyCollection"
              className="text-sm font-medium text-foreground cursor-pointer"
            >
              Only include movies not in any collection
            </label>
          </div>

          <div className="pt-4 flex gap-4">
            <Button 
              onClick={handleShuffle} 
              size="lg" 
              className="flex-1 bg-linear-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 shadow-lg shadow-primary/20"
            >
              <Shuffle className="mr-2 h-5 w-5" />
              Shuffle Movie
            </Button>
            <Button 
              onClick={handleReset} 
              size="lg" 
              variant="outline"
            >
              Reset Filters
            </Button>
          </div>
        </div>
      </main>
    </div>
  );
}
