export type Maybe<T> = T | null;
export type InputMaybe<T> = T | null;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
};

export type AuthPayload = {
  __typename?: 'AuthPayload';
  token: Scalars['String']['output'];
  user: User;
};

export type CastMember = {
  __typename?: 'CastMember';
  character?: Maybe<Scalars['String']['output']>;
  id: Scalars['Int']['output'];
  name: Scalars['String']['output'];
  order?: Maybe<Scalars['Int']['output']>;
  profileUrl?: Maybe<Scalars['String']['output']>;
};

export type Collection = {
  __typename?: 'Collection';
  createdAt: Scalars['String']['output'];
  description?: Maybe<Scalars['String']['output']>;
  id: Scalars['Int']['output'];
  insights: CollectionInsights;
  isPublic: Scalars['Boolean']['output'];
  movieCount: Scalars['Int']['output'];
  movies: Array<CollectionMovie>;
  name: Scalars['String']['output'];
  updatedAt: Scalars['String']['output'];
  user: User;
};

export type CollectionAnalysis = {
  __typename?: 'CollectionAnalysis';
  topActors: Array<Person>;
  topCrew: Array<Person>;
  topGenres: Array<Genre>;
  topKeywords: Array<Keyword>;
  yearRange?: Maybe<YearRange>;
};

export type CollectionInsights = {
  __typename?: 'CollectionInsights';
  averageRuntime?: Maybe<Scalars['Float']['output']>;
  averageVoteAverage?: Maybe<Scalars['Float']['output']>;
  moviesByGenre: Array<GenreCount>;
  topActors: Array<PersonCount>;
  topCrew: Array<PersonCount>;
  topKeywords: Array<KeywordCount>;
  totalMovies: Scalars['Int']['output'];
  uniqueActors: Scalars['Int']['output'];
  uniqueCrew: Scalars['Int']['output'];
  uniqueGenres: Scalars['Int']['output'];
  uniqueKeywords: Scalars['Int']['output'];
  yearRange?: Maybe<YearRange>;
};

export type CollectionMovie = {
  __typename?: 'CollectionMovie';
  addedAt: Scalars['String']['output'];
  id: Scalars['Int']['output'];
  movie?: Maybe<Movie>;
  tmdbId: Scalars['Int']['output'];
};

export type CrewMember = {
  __typename?: 'CrewMember';
  department?: Maybe<Scalars['String']['output']>;
  id: Scalars['Int']['output'];
  job?: Maybe<Scalars['String']['output']>;
  name: Scalars['String']['output'];
  profileUrl?: Maybe<Scalars['String']['output']>;
};

export type EraOption = {
  __typename?: 'EraOption';
  icon?: Maybe<Scalars['String']['output']>;
  id: Scalars['String']['output'];
  label: Scalars['String']['output'];
  value: Scalars['String']['output'];
};

export type Genre = {
  __typename?: 'Genre';
  icon?: Maybe<Scalars['String']['output']>;
  id: Scalars['Int']['output'];
  name: Scalars['String']['output'];
};

export type GenreCount = {
  __typename?: 'GenreCount';
  count: Scalars['Int']['output'];
  genre: Genre;
};

export type Keyword = {
  __typename?: 'Keyword';
  id: Scalars['Int']['output'];
  name: Scalars['String']['output'];
};

export type KeywordCount = {
  __typename?: 'KeywordCount';
  count: Scalars['Int']['output'];
  keyword: Keyword;
};

export type MoodOption = {
  __typename?: 'MoodOption';
  icon?: Maybe<Scalars['String']['output']>;
  id: Scalars['String']['output'];
  label: Scalars['String']['output'];
};

export type Movie = {
  __typename?: 'Movie';
  averageUserRating?: Maybe<Scalars['Float']['output']>;
  cast: Array<CastMember>;
  crew: Array<CrewMember>;
  genres: Array<Genre>;
  id: Scalars['Int']['output'];
  inCollections: Array<Collection>;
  isSaved: Scalars['Boolean']['output'];
  keywords: Array<Keyword>;
  overview?: Maybe<Scalars['String']['output']>;
  posterUrl?: Maybe<Scalars['String']['output']>;
  rating?: Maybe<Rating>;
  ratings: Array<Rating>;
  releaseDate?: Maybe<Scalars['String']['output']>;
  review?: Maybe<Review>;
  reviews: Array<Review>;
  runtime?: Maybe<Scalars['Int']['output']>;
  title: Scalars['String']['output'];
  trailer?: Maybe<MovieTrailer>;
  voteAverage?: Maybe<Scalars['Float']['output']>;
  voteCount?: Maybe<Scalars['Int']['output']>;
};

export type MoviePreferencesInput = {
  actors?: InputMaybe<Array<Scalars['Int']['input']>>;
  crew?: InputMaybe<Array<Scalars['Int']['input']>>;
  era?: InputMaybe<Scalars['String']['input']>;
  excludeCollections?: InputMaybe<Array<Scalars['Int']['input']>>;
  genres?: InputMaybe<Array<Scalars['Int']['input']>>;
  inCollections?: InputMaybe<Array<Scalars['Int']['input']>>;
  keywordIds?: InputMaybe<Array<Scalars['Int']['input']>>;
  mood?: InputMaybe<Scalars['String']['input']>;
  notInAnyCollection?: InputMaybe<Scalars['Boolean']['input']>;
  options?: InputMaybe<TmdbOptionsInput>;
  popularityLevel?: InputMaybe<PopularityLevel>;
  yearRange?: InputMaybe<Array<Scalars['Int']['input']>>;
};

export type MovieSelectionOptions = {
  __typename?: 'MovieSelectionOptions';
  eras: Array<EraOption>;
  genres: Array<Genre>;
  moods: Array<MoodOption>;
};

export enum MovieSource {
  NowPlaying = 'NOW_PLAYING',
  Popular = 'POPULAR',
  TopRated = 'TOP_RATED',
  Trending = 'TRENDING',
  Upcoming = 'UPCOMING'
}

export type MovieTrailer = {
  __typename?: 'MovieTrailer';
  key: Scalars['String']['output'];
  name?: Maybe<Scalars['String']['output']>;
  site: Scalars['String']['output'];
  type?: Maybe<Scalars['String']['output']>;
  url: Scalars['String']['output'];
};

