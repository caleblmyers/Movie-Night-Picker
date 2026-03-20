import { Context } from "../context";
import { Movie } from "../types";
import {
  GetMovieArgs,
  SearchMoviesArgs,
  SearchKeywordsArgs,
  DiscoverMoviesArgs,
  SuggestMovieArgs,
  SuggestMovieRoundArgs,
  SuggestMovieRoundResult,
  ShuffleMovieArgs,
  RandomMovieArgs,
  TrendingMoviesArgs,
  NowPlayingMoviesArgs,
  PopularMoviesArgs,
  TopRatedMoviesArgs,
  UpcomingMoviesArgs,
  RandomMovieFromSourceArgs,
  ActorsFromFeaturedMoviesArgs,
  CrewFromFeaturedMoviesArgs,
  MoviePreferencesInput,
} from "../types/resolvers";
import { transformTMDBMovie } from "../utils/transformers";
import type { TMDBMovieResponse } from "../utils/transformers";
import { handleError } from "../utils/errorHandler";
import {
  buildDiscoverParams,
  shouldTryFallback,
  pickRandomItem,
  buildProgressiveFallbackParams,
  DiscoverFilters,
} from "../utils/discoverHelpers";
import {
  getMovieIdsFromCollections,
  getAllMovieIdsInCollections,
  filterMoviesByCollections,
  getCollectionAnalysisForFiltering,
} from "../utils/collectionHelpers";
import {
  getSuggestHistory,
  addToSuggestHistory,
} from "../utils/dbHelpers";
import {
  MOVIE_VIBES,
  ERA_OPTIONS,
  MOVIE_VIBE_ICONS,
  ERA_OPTION_ICONS,
  GENRE_ICONS,
  getPopularityRange,
  MOOD_TO_KEYWORDS,
  getEraYearRange,
  SUGGEST_MOVIE_ROUNDS,
} from "../constants";
import { convertGraphQLOptionsToTMDBOptions } from "../utils/tmdbOptionsConverter";

/**
 * Extract and aggregate categories from selected movies
 * Returns simplified preferences that are less restrictive for better discovery
 */
async function extractCategoriesFromMovies(
  movieIds: number[],
  context: Context
): Promise<MoviePreferencesInput> {
  const preferences: MoviePreferencesInput = {
    genres: [],
    keywordIds: [],
    actors: [],
    crew: [],
    yearRange: undefined,
  };

  const years: number[] = [];
  const genreCounts = new Map<number, number>();
  const keywordCounts = new Map<number, number>();
  const actorCounts = new Map<number, number>();
  const crewCounts = new Map<number, number>();

  // Fetch all selected movies in parallel (with credits for actors/crew)
  const moviePromises = movieIds.map((id) =>
    context.tmdb.getMovie(id, undefined, true).catch(() => null)
  );
  const movies = await Promise.all(moviePromises);

  // Fetch keywords for all movies in parallel
  const keywordPromises = movieIds.map((id) =>
    context.tmdb.getMovieKeywords(id).catch(() => ({ keywords: [] }))
  );
  const keywordResults = await Promise.all(keywordPromises);

  // Extract categories from each movie and count frequencies
  for (let i = 0; i < movies.length; i++) {
    const movie = movies[i];
    if (!movie) continue;

    const movieData = movie as {
      genres?: Array<{ id: number; name: string }>;
      release_date?: string;
      credits?: {
        cast?: Array<{ id: number; name: string }>;
        crew?: Array<{ id: number; name: string; job?: string }>;
      };
    };

    // Count genre frequencies
    if (movieData.genres) {
      movieData.genres.forEach((genre) => {
        genreCounts.set(genre.id, (genreCounts.get(genre.id) || 0) + 1);
      });
    }

    // Count keyword frequencies
    const keywordData = keywordResults[i];
    if (keywordData?.keywords) {
      keywordData.keywords.forEach((keyword: { id: number; name: string }) => {
        keywordCounts.set(keyword.id, (keywordCounts.get(keyword.id) || 0) + 1);
      });
    }

    // Extract release year
    if (movieData.release_date) {
      const year = parseInt(movieData.release_date.substring(0, 4), 10);
      if (!isNaN(year)) {
        years.push(year);
      }
    }

    // Count actor frequencies (top 3 actors per movie)
    if (movieData.credits?.cast) {
      movieData.credits.cast.slice(0, 3).forEach((actor) => {
        actorCounts.set(actor.id, (actorCounts.get(actor.id) || 0) + 1);
      });
    }

    // Count crew frequencies (directors and writers only)
    if (movieData.credits?.crew) {
      movieData.credits.crew
        .filter((member) => {
          const job = member.job?.toLowerCase() || "";
          return job.includes("director") || job.includes("writer") || job.includes("screenplay");
        })
        .slice(0, 2)
        .forEach((member) => {
          crewCounts.set(member.id, (crewCounts.get(member.id) || 0) + 1);
        });
    }
  }

  // Confidence threshold: a feature must appear in at least 25% of selected movies.
  // For very small selections (≤3), require at least 1 appearance.
  const totalMovies = movies.filter((m) => m !== null).length;
  const minCount = totalMovies <= 3 ? 1 : Math.ceil(totalMovies * 0.25);

  // Select top genres above confidence threshold (guarantee at least 1 if any exist)
  const allSortedGenres = Array.from(genreCounts.entries()).sort((a, b) => b[1] - a[1]);
  const confidentGenres = allSortedGenres.filter(([, count]) => count >= minCount).slice(0, 3).map(([id]) => id);
  // Always include the top genre even if it doesn't meet the threshold
  if (confidentGenres.length === 0 && allSortedGenres.length > 0) {
    confidentGenres.push(allSortedGenres[0][0]);
  }
  preferences.genres = confidentGenres;

  // Select top keywords above confidence threshold
  const allSortedKeywords = Array.from(keywordCounts.entries()).sort((a, b) => b[1] - a[1]);
  const confidentKeywords = allSortedKeywords.filter(([, count]) => count >= minCount).slice(0, 5).map(([id]) => id);
  preferences.keywordIds = confidentKeywords;

  // Select top actors (most common, limit to 2)
  const sortedActors = Array.from(actorCounts.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 2)
    .map(([id]) => id);
  preferences.actors = sortedActors.length > 0 ? sortedActors : [];

  // Select top crew (most common, limit to 2)
  const sortedCrew = Array.from(crewCounts.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 2)
    .map(([id]) => id);
  preferences.crew = sortedCrew.length > 0 ? sortedCrew : [];

  // Calculate flexible year range (expand by 5 years on each side for more variety)
  if (years.length > 0) {
    const minYear = Math.min(...years);
    const maxYear = Math.max(...years);
    const yearSpan = maxYear - minYear;
    // Expand range: add 5 years on each side, or 50% of span (whichever is larger)
    const expansion = Math.max(5, Math.floor(yearSpan * 0.5));
    const expandedMin = Math.max(1900, minYear - expansion); // Don't go before 1900
    const expandedMax = Math.min(new Date().getFullYear(), maxYear + expansion); // Don't go past current year
    preferences.yearRange = [expandedMin, expandedMax];
  }

  return preferences;
}

