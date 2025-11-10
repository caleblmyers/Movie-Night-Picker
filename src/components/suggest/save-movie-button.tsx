"use client";

import { useEffect, useState } from "react";
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
  const [isSaved, setIsSaved] = useState(false);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    if (session?.user?.id && savedMoviesCollection) {
      setIsSaved(isInCollection(tmdbId));
      setChecking(false);
    } else if (!session?.user?.id) {
      setChecking(false);
    }
  }, [session?.user?.id, tmdbId, savedMoviesCollection, isInCollection]);

  const handleSave = async () => {
    if (!session?.user?.id || !savedMoviesCollection) {
      return;
    }

    await toggleMovie(tmdbId);
    setIsSaved(!isSaved);
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