export type Mutation = {
  __typename?: 'Mutation';
  _empty?: Maybe<Scalars['String']['output']>;
  addMovieToCollection: CollectionMovie;
  createCollection: Collection;
  deleteCollection: Scalars['Boolean']['output'];
  deleteReview: Scalars['Boolean']['output'];
  login: AuthPayload;
  rateMovie: Rating;
  register: AuthPayload;
  removeMovieFromCollection: Scalars['Boolean']['output'];
  reviewMovie: Review;
  saveMovie: SavedMovie;
  unsaveMovie: Scalars['Boolean']['output'];
  updateCollection: Collection;
  updateName: User;
};


export type MutationAddMovieToCollectionArgs = {
  collectionId: Scalars['Int']['input'];
  tmdbId: Scalars['Int']['input'];
};


export type MutationCreateCollectionArgs = {
  description?: InputMaybe<Scalars['String']['input']>;
  isPublic?: InputMaybe<Scalars['Boolean']['input']>;
  name: Scalars['String']['input'];
};


export type MutationDeleteCollectionArgs = {
  id: Scalars['Int']['input'];
};


export type MutationDeleteReviewArgs = {
  tmdbId: Scalars['Int']['input'];
};


export type MutationLoginArgs = {
  email: Scalars['String']['input'];
  password: Scalars['String']['input'];
};


export type MutationRateMovieArgs = {
  rating: Scalars['Int']['input'];
  tmdbId: Scalars['Int']['input'];
};


export type MutationRegisterArgs = {
  email: Scalars['String']['input'];
  password: Scalars['String']['input'];
};


export type MutationRemoveMovieFromCollectionArgs = {
  collectionId: Scalars['Int']['input'];
  tmdbId: Scalars['Int']['input'];
};


export type MutationReviewMovieArgs = {
  content: Scalars['String']['input'];
  tmdbId: Scalars['Int']['input'];
};


export type MutationSaveMovieArgs = {
  tmdbId: Scalars['Int']['input'];
};


export type MutationUnsaveMovieArgs = {
  tmdbId: Scalars['Int']['input'];
};


export type MutationUpdateCollectionArgs = {
  description?: InputMaybe<Scalars['String']['input']>;
  id: Scalars['Int']['input'];
  isPublic?: InputMaybe<Scalars['Boolean']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
};


export type MutationUpdateNameArgs = {
  name: Scalars['String']['input'];
};

export type Person = {
  __typename?: 'Person';
  biography?: Maybe<Scalars['String']['output']>;
  birthday?: Maybe<Scalars['String']['output']>;
  id: Scalars['Int']['output'];
  knownForDepartment?: Maybe<Scalars['String']['output']>;
  movies: Array<Movie>;
  name: Scalars['String']['output'];
  placeOfBirth?: Maybe<Scalars['String']['output']>;
  popularity?: Maybe<Scalars['Float']['output']>;
  profileUrl?: Maybe<Scalars['String']['output']>;
};

export type PersonCount = {
  __typename?: 'PersonCount';
  count: Scalars['Int']['output'];
  person: Person;
};

export enum PersonRoleType {
  Actor = 'ACTOR',
  Both = 'BOTH',
  Crew = 'CREW'
}

export enum PopularityLevel {
  Average = 'AVERAGE',
  High = 'HIGH',
  Low = 'LOW'
}

export type Query = {
  __typename?: 'Query';
  _empty?: Maybe<Scalars['String']['output']>;
  actorsFromFeaturedMovies: Array<Person>;
  collectionAnalysis: CollectionAnalysis;
  collectionInsights: CollectionInsights;
  collections: Array<Collection>;
  crewFromFeaturedMovies: Array<Person>;
  discoverMovies: Array<Movie>;
  getCollection?: Maybe<Collection>;
  getMovie?: Maybe<Movie>;
  getPerson?: Maybe<Person>;
  me?: Maybe<User>;
  movieGenres: Array<Genre>;
  movieSelectionOptions: MovieSelectionOptions;
  nowPlayingMovies: Array<Movie>;
  popularMovies: Array<Movie>;
  randomActorFromSource?: Maybe<Person>;
  randomMovie?: Maybe<Movie>;
  randomMovieFromSource?: Maybe<Movie>;
  randomPerson?: Maybe<Person>;
  ratings: Array<Rating>;
  reviews: Array<Review>;
  savedMovies: Array<SavedMovie>;
  searchKeywords: Array<Keyword>;
  searchMovies: Array<Movie>;
  searchPeople: Array<Person>;
  shuffleMovie?: Maybe<Movie>;
  suggestHistory: Array<Movie>;
  suggestMovie?: Maybe<Movie>;
  suggestMovieRound: SuggestMovieRoundResult;
  suggestMovieRounds: Scalars['Int']['output'];
  topRatedMovies: Array<Movie>;
  trendingMovies: Array<Movie>;
  trendingPeople: Array<Person>;
  upcomingMovies: Array<Movie>;
};


export type QueryActorsFromFeaturedMoviesArgs = {
  options?: InputMaybe<TmdbOptionsInput>;
};


export type QueryCollectionAnalysisArgs = {
  collectionId: Scalars['Int']['input'];
  limit?: InputMaybe<Scalars['Int']['input']>;
};


export type QueryCollectionInsightsArgs = {
  collectionId: Scalars['Int']['input'];
};


export type QueryCrewFromFeaturedMoviesArgs = {
  options?: InputMaybe<TmdbOptionsInput>;
};


