import { useMemo } from "react";
import { useQuery } from "@apollo/client/react";
import {
  MOVIE_SELECTION_OPTIONS,
  ACTORS_FROM_FEATURED_MOVIES,
  CREW_FROM_FEATURED_MOVIES,
} from "@/lib/graphql";
import { SelectionOption } from "@/types/suggest";

/**
 * Genre from backend
 */
interface Genre {
  id: string;
  name: string;
}

/**
 * Mood from backend
 */
interface Mood {
  id: string;
  label: string;
}

/**
 * Era from backend
 */
interface Era {
  id: string;
  label: string;
  value: string;
}

/**
 * Person from backend
 */
interface Person {
  id: number;
  name: string;
  profileUrl?: string;
  knownForDepartment?: string;
  popularity?: number;
}

/**
 * Selection options response from backend
 */
interface SelectionOptionsData {
  movieSelectionOptions: {
    genres: Genre[];
    moods: Mood[];
    eras: Era[];
  };
}

/**
 * Hook to load all selection options from the backend
 * Loads genres, moods, eras, actors, and crew upfront
 */
export function useSelectionOptions() {

  // Load genres, moods, and eras
  const { data: selectionData, loading: loadingSelection } = useQuery<SelectionOptionsData>(
    MOVIE_SELECTION_OPTIONS,
    {
      fetchPolicy: "cache-first", // Cache these as they don't change often
    }
  );

  // Load actors from featured movies
  const { data: actorsData, loading: loadingActors } = useQuery<{
    actorsFromFeaturedMovies: Person[];
  }>(ACTORS_FROM_FEATURED_MOVIES, {
    variables: {
      options: { region: "US", language: "en-US" },
    },
    fetchPolicy: "cache-first",
  });

  // Load crew from featured movies
  const { data: crewData, loading: loadingCrew } = useQuery<{
    crewFromFeaturedMovies: Person[];
  }>(CREW_FROM_FEATURED_MOVIES, {
    variables: {
      options: { region: "US", language: "en-US" },
    },
    fetchPolicy: "cache-first",
  });

  // Process genres, moods, and eras when data is loaded
  const allGenres = useMemo(() => {
    if (!selectionData?.movieSelectionOptions) return [];
    return selectionData.movieSelectionOptions.genres.map((genre) => ({
      id: genre.id,
      type: "genre" as const,
      label: genre.name,
      value: genre.id,
    }));
  }, [selectionData]);

  const allMoods = useMemo(() => {
    if (!selectionData?.movieSelectionOptions) return [];
    return selectionData.movieSelectionOptions.moods.map((mood) => ({
      id: mood.id,
      type: "mood" as const,
      label: mood.label,
      value: mood.id,
    }));
  }, [selectionData]);

  const allEras = useMemo(() => {
    if (!selectionData?.movieSelectionOptions) return [];
    return selectionData.movieSelectionOptions.eras.map((era) => ({
      id: era.id,
      type: "era" as const,
      label: era.label,
      value: era.value,
    }));
  }, [selectionData]);

  // Process actors when data is loaded
  const allActors = useMemo(() => {
    if (!actorsData?.actorsFromFeaturedMovies) return [];
    return actorsData.actorsFromFeaturedMovies.map((actor) => ({
      id: actor.id.toString(),
      type: "actor" as const,
      label: actor.name,
      value: actor.id.toString(),
      imageUrl: actor.profileUrl || undefined,
    }));
  }, [actorsData]);

  // Process crew when data is loaded
  const allCrew = useMemo(() => {
    if (!crewData?.crewFromFeaturedMovies) return [];
    return crewData.crewFromFeaturedMovies.map((crew) => ({
      id: crew.id.toString(),
      type: "director" as const,
      label: crew.name,
      value: crew.id.toString(),
      imageUrl: crew.profileUrl || undefined,
    }));
  }, [crewData]);

  // Compute loading state
  const loading = useMemo(
    () => loadingSelection || loadingActors || loadingCrew,
    [loadingSelection, loadingActors, loadingCrew]
  );

  return {
    allGenres,
    allMoods,
    allEras,
    allActors,
    allCrew,
    loading,
  };
}

