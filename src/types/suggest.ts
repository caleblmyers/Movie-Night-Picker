export type OptionType = 'genre' | 'actor' | 'movie' | 'yearRange';

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
}

export interface Movie {
  id: number;
  title: string;
  overview?: string;
  posterUrl?: string;
  releaseDate?: string;
  voteAverage?: number;
  voteCount?: number;
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