type RoundCategory = "genre" | "era" | "mood" | "popularity" | "mixed";

interface SlotDefinition {
  genres?: number[];
  yearRange?: [number, number];
  keywordIds?: number[];
  popularityRange?: [number, number];
  voteAverageGte?: number; // slot-specific override
  voteCountGte?: number;   // slot-specific override
}

interface CategoryRoundDef {
  category: RoundCategory;
  categoryLabel: string;
  defaultVoteAverageGte: number;
  defaultVoteCountGte: number;
  defaultSortBy: string;
  slots: SlotDefinition[];
}

/**
 * Generate a category-based round definition.
 * Each round explores ONE preference dimension — all 4 slots are comparable on that axis,
 * so the user's selection conveys a clear signal about their preferences.
 *
 * Round cycle (10 rounds):
 *   1: genre  2: era   3: mood  4: popularity
 *   5: genre  6: era   7: mood  8: popularity
 *   9: genre  10: mixed (adapts to anchorGenre if provided)
 */
function generateCategoryRound(round: number, anchorGenre?: number): CategoryRoundDef {
  const currentYear = new Date().getFullYear();

  const roundTypes: RoundCategory[] = [
    "genre",      // 1
    "era",        // 2
    "mood",       // 3
    "popularity", // 4
    "genre",      // 5
    "era",        // 6
    "mood",       // 7
    "popularity", // 8
    "genre",      // 9
    "mixed",      // 10
  ];

  const category = roundTypes[round - 1];

  // Genre sets: each genre round uses a distinct set of 4 popular genres
  const genreSets: number[][] = [
    [28, 18, 35, 878],    // Round 1: Action, Drama, Comedy, Sci-Fi
    [53, 27, 10749, 16],  // Round 5: Thriller, Horror, Romance, Animation
    [80, 12, 14, 36],     // Round 9: Crime, Adventure, Fantasy, History
  ];

  // Fixed anchor genres for era/mood/popularity rounds
  // Rounds 2,3,4 anchor on Drama (18); rounds 6,7,8 anchor on Action (28)
  const defaultAnchorByRound: Record<number, number> = {
    2: 18, 3: 18, 4: 18,
    6: 28, 7: 28, 8: 28,
  };

  // 4 concrete eras for era rounds
  const eraSlots: Array<{ yearRange: [number, number] }> = [
    { yearRange: [1900, 1979] },
    { yearRange: [1980, 1999] },
    { yearRange: [2000, 2014] },
    { yearRange: [2015, currentYear] },
  ];

  // Two mood sets — alternated across mood rounds (3 and 7)
  const moodSets: string[][] = [
    ["dark", "uplifting", "adventurous", "thought-provoking"],
    ["mysterious", "feel-good", "fast-paced", "slow-burn"],
  ];

  // 4 popularity tiers (blockbuster → cult classic)
  const popularityTiers: SlotDefinition[] = [
    { popularityRange: [100, 10000], voteCountGte: 500 },
    { popularityRange: [30, 100],    voteCountGte: 200 },
    { popularityRange: [5, 30],      voteCountGte: 100 },
    { popularityRange: [0, 5],       voteAverageGte: 7.5, voteCountGte: 50 },
  ];

  switch (category) {
    case "genre": {
      const setIndex = [1, 5, 9].indexOf(round);
      const genres = genreSets[setIndex >= 0 ? setIndex : 0];
      return {
        category: "genre",
        categoryLabel: "Pick a Genre",
        defaultVoteAverageGte: 6.5,
        defaultVoteCountGte: 300,
        defaultSortBy: "popularity.desc",
        slots: genres.map((genreId) => ({
          genres: [genreId],
          yearRange: [1990, currentYear],
        })),
      };
    }

    case "era": {
      const genre = anchorGenre ?? defaultAnchorByRound[round] ?? 18;
      return {
        category: "era",
        categoryLabel: "Pick an Era",
        defaultVoteAverageGte: 6.5,
        defaultVoteCountGte: 150,
        defaultSortBy: "vote_average.desc",
        slots: eraSlots.map((era) => ({
          genres: [genre],
          yearRange: era.yearRange,
        })),
      };
    }

    case "mood": {
      const genre = anchorGenre ?? defaultAnchorByRound[round] ?? 18;
      const moodSet = round <= 5 ? moodSets[0] : moodSets[1];
      return {
        category: "mood",
        categoryLabel: "Pick a Vibe",
        defaultVoteAverageGte: 6.5,
        defaultVoteCountGte: 150,
        defaultSortBy: "vote_average.desc",
        slots: moodSet.map((moodId) => ({
          genres: [genre],
          keywordIds: (MOOD_TO_KEYWORDS[moodId] || []).slice(0, 2),
        })),
      };
    }

    case "popularity": {
      const genre = anchorGenre ?? defaultAnchorByRound[round] ?? 18;
      return {
        category: "popularity",
        categoryLabel: "Pick a Style",
        defaultVoteAverageGte: 6.0,
        defaultVoteCountGte: 50,
        defaultSortBy: "popularity.desc",
        slots: popularityTiers.map((tier) => ({
          genres: [genre],
          ...tier,
        })),
      };
    }

    case "mixed":
    default: {
      // Round 10: if a top genre was inferred from prior selections, show 4 eras of that genre
      if (anchorGenre) {
        return {
          category: "mixed",
          categoryLabel: "Your Top Picks",
          defaultVoteAverageGte: 7.0,
          defaultVoteCountGte: 200,
          defaultSortBy: "vote_average.desc",
          slots: eraSlots.map((era) => ({
            genres: [anchorGenre],
            yearRange: era.yearRange,
          })),
        };
      }
      // No prior selections: present 4 acclaimed films across varied genre+era combos
      return {
        category: "mixed",
        categoryLabel: "Your Top Picks",
        defaultVoteAverageGte: 7.0,
        defaultVoteCountGte: 200,
        defaultSortBy: "vote_average.desc",
        slots: [
          { genres: [28], yearRange: [2010, currentYear] },
          { genres: [18], yearRange: [2000, 2014] },
          { genres: [878], yearRange: [2010, currentYear] },
          { genres: [53], yearRange: [2000, 2014] },
        ],
      };
    }
  }
}

/**
 * Infer the most-represented genre from a list of movie IDs by fetching their genre data.
 * Returns the top genre ID, or undefined if none can be determined.
 */