export type QueryDiscoverMoviesArgs = {
  cast?: InputMaybe<Array<Scalars['Int']['input']>>;
  crew?: InputMaybe<Array<Scalars['Int']['input']>>;
  excludeCast?: InputMaybe<Array<Scalars['Int']['input']>>;
  excludeCollections?: InputMaybe<Array<Scalars['Int']['input']>>;
  excludeCrew?: InputMaybe<Array<Scalars['Int']['input']>>;
  excludeGenres?: InputMaybe<Array<Scalars['Int']['input']>>;
  filterByCollectionAnalysis?: InputMaybe<Scalars['Int']['input']>;
  genres?: InputMaybe<Array<Scalars['Int']['input']>>;
  inCollections?: InputMaybe<Array<Scalars['Int']['input']>>;
  keywordIds?: InputMaybe<Array<Scalars['Int']['input']>>;
  notInAnyCollection?: InputMaybe<Scalars['Boolean']['input']>;
  options?: InputMaybe<TmdbOptionsInput>;
  originCountries?: InputMaybe<Array<Scalars['String']['input']>>;
  popularityLevel?: InputMaybe<PopularityLevel>;
  popularityRange?: InputMaybe<Array<Scalars['Float']['input']>>;
  runtimeRange?: InputMaybe<Array<Scalars['Int']['input']>>;
  watchProviders?: InputMaybe<Scalars['String']['input']>;
  yearRange?: InputMaybe<Array<Scalars['Int']['input']>>;
};


export type QueryGetCollectionArgs = {
  id: Scalars['Int']['input'];
};


export type QueryGetMovieArgs = {
  id: Scalars['Int']['input'];
  options?: InputMaybe<TmdbOptionsInput>;
};


export type QueryGetPersonArgs = {
  id: Scalars['Int']['input'];
};


export type QueryNowPlayingMoviesArgs = {
  options?: InputMaybe<TmdbOptionsInput>;
};


export type QueryPopularMoviesArgs = {
  options?: InputMaybe<TmdbOptionsInput>;
};


export type QueryRandomActorFromSourceArgs = {
  options?: InputMaybe<TmdbOptionsInput>;
  source?: InputMaybe<MovieSource>;
  timeWindow?: InputMaybe<TrendingTimeWindow>;
};


export type QueryRandomMovieArgs = {
  options?: InputMaybe<TmdbOptionsInput>;
};


export type QueryRandomMovieFromSourceArgs = {
  options?: InputMaybe<TmdbOptionsInput>;
  source?: InputMaybe<MovieSource>;
  timeWindow?: InputMaybe<TrendingTimeWindow>;
};


export type QuerySearchKeywordsArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  query: Scalars['String']['input'];
};


export type QuerySearchMoviesArgs = {
  excludeCollections?: InputMaybe<Array<Scalars['Int']['input']>>;
  filterByCollectionAnalysis?: InputMaybe<Scalars['Int']['input']>;
  inCollections?: InputMaybe<Array<Scalars['Int']['input']>>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  notInAnyCollection?: InputMaybe<Scalars['Boolean']['input']>;
  options?: InputMaybe<TmdbOptionsInput>;
  popularityLevel?: InputMaybe<PopularityLevel>;
  query: Scalars['String']['input'];
};


export type QuerySearchPeopleArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  options?: InputMaybe<TmdbOptionsInput>;
  query: Scalars['String']['input'];
  roleType?: InputMaybe<PersonRoleType>;
};


export type QueryShuffleMovieArgs = {
  cast?: InputMaybe<Array<Scalars['Int']['input']>>;
  crew?: InputMaybe<Array<Scalars['Int']['input']>>;
  excludeCast?: InputMaybe<Array<Scalars['Int']['input']>>;
  excludeCollections?: InputMaybe<Array<Scalars['Int']['input']>>;
  excludeCrew?: InputMaybe<Array<Scalars['Int']['input']>>;
  excludeGenres?: InputMaybe<Array<Scalars['Int']['input']>>;
  filterByCollectionAnalysis?: InputMaybe<Scalars['Int']['input']>;
  genres?: InputMaybe<Array<Scalars['Int']['input']>>;
  inCollections?: InputMaybe<Array<Scalars['Int']['input']>>;
  keywordIds?: InputMaybe<Array<Scalars['Int']['input']>>;
  minVoteAverage?: InputMaybe<Scalars['Float']['input']>;
  minVoteCount?: InputMaybe<Scalars['Int']['input']>;
  notInAnyCollection?: InputMaybe<Scalars['Boolean']['input']>;
  originCountries?: InputMaybe<Array<Scalars['String']['input']>>;
  originalLanguage?: InputMaybe<Scalars['String']['input']>;
  popularityLevel?: InputMaybe<PopularityLevel>;
  popularityRange?: InputMaybe<Array<Scalars['Float']['input']>>;
  runtimeRange?: InputMaybe<Array<Scalars['Int']['input']>>;
  watchProviders?: InputMaybe<Scalars['String']['input']>;
  yearRange?: InputMaybe<Array<Scalars['Int']['input']>>;
};


export type QuerySuggestMovieArgs = {
  selectedMovieIds: Array<Scalars['Int']['input']>;
};


export type QuerySuggestMovieRoundArgs = {
  round: Scalars['Int']['input'];
  selectedMovieIds?: InputMaybe<Array<Scalars['Int']['input']>>;
};


export type QueryTopRatedMoviesArgs = {
  options?: InputMaybe<TmdbOptionsInput>;
};


export type QueryTrendingMoviesArgs = {
  options?: InputMaybe<TmdbOptionsInput>;
  timeWindow?: InputMaybe<TrendingTimeWindow>;
};


export type QueryTrendingPeopleArgs = {
  options?: InputMaybe<TmdbOptionsInput>;
  roleType?: InputMaybe<PersonRoleType>;
  timeWindow?: InputMaybe<TrendingTimeWindow>;
};


export type QueryUpcomingMoviesArgs = {
  options?: InputMaybe<TmdbOptionsInput>;
};

export type Rating = {
  __typename?: 'Rating';
  createdAt: Scalars['String']['output'];
  id: Scalars['Int']['output'];
  movie?: Maybe<Movie>;
  tmdbId: Scalars['Int']['output'];
  updatedAt: Scalars['String']['output'];
  user: User;
  value: Scalars['Int']['output'];
};

export type Review = {
  __typename?: 'Review';
  content: Scalars['String']['output'];
  createdAt: Scalars['String']['output'];
  id: Scalars['Int']['output'];
  movie?: Maybe<Movie>;
  tmdbId: Scalars['Int']['output'];
  updatedAt: Scalars['String']['output'];
  user: User;
};

