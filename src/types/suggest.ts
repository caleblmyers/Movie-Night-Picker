export type OptionType = "genre" | "mood" | "era" | "actor" | "director";

/**
 * Movie trailer information
 */
export interface MovieTrailer {
  key: string; // YouTube video ID or platform key
  site: string; // "YouTube", "Vimeo", etc.
  name?: string; // Trailer name/title
  type?: string; // "Trailer" or "Teaser"
  url: string; // Full URL to play the trailer
}

/**
 * Genre information
 */
export interface Genre {
  id: number;
  name: string;
  icon?: string | null;
}

/**
 * Cast member information
 */
export interface CastMember {
  id: number;
  name: string;
  character?: string | null;
  profileUrl?: string | null;
  order?: number | null;
}

/**
 * Crew member information
 */
export interface CrewMember {
  id: number;
  name: string;
  job?: string | null;
  department?: string | null;
  profileUrl?: string | null;
}

export interface SelectionOption {
  id: string;
  type: OptionType;
  label: string;
  value: string;
  imageUrl?: string;
  icon?: string | null; // Iconify icon identifier (e.g., "lucide:smile")
}

export interface RoundSelection {
  round: number;
  selectedOption: SelectionOption;
}

/**
 * Selection of a movie from a round
 */
export interface MovieSelection {
  round: number;
  movie: Movie;
}

export interface MoviePreferences {
  genres?: string[];
  mood?: string;
  era?: string;
  actors?: number[]; // Filters to actors only (automatically filtered by backend)
  directors?: number[]; // Deprecated: use crew instead
  crew?: number[]; // Filters to directors/writers only (automatically filtered by backend)
  yearRange?: number[];
  inCollections?: number[]; // Only include movies from specified collections
  excludeCollections?: number[]; // Exclude movies from specified collections
  notInAnyCollection?: boolean; // Only include movies not in any collection
  keywordIds?: number[]; // TMDB keyword IDs for thematic filtering (e.g., superhero, time travel)
}

/**
 * Person role type for filtering people search
 */
export enum PersonRoleType {
  ACTOR = "ACTOR", // Actors only
  CREW = "CREW", // Directors/writers only
  BOTH = "BOTH", // All people
}

export interface MovieResult {
  id: number;
  title: string;
  overview?: string;
  posterUrl?: string;
  releaseDate?: string;
  voteAverage?: number;
  voteCount?: number;
  runtime?: number;
  isSaved?: boolean;
  rating?: {
    id: number | string;
    value: number;
  };
  review?: {
    id: number | string;
    content: string;
  };
  averageUserRating?: number;
  inCollections?: Array<{
    id: number;
    name: string;
    description?: string;
    isPublic: boolean;
  }>;
  genres?: Genre[];
  trailer?: MovieTrailer | null;
  cast?: CastMember[];
  crew?: CrewMember[];
}

export interface Movie {
  id: number;
  title: string;
  overview?: string;
  posterUrl?: string;
  releaseDate?: string;
  voteAverage?: number;
  voteCount?: number;
  runtime?: number;
  isSaved?: boolean;
  rating?: {
    id: number | string;
    value: number;
  };
  review?: {
    id: number | string;
    content: string;
  };
  averageUserRating?: number;
  inCollections?: Array<{
    id: number;
    name: string;
    description?: string;
    isPublic: boolean;
  }>;
  genres?: Genre[];
  trailer?: MovieTrailer | null;
  cast?: CastMember[];
  crew?: CrewMember[];
  keywords?: Array<{
    id: number;
    name: string;
  }>;
  reviews?: Array<{
    id: number | string;
    content: string;
    user?: {
      id: number | string;
      email: string;
      name?: string | null;
    };
    createdAt?: string;
    updatedAt?: string;
  }>;
  ratings?: Array<{
    id: number | string;
    value: number;
    user?: {
      id: number | string;
      email: string;
      name?: string | null;
    };
    createdAt?: string;
    updatedAt?: string;
  }>;
}

export interface CollectionInsights {
  totalMovies: number;
  uniqueGenres: number;
  moviesByGenre: Array<{
    genre: {
      id: number;
      name: string;
    };
    count: number;
  }>;
  uniqueActors: number;
  topActors: Array<{
    person: {
      id: number;
      name: string;
      profileUrl?: string | null;
    };
    count: number;
  }>;
  uniqueCrew: number;
  topCrew: Array<{
    person: {
      id: number;
      name: string;
      profileUrl?: string | null;
    };
    count: number;
  }>;
  yearRange: {
    min: number | null;
    max: number | null;
  };
  averageRuntime: number | null;
  averageVoteAverage: number | null;
}

export interface Collection {
  id: number;
  name: string;
  description?: string;
  isPublic: boolean;
  createdAt: string;
  updatedAt: string;
  user: {
    id: number | string;
    email: string;
    name?: string | null;
  };
  movies: Array<{
    id: number;
    tmdbId: number;
    addedAt: string;
    movie?: Movie;
  }>;
  movieCount: number;
  insights?: CollectionInsights;
}

export interface CollectionMovie {
  id: number;
  tmdbId: number;
  addedAt: string;
  movie?: Movie;
}

export interface Person {
  id: number;
  name: string;
  biography?: string;
  profileUrl?: string;
  birthday?: string;
  placeOfBirth?: string;
  knownForDepartment?: string;
  popularity?: number;
  movies?: Array<{
    id: number;
    title: string;
    posterUrl?: string | null;
    releaseDate?: string | null;
    voteAverage?: number | null;
  }>;
}

export interface User {
  id: number | string; // GraphQL returns Int but may be serialized as string
  email: string;
  name: string;
  createdAt: string;
  ratings?: Rating[];
  reviews?: Review[];
  collections?: Collection[];
}

export interface Rating {
  id: number | string; // GraphQL returns Int but may be serialized as string
  tmdbId: number;
  value: number;
  createdAt: string;
  updatedAt: string;
  movie?: Movie;
  user: User;
}

export interface Review {
  id: number | string; // GraphQL returns Int but may be serialized as string
  tmdbId: number;
  content: string;
  createdAt: string;
  updatedAt: string;
  movie?: Movie;
  user: User;
}
