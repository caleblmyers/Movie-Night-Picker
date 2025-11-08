import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";

export interface SavedMovie {
  id: string;
  tmdbId: number;
  createdAt: string;
  rating?: { value: number };
  review?: { content: string };
}

/**
 * Hook for fetching and managing saved movies
 */
export function useSavedMovies() {
  const { data: session, status } = useSession();
  const [savedMovies, setSavedMovies] = useState<SavedMovie[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchSavedMovies = async () => {
    try {
      const data = await fetch("/api/movies/saved").then((res) => res.json());
      setSavedMovies(data);
    } catch {
      // Error is handled silently - user will see empty state
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (status === "authenticated" && session?.user?.id) {
      fetchSavedMovies();
    } else if (status === "unauthenticated") {
      setLoading(false);
    }
  }, [status, session?.user?.id]);

  return {
    savedMovies,
    loading,
    refetch: fetchSavedMovies,
    isAuthenticated: status === "authenticated",
    isLoading: status === "loading" || loading,
  };
}