export type SavedMovie = {
  __typename?: 'SavedMovie';
  createdAt: Scalars['String']['output'];
  id: Scalars['Int']['output'];
  movie?: Maybe<Movie>;
  rating?: Maybe<Rating>;
  review?: Maybe<Review>;
  tmdbId: Scalars['Int']['output'];
};

export type SuggestMovieRoundResult = {
  __typename?: 'SuggestMovieRoundResult';
  category: Scalars['String']['output'];
  categoryLabel: Scalars['String']['output'];
  movies: Array<Movie>;
};

export type TmdbOptionsInput = {
  includeAdult?: InputMaybe<Scalars['Boolean']['input']>;
  language?: InputMaybe<Scalars['String']['input']>;
  page?: InputMaybe<Scalars['Int']['input']>;
  popularityGte?: InputMaybe<Scalars['Float']['input']>;
  popularityLte?: InputMaybe<Scalars['Float']['input']>;
  primaryReleaseYear?: InputMaybe<Scalars['Int']['input']>;
  region?: InputMaybe<Scalars['String']['input']>;
  sortBy?: InputMaybe<Scalars['String']['input']>;
  voteAverageGte?: InputMaybe<Scalars['Float']['input']>;
  voteCountGte?: InputMaybe<Scalars['Int']['input']>;
  withOriginalLanguage?: InputMaybe<Scalars['String']['input']>;
  withWatchProviders?: InputMaybe<Scalars['String']['input']>;
  year?: InputMaybe<Scalars['Int']['input']>;
};

export enum TrendingTimeWindow {
  Day = 'DAY',
  Week = 'WEEK'
}

export type User = {
  __typename?: 'User';
  collections: Array<Collection>;
  createdAt: Scalars['String']['output'];
  email: Scalars['String']['output'];
  id: Scalars['Int']['output'];
  name: Scalars['String']['output'];
  ratings: Array<Rating>;
  reviews: Array<Review>;
  savedMovies: Array<SavedMovie>;
};

export type YearRange = {
  __typename?: 'YearRange';
  max: Scalars['Int']['output'];
  min: Scalars['Int']['output'];
};

export type RegisterMutationVariables = Exact<{
  email: Scalars['String']['input'];
  password: Scalars['String']['input'];
}>;


export type RegisterMutation = { __typename?: 'Mutation', register: { __typename?: 'AuthPayload', token: string, user: { __typename?: 'User', id: number, email: string, name: string } } };

export type LoginMutationVariables = Exact<{
  email: Scalars['String']['input'];
  password: Scalars['String']['input'];
}>;


export type LoginMutation = { __typename?: 'Mutation', login: { __typename?: 'AuthPayload', token: string, user: { __typename?: 'User', id: number, email: string, name: string } } };

export type CollectionsQueryVariables = Exact<{ [key: string]: never; }>;


export type CollectionsQuery = { __typename?: 'Query', collections: Array<{ __typename?: 'Collection', id: number, name: string, description?: string | null, isPublic: boolean, createdAt: string, updatedAt: string, movieCount: number, user: { __typename?: 'User', id: number, email: string, name: string }, movies: Array<{ __typename?: 'CollectionMovie', id: number, tmdbId: number, addedAt: string, movie?: { __typename?: 'Movie', id: number, title: string, posterUrl?: string | null, releaseDate?: string | null } | null }> }> };

export type GetCollectionQueryVariables = Exact<{
  id: Scalars['Int']['input'];
}>;


export type GetCollectionQuery = { __typename?: 'Query', getCollection?: { __typename?: 'Collection', id: number, name: string, description?: string | null, isPublic: boolean, createdAt: string, updatedAt: string, movieCount: number, user: { __typename?: 'User', id: number, email: string, name: string }, movies: Array<{ __typename?: 'CollectionMovie', id: number, tmdbId: number, addedAt: string, movie?: { __typename?: 'Movie', id: number, title: string, overview?: string | null, posterUrl?: string | null, releaseDate?: string | null, voteAverage?: number | null } | null }>, insights: { __typename?: 'CollectionInsights', totalMovies: number, uniqueGenres: number, uniqueActors: number, uniqueCrew: number, averageRuntime?: number | null, averageVoteAverage?: number | null, moviesByGenre: Array<{ __typename?: 'GenreCount', count: number, genre: { __typename?: 'Genre', id: number, name: string } }>, topActors: Array<{ __typename?: 'PersonCount', count: number, person: { __typename?: 'Person', id: number, name: string, profileUrl?: string | null } }>, topCrew: Array<{ __typename?: 'PersonCount', count: number, person: { __typename?: 'Person', id: number, name: string, profileUrl?: string | null } }>, yearRange?: { __typename?: 'YearRange', min: number, max: number } | null } } | null };

export type CreateCollectionMutationVariables = Exact<{
  name: Scalars['String']['input'];
  description?: InputMaybe<Scalars['String']['input']>;
  isPublic?: InputMaybe<Scalars['Boolean']['input']>;
}>;


export type CreateCollectionMutation = { __typename?: 'Mutation', createCollection: { __typename?: 'Collection', id: number, name: string, description?: string | null, isPublic: boolean, createdAt: string, updatedAt: string, movieCount: number, user: { __typename?: 'User', id: number, email: string, name: string }, movies: Array<{ __typename?: 'CollectionMovie', id: number, tmdbId: number, addedAt: string }> } };

export type UpdateCollectionMutationVariables = Exact<{
  id: Scalars['Int']['input'];
  name?: InputMaybe<Scalars['String']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  isPublic?: InputMaybe<Scalars['Boolean']['input']>;
}>;


export type UpdateCollectionMutation = { __typename?: 'Mutation', updateCollection: { __typename?: 'Collection', id: number, name: string, description?: string | null, isPublic: boolean, createdAt: string, updatedAt: string, movieCount: number, user: { __typename?: 'User', id: number, email: string, name: string }, movies: Array<{ __typename?: 'CollectionMovie', id: number, tmdbId: number, addedAt: string }> } };

export type DeleteCollectionMutationVariables = Exact<{
  id: Scalars['Int']['input'];
}>;


export type DeleteCollectionMutation = { __typename?: 'Mutation', deleteCollection: boolean };

export type AddMovieToCollectionMutationVariables = Exact<{
  collectionId: Scalars['Int']['input'];
  tmdbId: Scalars['Int']['input'];
}>;


