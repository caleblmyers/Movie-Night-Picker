"use client";

import { useMemo } from "react";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Heart, HeartOff } from "lucide-react";
import { useSaveMovieToCollection } from "@/hooks/use-saved-movies-collection";

interface SaveMovieButtonProps {
  tmdbId: number;
}

export function SaveMovieButton({ tmdbId }: SaveMovieButtonProps) {
  const { data: session } = useSession();
  const { isInCollection, toggleMovie, loading, savedMoviesCollection } = useSaveMovieToCollection();

  // Derive state instead of using setState in effect
  const isSaved = useMemo(() => {
    if (!session?.user?.id || !savedMoviesCollection) {
      return false;
    }
    return isInCollection(tmdbId);
  }, [session?.user?.id, savedMoviesCollection, isInCollection, tmdbId]);

  const checking = !session?.user?.id || !savedMoviesCollection;

  const handleSave = async () => {
    if (!session?.user?.id || !savedMoviesCollection) {
      return;
    }

    await toggleMovie(tmdbId);
  };

  if (!session) {
    return null;
  }

  if (checking || !savedMoviesCollection) {
    return (
      <Button variant="outline" disabled>
        Loading...
      </Button>
    );
  }

  return (
    <Button
      variant={isSaved ? "default" : "outline"}
      onClick={handleSave}
      disabled={loading}
    >
      {isSaved ? (
        <>
          <HeartOff className="mr-2 h-4 w-4" />
          Saved
        </>
      ) : (
        <>
          <Heart className="mr-2 h-4 w-4" />
          Save Movie
        </>
      )}
    </Button>
  );
}