async function inferTopGenre(movieIds: number[], context: Context): Promise<number | undefined> {
  const genreCounts = new Map<number, number>();
  const movies = await Promise.all(
    movieIds.map((id) => context.tmdb.getMovie(id, undefined, false).catch(() => null))
  );
  for (const movie of movies) {
    if (!movie) continue;
    const data = movie as { genres?: Array<{ id: number }> };
    data.genres?.forEach((g) => {
      genreCounts.set(g.id, (genreCounts.get(g.id) || 0) + 1);
    });
  }
  if (genreCounts.size === 0) return undefined;
  return Array.from(genreCounts.entries()).sort((a, b) => b[1] - a[1])[0][0];
}

export const movieResolvers = {
  Query: {
    getMovie: async (
      _parent: unknown,
      args: GetMovieArgs,
      context: Context
    ): Promise<Movie> => {
      try {
        const options = convertGraphQLOptionsToTMDBOptions(args.options);
        // Always include credits for detail page
        const tmdbMovie = await context.tmdb.getMovie(args.id, options, true);
        return transformTMDBMovie(tmdbMovie as TMDBMovieResponse);
      } catch (error) {
        throw handleError(error, "Failed to fetch movie");
      }
    },

    searchMovies: async (
      _parent: unknown,
      args: SearchMoviesArgs,
      context: Context
    ): Promise<Movie[]> => {
      try {
        // Validate and set limit (default: 20, max: 100)
        const limit = args.limit
          ? Math.min(Math.max(1, args.limit), 100)
          : 20;

        const options = convertGraphQLOptionsToTMDBOptions(args.options);
        let tmdbMovies = await context.tmdb.searchMovies(
          args.query,
          limit * 2, // Fetch more to account for filtering
          options
        );

        // Filter by popularity level if provided
        if (args.popularityLevel) {
          const [minPopularity, maxPopularity] = getPopularityRange(args.popularityLevel);
          tmdbMovies = (tmdbMovies as Array<{ popularity?: number }>).filter((movie) => {
            const popularity = movie.popularity ?? 0;
            return popularity >= minPopularity && popularity <= maxPopularity;
          });
        }

        // Apply collection filtering if provided
        const user = context.user;
        let inCollectionIds: Set<number> | null = null;
        let excludeCollectionIds: Set<number> | null = null;
        let allCollectionMovieIds: Set<number> | null = null;

        if (user) {
          if (args.inCollections && args.inCollections.length > 0) {
            const movieIds = await getMovieIdsFromCollections(
              context.prisma,
              user.id,
              args.inCollections
            );
            inCollectionIds = new Set(movieIds);
          }

          if (args.excludeCollections && args.excludeCollections.length > 0) {
            const movieIds = await getMovieIdsFromCollections(
              context.prisma,
              user.id,
              args.excludeCollections
            );
            excludeCollectionIds = new Set(movieIds);
          }

          if (args.notInAnyCollection) {
            const movieIds = await getAllMovieIdsInCollections(
              context.prisma,
              user.id
            );
            allCollectionMovieIds = new Set(movieIds);
          }
        }

        // Apply collection filtering
        if (inCollectionIds || excludeCollectionIds || args.notInAnyCollection) {
          tmdbMovies = filterMoviesByCollections(
            tmdbMovies as Array<{ id: number }>,
            inCollectionIds,
            excludeCollectionIds,
            args.notInAnyCollection || false,
            allCollectionMovieIds
          );
        }

        // Apply final limit after filtering
        const finalResults = tmdbMovies.slice(0, limit);
        return finalResults.map((m) =>
          transformTMDBMovie(m as TMDBMovieResponse)
        );
      } catch (error) {
        throw handleError(error, "Failed to search movies");
      }
    },

    searchKeywords: async (
      _parent: unknown,
      args: SearchKeywordsArgs,
      context: Context
    ) => {
      try {
        // Validate and set limit (default: 20, max: 100)
        const limit = args.limit
          ? Math.min(Math.max(1, args.limit), 100)
          : 20;

        const keywords = await context.tmdb.searchKeywords(args.query, limit);
        return keywords.map((k) => ({
          id: k.id,
          name: k.name,
        }));
      } catch (error) {
        throw handleError(error, "Failed to search keywords");
      }
    },

    discoverMovies: async (
      _parent: unknown,
      args: DiscoverMoviesArgs,
      context: Context
    ): Promise<Movie[]> => {
      try {
        // Get collection analysis if requested
        let collectionAnalysis: {
          genres?: number[];
          keywords?: number[];
          actors?: number[];
          crew?: number[];
          yearRange?: number[];
        } = {};

        if (args.filterByCollectionAnalysis && context.user) {
          collectionAnalysis = await getCollectionAnalysisForFiltering(
            args.filterByCollectionAnalysis,
            context,
            10
          );
        }

        // Filter cast to only actors (merge with collection analysis)
        const allActorIds = [
          ...(args.cast || []),
          ...(collectionAnalysis.actors || []),
        ];
        const actorIds = allActorIds.length > 0
          ? await context.tmdb.filterToActorsOnly(allActorIds)
          : undefined;

        // Filter crew to only directors/writers (merge with collection analysis)
        const allCrewIds = [
          ...(args.crew || []),
          ...(collectionAnalysis.crew || []),
        ];
        const crewIds = allCrewIds.length > 0
          ? await context.tmdb.filterToCrewOnly(allCrewIds)
          : undefined;

        // Merge collection analysis with explicit filters (explicit filters take precedence)
        const discoverParams = buildDiscoverParams({
          genres: args.genres || collectionAnalysis.genres,
          yearRange: args.yearRange || collectionAnalysis.yearRange,
          cast: actorIds,
          actors: actorIds,
          crew: crewIds,
          runtimeRange: args.runtimeRange,
          watchProviders: args.watchProviders,
          excludeGenres: args.excludeGenres,
          excludeCast: args.excludeCast,
          excludeCrew: args.excludeCrew,
          popularityRange: args.popularityRange,
          popularityLevel: args.popularityLevel,
          originCountries: args.originCountries,
          keywords: args.keywordIds || collectionAnalysis.keywords,
        });
        
        // Build options with popularity range if provided (from range or level)
        const popularityRange = args.popularityRange || 
          (args.popularityLevel ? getPopularityRange(args.popularityLevel) : undefined);
        const options = convertGraphQLOptionsToTMDBOptions({
          ...args.options,
          popularityGte: popularityRange?.[0],
          popularityLte: popularityRange?.[1],
        });
        
        let tmdbMovies = await context.tmdb.discoverMovies(
          discoverParams,
          options
        );

        // Apply collection filtering if provided
        const user = context.user;
        let inCollectionIds: Set<number> | null = null;
        let excludeCollectionIds: Set<number> | null = null;
        let allCollectionMovieIds: Set<number> | null = null;

        if (user) {
          if (args.inCollections && args.inCollections.length > 0) {
            const movieIds = await getMovieIdsFromCollections(
              context.prisma,
              user.id,
              args.inCollections
            );
            inCollectionIds = new Set(movieIds);
          }

          if (args.excludeCollections && args.excludeCollections.length > 0) {
            const movieIds = await getMovieIdsFromCollections(
              context.prisma,
              user.id,
              args.excludeCollections
            );
            excludeCollectionIds = new Set(movieIds);
          }

          if (args.notInAnyCollection) {
            const movieIds = await getAllMovieIdsInCollections(
              context.prisma,
              user.id
            );
            allCollectionMovieIds = new Set(movieIds);
          }
        }

        // Apply collection filtering
        if (inCollectionIds || excludeCollectionIds || args.notInAnyCollection) {
          tmdbMovies = filterMoviesByCollections(
            tmdbMovies as Array<{ id: number }>,
            inCollectionIds,
            excludeCollectionIds,
            args.notInAnyCollection || false,
            allCollectionMovieIds
          );
        }

        return tmdbMovies.map((m) =>
          transformTMDBMovie(m as TMDBMovieResponse)
        );
      } catch (error) {
        throw handleError(error, "Failed to discover movies");
      }
    },

    suggestMovie: async (
      _parent: unknown,
      args: SuggestMovieArgs,
      context: Context
    ): Promise<Movie> => {
      try {
        // Validate that movie IDs are provided
        if (!args.selectedMovieIds || args.selectedMovieIds.length === 0) {
          throw new Error("At least one movie ID must be provided");
        }

        // Get suggest history to exclude from results
        const historyIds = context.user
          ? await getSuggestHistory(context.prisma, context.user.id)
          : [];
        const historySet = new Set(historyIds);
        
        // Exclude selected movies from results
        const selectedMovieIdsSet = new Set(args.selectedMovieIds);

        // Extract categories from selected movies (confidence-weighted)
        const prefs = await extractCategoriesFromMovies(
          args.selectedMovieIds,
          context
        );

        // Quality-sorted options: prefer well-rated films and sort by rating
        const discoverOptions = convertGraphQLOptionsToTMDBOptions({
          voteAverageGte: 6.5,
          voteCountGte: 150,
          sortBy: "vote_average.desc",
        });

        let tmdbMovies: unknown[] = [];

        // Focused strategies — only fall back when the previous one truly yields nothing
        const queryStrategies: Array<() => DiscoverFilters | null> = [
          // Strategy 1: Top confident genres + year range
          () => {
            const genres = prefs.genres && prefs.genres.length > 0 ? prefs.genres.slice(0, 2) : null;
            if (!genres) return null;
            return { genres, yearRange: prefs.yearRange };
          },
          // Strategy 2: Top genre + top confident keywords
          () => {
            const genre = prefs.genres?.[0];
            const keywords = prefs.keywordIds && prefs.keywordIds.length > 0 ? prefs.keywordIds.slice(0, 3) : null;
            if (!genre || !keywords) return null;
            return { genres: [genre], keywordIds: keywords };
          },
          // Strategy 3: Top genre + year range
          () => {
            const genre = prefs.genres?.[0];
            if (!genre) return null;
            return { genres: [genre], yearRange: prefs.yearRange };
          },
          // Strategy 4: Top genres only
          () => {
            const genres = prefs.genres && prefs.genres.length > 0 ? prefs.genres.slice(0, 2) : null;
            if (!genres) return null;
            return { genres };
          },
          // Strategy 5: Year range only (last targeted fallback)
          () => {
            if (!prefs.yearRange) return null;
            return { yearRange: prefs.yearRange };
          },
        ];

        for (const strategyFn of queryStrategies) {
          if (tmdbMovies.length > 0) break;
          const filters = strategyFn();
          if (!filters || Object.keys(filters).length === 0) continue;
          const discoverParams = buildDiscoverParams(filters, false);
          const discovered = await context.tmdb.discoverMovies(discoverParams, discoverOptions);
          tmdbMovies = (discovered as Array<{ id: number }>).filter(
            (movie) => !historySet.has(movie.id) && !selectedMovieIdsSet.has(movie.id)
          );
        }

        // Final fallback: random popular movie (only if all targeted strategies exhausted)
        if (tmdbMovies.length === 0) {
          let randomMovie: { id: number } | null = null;
          const fallbackOptions = convertGraphQLOptionsToTMDBOptions({
            voteAverageGte: 6.0,
            voteCountGte: 100,
            sortBy: "popularity.desc",
          });
          for (let retries = 0; retries < 20 && !randomMovie; retries++) {
            const candidate = await context.tmdb.getRandomMovieFromSource(
              "popular",
              undefined,
              fallbackOptions
            ) as { id: number };
            if (!historySet.has(candidate.id) && !selectedMovieIdsSet.has(candidate.id)) {
              randomMovie = candidate;
            }
          }
          // If every candidate was excluded, allow history movies (still exclude selected)
          if (!randomMovie) {
            for (let retries = 0; retries < 10 && !randomMovie; retries++) {
              const candidate = await context.tmdb.getRandomMovieFromSource(
                "popular",
                undefined,
                fallbackOptions
              ) as { id: number };
              if (!selectedMovieIdsSet.has(candidate.id)) {
                randomMovie = candidate;
              }
            }
          }
          if (!randomMovie) {
            randomMovie = await context.tmdb.getRandomMovieFromSource(
              "popular",
              undefined,
              fallbackOptions
            ) as { id: number };
          }
          const fullMovie = await context.tmdb.getMovie(randomMovie.id, fallbackOptions);
          const result = transformTMDBMovie(fullMovie as TMDBMovieResponse);
          if (context.user) {
            await addToSuggestHistory(context.prisma, context.user.id, result.id);
          }
          return result;
        }

        // Pick randomly from the top-5 quality-sorted results
        const topCandidates = tmdbMovies.slice(0, 5);
        const selectedMovie = pickRandomItem(topCandidates) as { id: number };

        // Fetch full movie details including videos/trailer
        const fullMovie = await context.tmdb.getMovie(selectedMovie.id, discoverOptions);
        const result = transformTMDBMovie(fullMovie as TMDBMovieResponse);
        
        // Save to suggest history if user is authenticated
        if (context.user) {
          await addToSuggestHistory(context.prisma, context.user.id, result.id);
        }
        
        return result;
      } catch (error) {
        throw handleError(error, "Failed to suggest movie");
      }
    },

    suggestMovieRound: async (
      _parent: unknown,
      args: SuggestMovieRoundArgs,
      context: Context
    ): Promise<SuggestMovieRoundResult> => {
      try {
        const { round } = args;

        if (round < 1 || round > SUGGEST_MOVIE_ROUNDS) {
          throw new Error(`Round must be between 1 and ${SUGGEST_MOVIE_ROUNDS}`);
        }

        const historyIds = context.user
          ? await getSuggestHistory(context.prisma, context.user.id)
          : [];
        const historySet = new Set(historyIds);

        // Movies the user already picked in prior rounds must never reappear
        const selectedSet = new Set<number>(args.selectedMovieIds ?? []);

        // For round 10 (mixed), infer top genre from prior selections if available
        let anchorGenre: number | undefined;
        if (round === 10 && args.selectedMovieIds && args.selectedMovieIds.length > 0) {
          anchorGenre = await inferTopGenre(args.selectedMovieIds, context);
        }

        const roundDef = generateCategoryRound(round, anchorGenre);

        // Fetch one representative movie per slot in parallel
        const moviePromises = roundDef.slots.map(async (slot) => {
          try {
            const discoverFilters: DiscoverFilters = {};
            if (slot.genres) discoverFilters.genres = slot.genres;
            if (slot.yearRange) discoverFilters.yearRange = slot.yearRange;
            if (slot.keywordIds && slot.keywordIds.length > 0) discoverFilters.keywordIds = slot.keywordIds;
            if (slot.popularityRange) discoverFilters.popularityRange = slot.popularityRange;

            const discoverParams = buildDiscoverParams(discoverFilters, false);

            // Randomize the page (1–3) so each call draws from a different candidate pool.
            // Quality floor already ensures every result meets the minimum bar.
            const randomPage = Math.floor(Math.random() * 3) + 1;
            const slotOptions = convertGraphQLOptionsToTMDBOptions({
              voteAverageGte: slot.voteAverageGte ?? roundDef.defaultVoteAverageGte,
              voteCountGte: slot.voteCountGte ?? roundDef.defaultVoteCountGte,
              sortBy: roundDef.defaultSortBy,
              page: randomPage,
            });

            let discoveredMovies = await context.tmdb.discoverMovies(discoverParams, slotOptions);
            let tmdbMovies = (discoveredMovies as Array<{ id: number }>).filter(
              (movie) => !historySet.has(movie.id) && !selectedSet.has(movie.id)
            );

            // If the random page was past the end of results, retry at page 1 before falling back
            if (tmdbMovies.length === 0 && randomPage > 1) {
              const page1Options = convertGraphQLOptionsToTMDBOptions({
                voteAverageGte: slot.voteAverageGte ?? roundDef.defaultVoteAverageGte,
                voteCountGte: slot.voteCountGte ?? roundDef.defaultVoteCountGte,
                sortBy: roundDef.defaultSortBy,
                page: 1,
              });
              discoveredMovies = await context.tmdb.discoverMovies(discoverParams, page1Options);
              tmdbMovies = (discoveredMovies as Array<{ id: number }>).filter(
                (movie) => !historySet.has(movie.id) && !selectedSet.has(movie.id)
              );
            }

            // Fallback 1: relax keyword/year constraints, keep genre + popularity
            if (tmdbMovies.length === 0 && (slot.keywordIds?.length || slot.yearRange)) {
              const relaxedFilters: DiscoverFilters = { genres: slot.genres };
              if (slot.popularityRange) relaxedFilters.popularityRange = slot.popularityRange;
              const relaxedParams = buildDiscoverParams(relaxedFilters, false);
              discoveredMovies = await context.tmdb.discoverMovies(relaxedParams, slotOptions);
              tmdbMovies = (discoveredMovies as Array<{ id: number }>).filter(
                (movie) => !historySet.has(movie.id)
              );
            }

            // Fallback 2: genre only with relaxed quality floor
            if (tmdbMovies.length === 0 && slot.genres) {
              const bareOptions = convertGraphQLOptionsToTMDBOptions({
                voteAverageGte: 5.0,
                voteCountGte: 50,
                sortBy: roundDef.defaultSortBy,
              });
              const genreOnlyParams = buildDiscoverParams({ genres: slot.genres }, false);
              discoveredMovies = await context.tmdb.discoverMovies(genreOnlyParams, bareOptions);
              tmdbMovies = (discoveredMovies as Array<{ id: number }>).filter(
                (movie) => !historySet.has(movie.id)
              );
            }

            if (tmdbMovies.length === 0) return null;

            // Pick randomly from the full returned page — quality floor already ensures
            // every candidate meets the minimum bar, so no need to restrict to top-N
            const selectedMovie = pickRandomItem(tmdbMovies) as { id: number };
            const fullMovie = await context.tmdb.getMovie(selectedMovie.id);
            return transformTMDBMovie(fullMovie as TMDBMovieResponse);
          } catch {
            return null;
          }
        });

        const movies = await Promise.all(moviePromises);

        // Deduplicate across parallel slot results — same-genre rounds (era, mood, popularity)
        // can have the same top film appear in multiple slots' result sets
        const seenIds = new Set<number>();
        const validMovies: Movie[] = [];
        for (const movie of movies) {
          if (movie !== null && !seenIds.has(movie.id)) {
            seenIds.add(movie.id);
            validMovies.push(movie);
          }
        }

        // Fill to 4 if any slots failed
        if (validMovies.length < 4) {
          const fillOptions = convertGraphQLOptionsToTMDBOptions({
            voteAverageGte: 6.0,
            voteCountGte: 100,
            sortBy: "popularity.desc",
          });
          let retries = 0;
          while (validMovies.length < 4 && retries < 20) {
            try {
              const randomMovie = await context.tmdb.getRandomMovieFromSource(
                "popular",
                undefined,
                fillOptions
              );
              const movieId = (randomMovie as { id: number }).id;
              if (!historySet.has(movieId) && !selectedSet.has(movieId) && !validMovies.some((m) => m.id === movieId)) {
                const fullMovie = await context.tmdb.getMovie(movieId, fillOptions);
                validMovies.push(transformTMDBMovie(fullMovie as TMDBMovieResponse));
              }
            } catch {}
            retries++;
          }
          // Last resort: accept history movies, bounded retries so a transient TMDB
          // error doesn't silently return fewer than 4 movies
          const lastResortOptions = convertGraphQLOptionsToTMDBOptions({
            voteAverageGte: 5.0,
            voteCountGte: 50,
          });
          for (let i = 0; i < 15 && validMovies.length < 4; i++) {
            try {
              const randomMovie = await context.tmdb.getRandomMovieFromSource(
                "top_rated",
                undefined,
                lastResortOptions
              );
              const movieId = (randomMovie as { id: number }).id;
              if (!selectedSet.has(movieId) && !validMovies.some((m) => m.id === movieId)) {
                const fullMovie = await context.tmdb.getMovie(movieId, lastResortOptions);
                validMovies.push(transformTMDBMovie(fullMovie as TMDBMovieResponse));
              }
            } catch {
              // continue to next retry rather than breaking out immediately
            }
          }
        }

        return {
          movies: validMovies.slice(0, 4),
          category: roundDef.category,
          categoryLabel: roundDef.categoryLabel,
        };
      } catch (error) {
        throw handleError(error, "Failed to get suggest movie round");
      }
    },

    suggestMovieRounds: async (
      _parent: unknown,
      _args: unknown,
      _context: Context
    ): Promise<number> => {
      return SUGGEST_MOVIE_ROUNDS;
    },

    suggestHistory: async (
      _parent: unknown,
      _args: unknown,
      context: Context
    ): Promise<Movie[]> => {
      try {
        if (!context.user) {
          throw new Error("Authentication required");
        }

        // Get suggest history movie IDs
        const historyIds = await getSuggestHistory(context.prisma, context.user.id);

        if (historyIds.length === 0) {
          return [];
        }

        // Fetch full movie details for each history entry
        const options = convertGraphQLOptionsToTMDBOptions({});
        const moviePromises = historyIds.map((tmdbId) =>
          context.tmdb.getMovie(tmdbId, options).catch(() => null)
        );

        const movies = await Promise.all(moviePromises);

        // Filter out null results and transform
        const validMovies = movies
          .filter((m): m is TMDBMovieResponse => m !== null)
          .map((m) => transformTMDBMovie(m));

        return validMovies;
      } catch (error) {
        throw handleError(error, "Failed to get suggest history");
      }
    },

    shuffleMovie: async (
      _parent: unknown,
      args: ShuffleMovieArgs,
      context: Context
    ): Promise<Movie | null> => {
      try {
        // Get collection analysis if requested (before checking hasAnyParams)
        let collectionAnalysis: {
          genres?: number[];
          keywords?: number[];
          actors?: number[];
          crew?: number[];
          yearRange?: number[];
        } = {};

        if (args.filterByCollectionAnalysis && context.user) {
          collectionAnalysis = await getCollectionAnalysisForFiltering(
            args.filterByCollectionAnalysis,
            context,
            10
          );
        }

        // Check if any parameters are provided
        const hasAnyParams = !!(
          args.genres ||
          args.yearRange ||
          args.cast ||
          args.crew ||
          args.minVoteAverage ||
          args.minVoteCount ||
          args.runtimeRange ||
          args.originalLanguage ||
          args.watchProviders ||
          args.excludeGenres ||
          args.excludeCast ||
          args.excludeCrew ||
          args.popularityRange ||
          args.popularityLevel ||
          args.originCountries ||
          args.keywordIds ||
          args.filterByCollectionAnalysis ||
          args.inCollections ||
          args.excludeCollections ||
          args.notInAnyCollection
        );

        // Helper function to generate random parameters
        const generateRandomParams = async (): Promise<ShuffleMovieArgs> => {
          const randomArgs: ShuffleMovieArgs = {};
          
          // Get available genres
          const allGenres = await context.tmdb.getGenres();
          const genreIds = allGenres.map((g) => g.id);

          // Randomly select 1-3 genres
          const numGenres = Math.floor(Math.random() * 3) + 1; // 1, 2, or 3
          const shuffledGenres = [...genreIds].sort(() => Math.random() - 0.5);
          randomArgs.genres = shuffledGenres.slice(0, numGenres);

          // Randomly select a popularity level (HIGH, AVERAGE, or LOW)
          const popularityLevels: Array<"HIGH" | "AVERAGE" | "LOW"> = ["HIGH", "AVERAGE", "LOW"];
          randomArgs.popularityLevel = pickRandomItem(popularityLevels);

          // Randomly select a decade/year range (last 50 years)
          const currentYear = new Date().getFullYear();
          const startYear = currentYear - 50;
          const decadeStart = startYear + Math.floor(Math.random() * 5) * 10; // Random decade start
          const decadeEnd = Math.min(decadeStart + 9, currentYear);
          randomArgs.yearRange = [decadeStart, decadeEnd];

          // 30% chance to add random runtime range
          if (Math.random() < 0.3) {
            const runtimeOptions = [
              [60, 90],   // Short
              [90, 120],  // Medium
              [120, 150], // Long
              [150, 200], // Very long
            ];
            randomArgs.runtimeRange = pickRandomItem(runtimeOptions);
          }

          // 20% chance to add minimum vote average (5.0-7.5)
          if (Math.random() < 0.2) {
            randomArgs.minVoteAverage = 5.0 + Math.random() * 2.5; // Random between 5.0 and 7.5
          }

          return randomArgs;
        };

        // If no parameters provided, generate random ones for better randomization
        let randomArgs = { ...args };
        const wasRandomGenerated = !hasAnyParams;
        if (wasRandomGenerated) {
          randomArgs = await generateRandomParams();
        }

        // Maximum retries when using random parameters (to ensure we get a result)
        const maxRetries = wasRandomGenerated ? 5 : 0;
        let attempts = 0;
        let tmdbMovies: unknown[] = [];
        let options: any;
        let discoverFilters: any;
        let discoverParams: any;
        let inCollectionIds: Set<number> | null = null;
        let excludeCollectionIds: Set<number> | null = null;
        let allCollectionMovieIds: Set<number> | null = null;

        while (attempts <= maxRetries) {
          // Build TMDB options with new parameters
          const popularityRange = randomArgs.popularityRange || 
            (randomArgs.popularityLevel ? getPopularityRange(randomArgs.popularityLevel) : undefined);
          options = convertGraphQLOptionsToTMDBOptions({
            voteAverageGte: randomArgs.minVoteAverage,
            voteCountGte: randomArgs.minVoteCount,
            withOriginalLanguage: randomArgs.originalLanguage,
            popularityGte: popularityRange?.[0],
            popularityLte: popularityRange?.[1],
          });

          // Get user for collection filtering (if needed)
          const user = context.user;

          // Handle collection filtering if user is authenticated
          if (user) {
            if (randomArgs.inCollections && randomArgs.inCollections.length > 0) {
              const movieIds = await getMovieIdsFromCollections(
                context.prisma,
                user.id,
                randomArgs.inCollections
              );
              inCollectionIds = new Set(movieIds);
            }

            if (randomArgs.excludeCollections && randomArgs.excludeCollections.length > 0) {
              const movieIds = await getMovieIdsFromCollections(
                context.prisma,
                user.id,
                randomArgs.excludeCollections
              );
              excludeCollectionIds = new Set(movieIds);
            }

            if (randomArgs.notInAnyCollection) {
              const movieIds = await getAllMovieIdsInCollections(
                context.prisma,
                user.id
              );
              allCollectionMovieIds = new Set(movieIds);
            }
          }

          // Merge collection analysis with randomArgs (if collection analysis was requested)
          const mergedGenres = randomArgs.genres || collectionAnalysis.genres;
          const mergedYearRange = randomArgs.yearRange || collectionAnalysis.yearRange;
          const mergedKeywords = randomArgs.keywordIds || collectionAnalysis.keywords;
          const mergedActors = [
            ...(randomArgs.cast || []),
            ...(collectionAnalysis.actors || []),
          ];
          const mergedCrew = [
            ...(randomArgs.crew || []),
            ...(collectionAnalysis.crew || []),
          ];

          // Filter cast to only actors and crew to only directors/writers
          const actorIds = mergedActors.length > 0
            ? await context.tmdb.filterToActorsOnly(mergedActors)
            : undefined;
          const crewIds = mergedCrew.length > 0
            ? await context.tmdb.filterToCrewOnly(mergedCrew)
            : undefined;

          // Build discover params with all filters (using randomArgs if generated, merged with collection analysis)
          // yearRange should be [minYear, maxYear] format
          discoverFilters = {
            genres: mergedGenres,
            yearRange: mergedYearRange,
            cast: actorIds,
            actors: actorIds,
            crew: crewIds,
            runtimeRange: randomArgs.runtimeRange,
            watchProviders: randomArgs.watchProviders,
            excludeGenres: randomArgs.excludeGenres,
            excludeCast: randomArgs.excludeCast,
            excludeCrew: randomArgs.excludeCrew,
            popularityRange: randomArgs.popularityRange,
            popularityLevel: randomArgs.popularityLevel,
            originCountries: randomArgs.originCountries,
            keywords: mergedKeywords,
          };

          // First attempt: try with ALL provided filters (AND logic - all must match)
          // This ensures all parameters are used together
          discoverParams = buildDiscoverParams(discoverFilters, false);
          tmdbMovies = await context.tmdb.discoverMovies(
            discoverParams,
            options
          );

          // Apply collection filtering
          if (inCollectionIds || excludeCollectionIds || randomArgs.notInAnyCollection) {
            tmdbMovies = filterMoviesByCollections(
              tmdbMovies as Array<{ id: number }>,
              inCollectionIds,
              excludeCollectionIds,
              randomArgs.notInAnyCollection || false,
              allCollectionMovieIds
            );
          }

          // Only try fallback if:
          // 1. No results found
          // 2. We have multiple genres/actors/crew (can try with fewer)
          // 3. We don't have strict filters like yearRange, runtimeRange, vote filters, popularity, exclusion filters, keywords, or collection filters (these should always be respected)
          // Note: If random params were generated, we still respect them as strict filters to maintain randomness
    const hasStrictFilters = !!(
      randomArgs.yearRange ||
      collectionAnalysis.yearRange ||
      randomArgs.runtimeRange ||
      randomArgs.minVoteAverage ||
      randomArgs.minVoteCount ||
      randomArgs.originalLanguage ||
      randomArgs.popularityRange ||
      randomArgs.popularityLevel ||
      randomArgs.watchProviders ||
      randomArgs.excludeGenres ||
      randomArgs.excludeCast ||
      randomArgs.excludeCrew ||
      randomArgs.originCountries ||
      randomArgs.keywordIds ||
      collectionAnalysis.keywords ||
      args.filterByCollectionAnalysis ||
      randomArgs.inCollections ||
      randomArgs.excludeCollections ||
      randomArgs.notInAnyCollection
    );
          
          if (tmdbMovies.length === 0 && shouldTryFallback(discoverFilters) && !hasStrictFilters) {
            discoverParams = buildDiscoverParams(discoverFilters, true);
            tmdbMovies = await context.tmdb.discoverMovies(
              discoverParams,
              options
            );
            
            // Apply collection filtering to fallback results too
            if (inCollectionIds || excludeCollectionIds || randomArgs.notInAnyCollection) {
              tmdbMovies = filterMoviesByCollections(
                tmdbMovies as Array<{ id: number }>,
                inCollectionIds,
                excludeCollectionIds,
                randomArgs.notInAnyCollection || false,
                allCollectionMovieIds
              );
            }
          }

          // If we found results, break out of retry loop
          if (tmdbMovies.length > 0) {
            break;
          }

          // If no results and we're using random params, try again with new random params
          if (wasRandomGenerated && attempts < maxRetries) {
            attempts++;
            // Generate new random parameters for next iteration
            randomArgs = await generateRandomParams();
            // Continue to next iteration with new random params
            continue;
          }

          // If we've exhausted retries or user provided params, break
          break;
        }

        // If still no results after retries, return null
        if (tmdbMovies.length === 0) {
          return null;
        }

        // Get the selected movie ID
        const selectedMovie = pickRandomItem(tmdbMovies) as { id: number };
        
        // Fetch full movie details including videos/trailer
        const fullMovie = await context.tmdb.getMovie(selectedMovie.id, options);
        
        return transformTMDBMovie(fullMovie as TMDBMovieResponse);
      } catch (error) {
        throw handleError(error, "Failed to shuffle movie");
      }
    },

    randomMovie: async (
      _parent: unknown,
      args: RandomMovieArgs,
      context: Context
    ): Promise<Movie> => {
      try {
        const options = convertGraphQLOptionsToTMDBOptions(args.options);
        const tmdbMovie = await context.tmdb.getRandomMovie(options);
        
        // Get the selected movie ID
        const movieId = (tmdbMovie as { id: number }).id;
        
        // Fetch full movie details including videos/trailer
        const fullMovie = await context.tmdb.getMovie(movieId, options);
        
        return transformTMDBMovie(fullMovie as TMDBMovieResponse);
      } catch (error) {
        throw handleError(error, "Failed to get random movie");
      }
    },

    trendingMovies: async (
      _parent: unknown,
      args: TrendingMoviesArgs,
      context: Context
    ): Promise<Movie[]> => {
      try {
        const timeWindow = args.timeWindow
          ? args.timeWindow.toLowerCase()
          : "day";
        const options = convertGraphQLOptionsToTMDBOptions(args.options);
        const tmdbMovies = await context.tmdb.getTrendingMovies(
          timeWindow as "day" | "week",
          options
        );
        return tmdbMovies.map((m) =>
          transformTMDBMovie(m as TMDBMovieResponse)
        );
      } catch (error) {
        throw handleError(error, "Failed to get trending movies");
      }
    },

    nowPlayingMovies: async (
      _parent: unknown,
      args: NowPlayingMoviesArgs,
      context: Context
    ): Promise<Movie[]> => {
      try {
        const options = convertGraphQLOptionsToTMDBOptions(args.options);
        const tmdbMovies = await context.tmdb.getNowPlayingMovies(options);
        return tmdbMovies.map((m) =>
          transformTMDBMovie(m as TMDBMovieResponse)
        );
      } catch (error) {
        throw handleError(error, "Failed to get now playing movies");
      }
    },

    popularMovies: async (
      _parent: unknown,
      args: PopularMoviesArgs,
      context: Context
    ): Promise<Movie[]> => {
      try {
        const options = convertGraphQLOptionsToTMDBOptions(args.options);
        const tmdbMovies = await context.tmdb.getPopularMovies(options);
        return tmdbMovies.map((m) =>
          transformTMDBMovie(m as TMDBMovieResponse)
        );
      } catch (error) {
        throw handleError(error, "Failed to get popular movies");
      }
    },

    topRatedMovies: async (
      _parent: unknown,
      args: TopRatedMoviesArgs,
      context: Context
    ): Promise<Movie[]> => {
      try {
        const options = convertGraphQLOptionsToTMDBOptions(args.options);
        const tmdbMovies = await context.tmdb.getTopRatedMovies(options);
        return tmdbMovies.map((m) =>
          transformTMDBMovie(m as TMDBMovieResponse)
        );
      } catch (error) {
        throw handleError(error, "Failed to get top rated movies");
      }
    },

    upcomingMovies: async (
      _parent: unknown,
      args: UpcomingMoviesArgs,
      context: Context
    ): Promise<Movie[]> => {
      try {
        const options = convertGraphQLOptionsToTMDBOptions(args.options);
        const tmdbMovies = await context.tmdb.getUpcomingMovies(options);
        return tmdbMovies.map((m) =>
          transformTMDBMovie(m as TMDBMovieResponse)
        );
      } catch (error) {
        throw handleError(error, "Failed to get upcoming movies");
      }
    },

    randomMovieFromSource: async (
      _parent: unknown,
      args: RandomMovieFromSourceArgs,
      context: Context
    ): Promise<Movie> => {
      try {
        // Convert GraphQL enum to lowercase for TMDB API
        const sourceMap: Record<string, "trending" | "now_playing" | "popular" | "top_rated" | "upcoming"> = {
          TRENDING: "trending",
          NOW_PLAYING: "now_playing",
          POPULAR: "popular",
          TOP_RATED: "top_rated",
          UPCOMING: "upcoming",
        };

        // If source is not provided, randomly select one
        let selectedSource = args.source;
        if (!selectedSource) {
          const sources: Array<"TRENDING" | "NOW_PLAYING" | "POPULAR" | "TOP_RATED" | "UPCOMING"> = [
            "TRENDING",
            "NOW_PLAYING",
            "POPULAR",
            "TOP_RATED",
            "UPCOMING",
          ];
          selectedSource = pickRandomItem(sources);
        }

        const tmdbSource = sourceMap[selectedSource];
        if (!tmdbSource) {
          throw new Error(`Invalid source: ${selectedSource}`);
        }

        // For trending, randomly select timeWindow if not provided
        let timeWindow: "day" | "week" = "day";
        if (tmdbSource === "trending") {
          if (args.timeWindow) {
            timeWindow = args.timeWindow.toLowerCase() as "day" | "week";
          } else {
            // Randomly select day or week for trending
            timeWindow = pickRandomItem(["day", "week"]);
          }
        } else if (args.timeWindow) {
          // Use provided timeWindow even for non-trending (will be ignored by API)
          timeWindow = args.timeWindow.toLowerCase() as "day" | "week";
        }

        const options = convertGraphQLOptionsToTMDBOptions(args.options);

        const tmdbMovie = await context.tmdb.getRandomMovieFromSource(
          tmdbSource,
          timeWindow,
          options
        );

        // Get the selected movie ID
        const movieId = (tmdbMovie as { id: number }).id;

        // Fetch full movie details including videos/trailer
        const fullMovie = await context.tmdb.getMovie(movieId, options);

        return transformTMDBMovie(fullMovie as TMDBMovieResponse);
      } catch (error) {
        throw handleError(error, "Failed to get random movie from source");
      }
    },

    movieGenres: async (
      _parent: unknown,
      _args: unknown,
      context: Context
    ) => {
      try {
        const genres = await context.tmdb.getGenres();
        return genres.map((genre) => ({
          id: genre.id,
          name: genre.name,
          icon: GENRE_ICONS[genre.id] || null,
        }));
      } catch (error) {
        throw handleError(error, "Failed to get movie genres");
      }
    },

    actorsFromFeaturedMovies: async (
      _parent: unknown,
      args: ActorsFromFeaturedMoviesArgs,
      context: Context
    ) => {
      try {
        const options = convertGraphQLOptionsToTMDBOptions(args.options);

        // Get movies from all three lists
        const [nowPlaying, popular, topRated] = await Promise.all([
          context.tmdb.getNowPlayingMovies(options),
          context.tmdb.getPopularMovies(options),
          context.tmdb.getTopRatedMovies(options),
        ]);

        // Extract movie IDs
        const movieIds = [
          ...(nowPlaying as Array<{ id: number }>).map((m) => m.id),
          ...(popular as Array<{ id: number }>).map((m) => m.id),
          ...(topRated as Array<{ id: number }>).map((m) => m.id),
        ];

        // Extract unique actors
        const actors = await context.tmdb.extractActorsFromMovies(movieIds);

        // Transform to Person type
        return actors.map((actor) => ({
          id: actor.id,
          name: actor.name,
          biography: null,
          profileUrl: actor.profile_path
            ? `https://image.tmdb.org/t/p/w500${actor.profile_path}`
            : null,
          birthday: null,
          placeOfBirth: null,
          knownForDepartment: null,
          popularity: null,
        }));
      } catch (error) {
        throw handleError(error, "Failed to get actors from featured movies");
      }
    },

    crewFromFeaturedMovies: async (
      _parent: unknown,
      args: CrewFromFeaturedMoviesArgs,
      context: Context
    ) => {
      try {
        const options = convertGraphQLOptionsToTMDBOptions(args.options);

        // Get movies from all three lists
        const [nowPlaying, popular, topRated] = await Promise.all([
          context.tmdb.getNowPlayingMovies(options),
          context.tmdb.getPopularMovies(options),
          context.tmdb.getTopRatedMovies(options),
        ]);

        // Extract movie IDs
        const movieIds = [
          ...(nowPlaying as Array<{ id: number }>).map((m) => m.id),
          ...(popular as Array<{ id: number }>).map((m) => m.id),
          ...(topRated as Array<{ id: number }>).map((m) => m.id),
        ];

        // Extract unique crew (directors/writers)
        const crew = await context.tmdb.extractCrewFromMovies(movieIds);

        // Transform to Person type
        return crew.map((member) => ({
          id: member.id,
          name: member.name,
          biography: null,
          profileUrl: member.profile_path
            ? `https://image.tmdb.org/t/p/w500${member.profile_path}`
            : null,
          birthday: null,
          placeOfBirth: null,
          knownForDepartment: null,
          popularity: null,
        }));
      } catch (error) {
        throw handleError(error, "Failed to get crew from featured movies");
      }
    },

    movieSelectionOptions: async (
      _parent: unknown,
      _args: unknown,
      context: Context
    ) => {
      try {
        const genres = await context.tmdb.getGenres();
        return {
          genres: genres.map((g) => ({
            id: g.id,
            name: g.name,
            icon: GENRE_ICONS[g.id] || null,
          })),
          moods: MOVIE_VIBES.map((mood) => ({
            id: mood.id,
            label: mood.label,
            icon: MOVIE_VIBE_ICONS[mood.id] || null,
          })),
          eras: ERA_OPTIONS.map((era) => ({
            id: era.id,
            label: era.label,
            value: era.value,
            icon: ERA_OPTION_ICONS[era.id] || null,
          })),
        };
      } catch (error) {
        throw handleError(error, "Failed to get movie selection options");
      }
    },
  },
};