export type AddMovieToCollectionMutation = { __typename?: 'Mutation', addMovieToCollection: { __typename?: 'CollectionMovie', id: number, tmdbId: number, addedAt: string, movie?: { __typename?: 'Movie', id: number, title: string, posterUrl?: string | null, releaseDate?: string | null } | null } };

export type RemoveMovieFromCollectionMutationVariables = Exact<{
  collectionId: Scalars['Int']['input'];
  tmdbId: Scalars['Int']['input'];
}>;


export type RemoveMovieFromCollectionMutation = { __typename?: 'Mutation', removeMovieFromCollection: boolean };

export type MovieFieldsFragment = { __typename?: 'Movie', id: number, title: string, overview?: string | null, posterUrl?: string | null, releaseDate?: string | null, voteAverage?: number | null, voteCount?: number | null, runtime?: number | null, isSaved: boolean, averageUserRating?: number | null, rating?: { __typename?: 'Rating', id: number, value: number } | null, review?: { __typename?: 'Review', id: number, content: string } | null, inCollections: Array<{ __typename?: 'Collection', id: number, name: string, description?: string | null, isPublic: boolean }>, genres: Array<{ __typename?: 'Genre', id: number, name: string, icon?: string | null }>, trailer?: { __typename?: 'MovieTrailer', key: string, site: string, name?: string | null, type?: string | null, url: string } | null, cast: Array<{ __typename?: 'CastMember', id: number, name: string, character?: string | null, profileUrl?: string | null, order?: number | null }>, crew: Array<{ __typename?: 'CrewMember', id: number, name: string, job?: string | null, department?: string | null, profileUrl?: string | null }>, keywords: Array<{ __typename?: 'Keyword', id: number, name: string }> };

export type SearchKeywordsQueryVariables = Exact<{
  query: Scalars['String']['input'];
  limit?: InputMaybe<Scalars['Int']['input']>;
}>;


export type SearchKeywordsQuery = { __typename?: 'Query', searchKeywords: Array<{ __typename?: 'Keyword', id: number, name: string }> };

export type SuggestMovieQueryVariables = Exact<{
  selectedMovieIds: Array<Scalars['Int']['input']> | Scalars['Int']['input'];
}>;


export type SuggestMovieQuery = { __typename?: 'Query', suggestMovie?: { __typename?: 'Movie', id: number, title: string, overview?: string | null, posterUrl?: string | null, releaseDate?: string | null, voteAverage?: number | null, voteCount?: number | null, runtime?: number | null, isSaved: boolean, averageUserRating?: number | null, rating?: { __typename?: 'Rating', id: number, value: number } | null, review?: { __typename?: 'Review', id: number, content: string } | null, inCollections: Array<{ __typename?: 'Collection', id: number, name: string, description?: string | null, isPublic: boolean }>, genres: Array<{ __typename?: 'Genre', id: number, name: string, icon?: string | null }>, trailer?: { __typename?: 'MovieTrailer', key: string, site: string, name?: string | null, type?: string | null, url: string } | null, cast: Array<{ __typename?: 'CastMember', id: number, name: string, character?: string | null, profileUrl?: string | null, order?: number | null }>, crew: Array<{ __typename?: 'CrewMember', id: number, name: string, job?: string | null, department?: string | null, profileUrl?: string | null }>, keywords: Array<{ __typename?: 'Keyword', id: number, name: string }> } | null };

export type SuggestMovieRoundQueryVariables = Exact<{
  round: Scalars['Int']['input'];
  selectedMovieIds?: InputMaybe<Array<Scalars['Int']['input']> | Scalars['Int']['input']>;
}>;


export type SuggestMovieRoundQuery = { __typename?: 'Query', suggestMovieRound: { __typename?: 'SuggestMovieRoundResult', category: string, categoryLabel: string, movies: Array<{ __typename?: 'Movie', id: number, title: string, overview?: string | null, posterUrl?: string | null, releaseDate?: string | null, voteAverage?: number | null, voteCount?: number | null, runtime?: number | null, isSaved: boolean, averageUserRating?: number | null, rating?: { __typename?: 'Rating', id: number, value: number } | null, review?: { __typename?: 'Review', id: number, content: string } | null, inCollections: Array<{ __typename?: 'Collection', id: number, name: string, description?: string | null, isPublic: boolean }>, genres: Array<{ __typename?: 'Genre', id: number, name: string, icon?: string | null }>, trailer?: { __typename?: 'MovieTrailer', key: string, site: string, name?: string | null, type?: string | null, url: string } | null, cast: Array<{ __typename?: 'CastMember', id: number, name: string, character?: string | null, profileUrl?: string | null, order?: number | null }>, crew: Array<{ __typename?: 'CrewMember', id: number, name: string, job?: string | null, department?: string | null, profileUrl?: string | null }>, keywords: Array<{ __typename?: 'Keyword', id: number, name: string }> }> } };

export type GetMovieQueryVariables = Exact<{
  id: Scalars['Int']['input'];
}>;


export type GetMovieQuery = { __typename?: 'Query', getMovie?: { __typename?: 'Movie', id: number, title: string, overview?: string | null, posterUrl?: string | null, releaseDate?: string | null, voteAverage?: number | null, voteCount?: number | null, runtime?: number | null, isSaved: boolean, averageUserRating?: number | null, reviews: Array<{ __typename?: 'Review', id: number, content: string, createdAt: string, user: { __typename?: 'User', id: number, email: string, name: string } }>, ratings: Array<{ __typename?: 'Rating', id: number, value: number, createdAt: string, user: { __typename?: 'User', id: number, email: string, name: string } }>, rating?: { __typename?: 'Rating', id: number, value: number } | null, review?: { __typename?: 'Review', id: number, content: string } | null, inCollections: Array<{ __typename?: 'Collection', id: number, name: string, description?: string | null, isPublic: boolean }>, genres: Array<{ __typename?: 'Genre', id: number, name: string, icon?: string | null }>, trailer?: { __typename?: 'MovieTrailer', key: string, site: string, name?: string | null, type?: string | null, url: string } | null, cast: Array<{ __typename?: 'CastMember', id: number, name: string, character?: string | null, profileUrl?: string | null, order?: number | null }>, crew: Array<{ __typename?: 'CrewMember', id: number, name: string, job?: string | null, department?: string | null, profileUrl?: string | null }>, keywords: Array<{ __typename?: 'Keyword', id: number, name: string }> } | null };

