export type OptionType = "genre" | "actor" | "movie" | "yearRange";

export interface SelectionOption {
  id: string;
  type: OptionType;
  label: string;
  value: string;
  imageUrl?: string;
}

export interface RoundSelection {
  round: number;
  selectedOption: SelectionOption;
}

export interface MoviePreferences {
  genres?: string[];
  actors?: number[];
  yearRange?: number[];
}

export interface MovieResult {
  id: number;
  title: string;
  overview?: string;
  posterUrl?: string;
  releaseDate?: string;
  voteAverage?: number;
  voteCount?: number;
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
}

export interface Movie {
  id: number;
  title: string;
  overview?: string;
  posterUrl?: string;
  releaseDate?: string;
  voteAverage?: number;
  voteCount?: number;
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
}

export interface User {
  id: number | string; // GraphQL returns Int but may be serialized as string
  email: string;
  name: string;
  createdAt: string;
  savedMovies?: SavedMovie[];
  ratings?: Rating[];
  reviews?: Review[];
  collections?: Collection[];
}

export interface SavedMovie {
  id: number | string; // GraphQL returns Int but may be serialized as string
  tmdbId: number;
  createdAt: string;
  movie?: Movie;
  rating?: Rating;
  review?: Review;
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
