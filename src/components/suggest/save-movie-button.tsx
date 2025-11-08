"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Heart, HeartOff } from "lucide-react";

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
      const response = await fetch(`/api/movies/saved`);
      if (response.ok) {
        const data = await response.json();
        const saved = data.some((movie: { tmdbId: number }) => movie.tmdbId === tmdbId);
        setIsSaved(saved);
      }
    } catch (error) {
      console.error("Error checking saved status:", error);
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
        const response = await fetch(`/api/movies/unsave?tmdbId=${tmdbId}`, {
          method: "DELETE",
        });
        if (response.ok) {
          setIsSaved(false);
        }
      } else {
        const response = await fetch("/api/movies/save", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ tmdbId }),
        });
        if (response.ok) {
          setIsSaved(true);
        }
      }
    } catch (error) {
      console.error("Error saving/unsaving movie:", error);
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