export type SearchMoviesQueryVariables = Exact<{
  query: Scalars['String']['input'];
  limit?: InputMaybe<Scalars['Int']['input']>;
}>;


export type SearchMoviesQuery = { __typename?: 'Query', searchMovies: Array<{ __typename?: 'Movie', id: number, title: string, posterUrl?: string | null, releaseDate?: string | null, voteAverage?: number | null, genres: Array<{ __typename?: 'Genre', id: number, name: string }> }> };

export type RandomMovieFromSourceQueryVariables = Exact<{
  options?: InputMaybe<TmdbOptionsInput>;
  source?: InputMaybe<MovieSource>;
}>;


export type RandomMovieFromSourceQuery = { __typename?: 'Query', randomMovieFromSource?: { __typename?: 'Movie', id: number, title: string, overview?: string | null, posterUrl?: string | null, releaseDate?: string | null, voteAverage?: number | null, voteCount?: number | null, runtime?: number | null, isSaved: boolean, averageUserRating?: number | null, rating?: { __typename?: 'Rating', id: number, value: number } | null, review?: { __typename?: 'Review', id: number, content: string } | null, inCollections: Array<{ __typename?: 'Collection', id: number, name: string, description?: string | null, isPublic: boolean }>, genres: Array<{ __typename?: 'Genre', id: number, name: string, icon?: string | null }>, trailer?: { __typename?: 'MovieTrailer', key: string, site: string, name?: string | null, type?: string | null, url: string } | null, cast: Array<{ __typename?: 'CastMember', id: number, name: string, character?: string | null, profileUrl?: string | null, order?: number | null }>, crew: Array<{ __typename?: 'CrewMember', id: number, name: string, job?: string | null, department?: string | null, profileUrl?: string | null }>, keywords: Array<{ __typename?: 'Keyword', id: number, name: string }> } | null };

export type ShuffleMovieQueryVariables = Exact<{
  genres?: InputMaybe<Array<Scalars['Int']['input']> | Scalars['Int']['input']>;
  yearRange?: InputMaybe<Array<Scalars['Int']['input']> | Scalars['Int']['input']>;
  cast?: InputMaybe<Array<Scalars['Int']['input']> | Scalars['Int']['input']>;
  crew?: InputMaybe<Array<Scalars['Int']['input']> | Scalars['Int']['input']>;
  minVoteAverage?: InputMaybe<Scalars['Float']['input']>;
  minVoteCount?: InputMaybe<Scalars['Int']['input']>;
  runtimeRange?: InputMaybe<Array<Scalars['Int']['input']> | Scalars['Int']['input']>;
  originalLanguage?: InputMaybe<Scalars['String']['input']>;
  watchProviders?: InputMaybe<Scalars['String']['input']>;
  excludeGenres?: InputMaybe<Array<Scalars['Int']['input']> | Scalars['Int']['input']>;
  excludeCast?: InputMaybe<Array<Scalars['Int']['input']> | Scalars['Int']['input']>;
  excludeCrew?: InputMaybe<Array<Scalars['Int']['input']> | Scalars['Int']['input']>;
  popularityRange?: InputMaybe<Array<Scalars['Float']['input']> | Scalars['Float']['input']>;
  originCountries?: InputMaybe<Array<Scalars['String']['input']> | Scalars['String']['input']>;
  inCollections?: InputMaybe<Array<Scalars['Int']['input']> | Scalars['Int']['input']>;
  excludeCollections?: InputMaybe<Array<Scalars['Int']['input']> | Scalars['Int']['input']>;
  notInAnyCollection?: InputMaybe<Scalars['Boolean']['input']>;
  keywordIds?: InputMaybe<Array<Scalars['Int']['input']> | Scalars['Int']['input']>;
}>;


export type ShuffleMovieQuery = { __typename?: 'Query', shuffleMovie?: { __typename?: 'Movie', id: number, title: string, overview?: string | null, posterUrl?: string | null, releaseDate?: string | null, voteAverage?: number | null, voteCount?: number | null, runtime?: number | null, isSaved: boolean, averageUserRating?: number | null, rating?: { __typename?: 'Rating', id: number, value: number } | null, review?: { __typename?: 'Review', id: number, content: string } | null, inCollections: Array<{ __typename?: 'Collection', id: number, name: string, description?: string | null, isPublic: boolean }>, genres: Array<{ __typename?: 'Genre', id: number, name: string, icon?: string | null }>, trailer?: { __typename?: 'MovieTrailer', key: string, site: string, name?: string | null, type?: string | null, url: string } | null, cast: Array<{ __typename?: 'CastMember', id: number, name: string, character?: string | null, profileUrl?: string | null, order?: number | null }>, crew: Array<{ __typename?: 'CrewMember', id: number, name: string, job?: string | null, department?: string | null, profileUrl?: string | null }>, keywords: Array<{ __typename?: 'Keyword', id: number, name: string }> } | null };

export type DiscoverMoviesQueryVariables = Exact<{
  genres?: InputMaybe<Array<Scalars['Int']['input']> | Scalars['Int']['input']>;
  yearRange?: InputMaybe<Array<Scalars['Int']['input']> | Scalars['Int']['input']>;
  cast?: InputMaybe<Array<Scalars['Int']['input']> | Scalars['Int']['input']>;
  crew?: InputMaybe<Array<Scalars['Int']['input']> | Scalars['Int']['input']>;
}>;


