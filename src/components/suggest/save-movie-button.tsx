"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Heart, HeartOff } from "lucide-react";
import { apiGet, apiPost, apiDelete } from "@/lib/utils/api-client";
import { logError } from "@/lib/utils/error-handler";

interface SaveMovieButtonProps {
  tmdbId: number;
}

export function SaveMovieButton({ tmdbId }: SaveMovieButtonProps) {
  const { data: session } = useSession();
  const [isSaved, setIsSaved] = useState(false);
  const [loading, setLoading] = useState(false);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    if (session?.user?.id) {
      checkIfSaved();
    } else {
      setChecking(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session?.user?.id, tmdbId]);

  const checkIfSaved = async () => {
    try {
      const data = await apiGet<Array<{ tmdbId: number }>>("/api/movies/saved");
      const saved = data.some((movie) => movie.tmdbId === tmdbId);
      setIsSaved(saved);
    } catch (error) {
      logError(error, "SaveMovieButton.checkIfSaved");
    } finally {
      setChecking(false);
    }
  };

  const handleSave = async () => {
    if (!session?.user?.id) {
      return;
    }

    setLoading(true);
    try {
      if (isSaved) {
        await apiDelete("/api/movies/unsave", { tmdbId: tmdbId.toString() });
        setIsSaved(false);
      } else {
        await apiPost("/api/movies/save", { tmdbId });
        setIsSaved(true);
      }
    } catch (error) {
      logError(error, "SaveMovieButton.handleSave");
    } finally {
      setLoading(false);
    }
  };

  if (!session) {
    return null;
  }

  if (checking) {
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

