import { useQuery, useMutation } from "@apollo/client/react";
import { COLLECTIONS, ADD_MOVIE_TO_COLLECTION, REMOVE_MOVIE_FROM_COLLECTION } from "@/lib/graphql";
import { Collection } from "@/types/suggest";
import { useMemo } from "react";

const SAVED_MOVIES_COLLECTION_NAME = "Saved Movies";

/**
 * Hook to get or find the "Saved Movies" collection
 * Returns the collection if it exists, or null if not found
 */
export function useSavedMoviesCollection() {
  const { data, loading, error, refetch } = useQuery<{ collections: Collection[] }>(COLLECTIONS);

  const savedMoviesCollection = useMemo(() => {
    if (!data?.collections) return null;
    return data.collections.find((c) => c.name === SAVED_MOVIES_COLLECTION_NAME) || null;
  }, [data]);

  return {
    savedMoviesCollection,
    loading,
    error,
    refetch,
  };
}

/**
 * Hook to add/remove movies from the Saved Movies collection
 */
export function useSaveMovieToCollection() {
  const { savedMoviesCollection } = useSavedMoviesCollection();

  const [addMovie, { loading: adding }] = useMutation(ADD_MOVIE_TO_COLLECTION, {
    refetchQueries: [{ query: COLLECTIONS }],
  });

  const [removeMovie, { loading: removing }] = useMutation(REMOVE_MOVIE_FROM_COLLECTION, {
    refetchQueries: [{ query: COLLECTIONS }],
  });

  const isInCollection = (tmdbId: number): boolean => {
    if (!savedMoviesCollection?.movies) return false;
    return savedMoviesCollection.movies.some((m) => m.tmdbId === tmdbId);
  };

  const toggleMovie = async (tmdbId: number) => {
    if (!savedMoviesCollection) {
      console.error("Saved Movies collection not found");
      return;
    }

    const isIn = isInCollection(tmdbId);
    if (isIn) {
      await removeMovie({
        variables: { collectionId: savedMoviesCollection.id, tmdbId },
      });
    } else {
      await addMovie({
        variables: { collectionId: savedMoviesCollection.id, tmdbId },
      });
    }
  };

  return {
    isInCollection,
    toggleMovie,
    loading: adding || removing,
    savedMoviesCollection,
  };
}