export type DiscoverMoviesQuery = { __typename?: 'Query', discoverMovies: Array<{ __typename?: 'Movie', id: number, title: string, overview?: string | null, posterUrl?: string | null, releaseDate?: string | null, voteAverage?: number | null, voteCount?: number | null, runtime?: number | null, isSaved: boolean, averageUserRating?: number | null, rating?: { __typename?: 'Rating', id: number, value: number } | null, review?: { __typename?: 'Review', id: number, content: string } | null, inCollections: Array<{ __typename?: 'Collection', id: number, name: string, description?: string | null, isPublic: boolean }>, genres: Array<{ __typename?: 'Genre', id: number, name: string, icon?: string | null }>, trailer?: { __typename?: 'MovieTrailer', key: string, site: string, name?: string | null, type?: string | null, url: string } | null, cast: Array<{ __typename?: 'CastMember', id: number, name: string, character?: string | null, profileUrl?: string | null, order?: number | null }>, crew: Array<{ __typename?: 'CrewMember', id: number, name: string, job?: string | null, department?: string | null, profileUrl?: string | null }>, keywords: Array<{ __typename?: 'Keyword', id: number, name: string }> }> };

export type NowPlayingMoviesQueryVariables = Exact<{
  options?: InputMaybe<TmdbOptionsInput>;
}>;


export type NowPlayingMoviesQuery = { __typename?: 'Query', nowPlayingMovies: Array<{ __typename?: 'Movie', id: number, title: string, overview?: string | null, posterUrl?: string | null, releaseDate?: string | null, voteAverage?: number | null, voteCount?: number | null, runtime?: number | null, isSaved: boolean, averageUserRating?: number | null, rating?: { __typename?: 'Rating', id: number, value: number } | null, review?: { __typename?: 'Review', id: number, content: string } | null, inCollections: Array<{ __typename?: 'Collection', id: number, name: string, description?: string | null, isPublic: boolean }>, genres: Array<{ __typename?: 'Genre', id: number, name: string, icon?: string | null }>, trailer?: { __typename?: 'MovieTrailer', key: string, site: string, name?: string | null, type?: string | null, url: string } | null, cast: Array<{ __typename?: 'CastMember', id: number, name: string, character?: string | null, profileUrl?: string | null, order?: number | null }>, crew: Array<{ __typename?: 'CrewMember', id: number, name: string, job?: string | null, department?: string | null, profileUrl?: string | null }>, keywords: Array<{ __typename?: 'Keyword', id: number, name: string }> }> };

export type PopularMoviesQueryVariables = Exact<{
  options?: InputMaybe<TmdbOptionsInput>;
}>;


export type PopularMoviesQuery = { __typename?: 'Query', popularMovies: Array<{ __typename?: 'Movie', id: number, title: string, overview?: string | null, posterUrl?: string | null, releaseDate?: string | null, voteAverage?: number | null, voteCount?: number | null, runtime?: number | null, isSaved: boolean, averageUserRating?: number | null, rating?: { __typename?: 'Rating', id: number, value: number } | null, review?: { __typename?: 'Review', id: number, content: string } | null, inCollections: Array<{ __typename?: 'Collection', id: number, name: string, description?: string | null, isPublic: boolean }>, genres: Array<{ __typename?: 'Genre', id: number, name: string, icon?: string | null }>, trailer?: { __typename?: 'MovieTrailer', key: string, site: string, name?: string | null, type?: string | null, url: string } | null, cast: Array<{ __typename?: 'CastMember', id: number, name: string, character?: string | null, profileUrl?: string | null, order?: number | null }>, crew: Array<{ __typename?: 'CrewMember', id: number, name: string, job?: string | null, department?: string | null, profileUrl?: string | null }>, keywords: Array<{ __typename?: 'Keyword', id: number, name: string }> }> };

export type TopRatedMoviesQueryVariables = Exact<{
  options?: InputMaybe<TmdbOptionsInput>;
}>;


export type TopRatedMoviesQuery = { __typename?: 'Query', topRatedMovies: Array<{ __typename?: 'Movie', id: number, title: string, overview?: string | null, posterUrl?: string | null, releaseDate?: string | null, voteAverage?: number | null, voteCount?: number | null, runtime?: number | null, isSaved: boolean, averageUserRating?: number | null, rating?: { __typename?: 'Rating', id: number, value: number } | null, review?: { __typename?: 'Review', id: number, content: string } | null, inCollections: Array<{ __typename?: 'Collection', id: number, name: string, description?: string | null, isPublic: boolean }>, genres: Array<{ __typename?: 'Genre', id: number, name: string, icon?: string | null }>, trailer?: { __typename?: 'MovieTrailer', key: string, site: string, name?: string | null, type?: string | null, url: string } | null, cast: Array<{ __typename?: 'CastMember', id: number, name: string, character?: string | null, profileUrl?: string | null, order?: number | null }>, crew: Array<{ __typename?: 'CrewMember', id: number, name: string, job?: string | null, department?: string | null, profileUrl?: string | null }>, keywords: Array<{ __typename?: 'Keyword', id: number, name: string }> }> };

export type MovieSelectionOptionsQueryVariables = Exact<{ [key: string]: never; }>;


export type MovieSelectionOptionsQuery = { __typename?: 'Query', movieSelectionOptions: { __typename?: 'MovieSelectionOptions', genres: Array<{ __typename?: 'Genre', id: number, name: string, icon?: string | null }>, moods: Array<{ __typename?: 'MoodOption', id: string, label: string, icon?: string | null }>, eras: Array<{ __typename?: 'EraOption', id: string, label: string, value: string, icon?: string | null }> } };

export type ActorsFromFeaturedMoviesQueryVariables = Exact<{
  options?: InputMaybe<TmdbOptionsInput>;
}>;


export type ActorsFromFeaturedMoviesQuery = { __typename?: 'Query', actorsFromFeaturedMovies: Array<{ __typename?: 'Person', id: number, name: string, profileUrl?: string | null, knownForDepartment?: string | null, popularity?: number | null }> };

export type CrewFromFeaturedMoviesQueryVariables = Exact<{
  options?: InputMaybe<TmdbOptionsInput>;
}>;


export type CrewFromFeaturedMoviesQuery = { __typename?: 'Query', crewFromFeaturedMovies: Array<{ __typename?: 'Person', id: number, name: string, profileUrl?: string | null, knownForDepartment?: string | null, popularity?: number | null }> };

export type SuggestHistoryQueryVariables = Exact<{ [key: string]: never; }>;


export type SuggestHistoryQuery = { __typename?: 'Query', suggestHistory: Array<{ __typename?: 'Movie', id: number, title: string, overview?: string | null, posterUrl?: string | null, releaseDate?: string | null, voteAverage?: number | null, voteCount?: number | null, runtime?: number | null, isSaved: boolean, averageUserRating?: number | null, rating?: { __typename?: 'Rating', id: number, value: number } | null, review?: { __typename?: 'Review', id: number, content: string } | null, inCollections: Array<{ __typename?: 'Collection', id: number, name: string, description?: string | null, isPublic: boolean }>, genres: Array<{ __typename?: 'Genre', id: number, name: string, icon?: string | null }>, trailer?: { __typename?: 'MovieTrailer', key: string, site: string, name?: string | null, type?: string | null, url: string } | null, cast: Array<{ __typename?: 'CastMember', id: number, name: string, character?: string | null, profileUrl?: string | null, order?: number | null }>, crew: Array<{ __typename?: 'CrewMember', id: number, name: string, job?: string | null, department?: string | null, profileUrl?: string | null }>, keywords: Array<{ __typename?: 'Keyword', id: number, name: string }> }> };

export type GetPersonQueryVariables = Exact<{
  id: Scalars['Int']['input'];
}>;


export type GetPersonQuery = { __typename?: 'Query', getPerson?: { __typename?: 'Person', id: number, name: string, biography?: string | null, profileUrl?: string | null, birthday?: string | null, placeOfBirth?: string | null, knownForDepartment?: string | null, popularity?: number | null, movies: Array<{ __typename?: 'Movie', id: number, title: string, posterUrl?: string | null, releaseDate?: string | null, voteAverage?: number | null }> } | null };

export type SearchPeopleQueryVariables = Exact<{
  query: Scalars['String']['input'];
  roleType?: InputMaybe<PersonRoleType>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  options?: InputMaybe<TmdbOptionsInput>;
}>;


export type SearchPeopleQuery = { __typename?: 'Query', searchPeople: Array<{ __typename?: 'Person', id: number, name: string, profileUrl?: string | null, knownForDepartment?: string | null, popularity?: number | null, biography?: string | null, birthday?: string | null, placeOfBirth?: string | null }> };

export type RandomActorFromSourceQueryVariables = Exact<{
  options?: InputMaybe<TmdbOptionsInput>;
  source?: InputMaybe<MovieSource>;
}>;


export type RandomActorFromSourceQuery = { __typename?: 'Query', randomActorFromSource?: { __typename?: 'Person', id: number, name: string, profileUrl?: string | null, biography?: string | null, birthday?: string | null, placeOfBirth?: string | null, knownForDepartment?: string | null, popularity?: number | null } | null };

export type TrendingPeopleQueryVariables = Exact<{
  roleType?: InputMaybe<PersonRoleType>;
}>;


export type TrendingPeopleQuery = { __typename?: 'Query', trendingPeople: Array<{ __typename?: 'Person', id: number, name: string, biography?: string | null, profileUrl?: string | null, birthday?: string | null, placeOfBirth?: string | null, knownForDepartment?: string | null, popularity?: number | null }> };

export type MeQueryVariables = Exact<{ [key: string]: never; }>;


export type MeQuery = { __typename?: 'Query', me?: { __typename?: 'User', id: number, email: string, name: string, createdAt: string, ratings: Array<{ __typename?: 'Rating', id: number, tmdbId: number, value: number, createdAt: string, updatedAt: string, movie?: { __typename?: 'Movie', id: number, title: string, posterUrl?: string | null } | null }>, reviews: Array<{ __typename?: 'Review', id: number, tmdbId: number, content: string, createdAt: string, updatedAt: string, movie?: { __typename?: 'Movie', id: number, title: string, posterUrl?: string | null } | null }>, collections: Array<{ __typename?: 'Collection', id: number, name: string, description?: string | null, isPublic: boolean, movieCount: number }> } | null };

export type RatingsQueryVariables = Exact<{ [key: string]: never; }>;


export type RatingsQuery = { __typename?: 'Query', ratings: Array<{ __typename?: 'Rating', id: number, tmdbId: number, value: number, createdAt: string, updatedAt: string, movie?: { __typename?: 'Movie', id: number, title: string, overview?: string | null, posterUrl?: string | null, releaseDate?: string | null, voteAverage?: number | null } | null, user: { __typename?: 'User', id: number, email: string, name: string } }> };

export type ReviewsQueryVariables = Exact<{ [key: string]: never; }>;


export type ReviewsQuery = { __typename?: 'Query', reviews: Array<{ __typename?: 'Review', id: number, tmdbId: number, content: string, createdAt: string, updatedAt: string, movie?: { __typename?: 'Movie', id: number, title: string, overview?: string | null, posterUrl?: string | null, releaseDate?: string | null, voteAverage?: number | null } | null, user: { __typename?: 'User', id: number, email: string, name: string } }> };

export type RateMovieMutationVariables = Exact<{
  tmdbId: Scalars['Int']['input'];
  rating: Scalars['Int']['input'];
}>;


export type RateMovieMutation = { __typename?: 'Mutation', rateMovie: { __typename?: 'Rating', id: number, tmdbId: number, value: number, createdAt: string, updatedAt: string, movie?: { __typename?: 'Movie', id: number, title: string, posterUrl?: string | null, releaseDate?: string | null } | null, user: { __typename?: 'User', id: number, email: string, name: string } } };

export type ReviewMovieMutationVariables = Exact<{
  tmdbId: Scalars['Int']['input'];
  content: Scalars['String']['input'];
}>;


export type ReviewMovieMutation = { __typename?: 'Mutation', reviewMovie: { __typename?: 'Review', id: number, tmdbId: number, content: string, createdAt: string, updatedAt: string, movie?: { __typename?: 'Movie', id: number, title: string, posterUrl?: string | null, releaseDate?: string | null } | null, user: { __typename?: 'User', id: number, email: string, name: string } } };

export type DeleteReviewMutationVariables = Exact<{
  tmdbId: Scalars['Int']['input'];
}>;


export type DeleteReviewMutation = { __typename?: 'Mutation', deleteReview: boolean };

export type UpdateNameMutationVariables = Exact<{
  name: Scalars['String']['input'];
}>;


export type UpdateNameMutation = { __typename?: 'Mutation', updateName: { __typename?: 'User', id: number, email: string, name: string, createdAt: string } };
