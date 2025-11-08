"use client";

import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { useQuery } from "@apollo/client/react";
import { GET_MOVIE } from "@/lib/graphql/queries";
import { Movie } from "@/types/suggest";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { LoadingState } from "@/components/shared/loading-state";
import { RatingReviewSection } from "@/components/suggest/rating-review-section";

interface SavedMovie {
  id: string;
  tmdbId: number;
  createdAt: string;
  rating?: { value: number };
  review?: { content: string };
}

export default function ProfilePage() {
  const { data: session, status } = useSession();
  const [savedMovies, setSavedMovies] = useState<SavedMovie[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchSavedMovies = async () => {
    try {
      const response = await fetch("/api/movies/saved");
      if (response.ok) {
        const data = await response.json();
        setSavedMovies(data);
      }
    } catch (error) {
      console.error("Error fetching saved movies:", error);
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status, session?.user?.id]);

  if (status === "loading" || loading) {
    return <LoadingState message="Loading profile..." />;
  }

  if (status === "unauthenticated") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background px-4 py-16">
        <div className="text-center space-y-4">
          <h1 className="text-4xl font-bold tracking-tight text-foreground">
            Please Sign In
          </h1>
          <p className="text-muted-foreground">
            You need to be signed in to view your profile.
          </p>
          <div className="flex gap-4 justify-center">
            <Button asChild>
              <Link href="/login">Sign In</Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/register">Sign Up</Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4 py-16">
      <main className="w-full max-w-6xl space-y-8">
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold tracking-tight text-foreground">
            Your Profile
          </h1>
          <div className="space-y-1">
            <p className="text-lg text-foreground">
              {session?.user?.name || "User"}
            </p>
            <p className="text-muted-foreground">{session?.user?.email}</p>
          </div>
        </div>

        <div className="space-y-6">
          <div>
            <h2 className="text-2xl font-bold mb-4">Saved Movies</h2>
            {savedMovies.length === 0 ? (
              <div className="bg-card border rounded-lg p-8 text-center">
                <p className="text-muted-foreground mb-4">
                  You haven&apos;t saved any movies yet.
                </p>
                <Button asChild>
                  <Link href="/suggest">Find a Movie</Link>
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {savedMovies.map((savedMovie) => (
                  <SavedMovieCard
                    key={savedMovie.id}
                    savedMovie={savedMovie}
                    onUnsave={fetchSavedMovies}
                  />
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

function SavedMovieCard({
  savedMovie,
  onUnsave,
}: {
  savedMovie: SavedMovie;
  onUnsave: () => void;
}) {
  const { data, loading, error } = useQuery<{ getMovie: Movie }>(GET_MOVIE, {
    variables: { id: savedMovie.tmdbId },
    skip: !savedMovie.tmdbId,
  });

  const handleUnsave = async () => {
    try {
      const response = await fetch(
        `/api/movies/unsave?tmdbId=${savedMovie.tmdbId}`,
        {
          method: "DELETE",
        }
      );
      if (response.ok) {
        onUnsave();
      }
    } catch (error) {
      console.error("Error unsaving movie:", error);
    }
  };

  if (loading) {
    return (
      <div className="bg-card border rounded-lg p-4 animate-pulse">
        <div className="h-64 bg-muted rounded mb-4" />
        <div className="h-4 bg-muted rounded w-3/4 mb-2" />
        <div className="h-4 bg-muted rounded w-1/2" />
      </div>
    );
  }

  if (error || !data?.getMovie) {
    return (
      <div className="bg-card border rounded-lg p-4">
        <p className="text-muted-foreground">Failed to load movie</p>
      </div>
    );
  }

  const movie = data.getMovie;
  const posterUrl = movie.posterUrl || "/placeholder-poster.jpg";
  const releaseYear = movie.releaseDate
    ? new Date(movie.releaseDate).getFullYear()
    : null;

  return (
    <div className="bg-card border rounded-lg p-4 space-y-4">
      <div className="relative aspect-[2/3] w-full overflow-hidden rounded-lg">
        <Image
          src={posterUrl}
          alt={movie.title}
          fill
          className="object-cover"
          unoptimized
        />
      </div>
      <div className="space-y-2">
        <h3 className="font-bold text-lg">{movie.title}</h3>
        {releaseYear && (
          <p className="text-sm text-muted-foreground">{releaseYear}</p>
        )}
        {savedMovie.rating && (
          <div className="flex items-center gap-2 text-sm">
            <span className="text-muted-foreground">Your Rating:</span>
            <span className="font-semibold">{savedMovie.rating.value}/10</span>
          </div>
        )}
        {savedMovie.review && (
          <div className="text-sm">
            <p className="text-muted-foreground mb-1">Your Review:</p>
            <p className="line-clamp-2">{savedMovie.review.content}</p>
          </div>
        )}
      </div>
      <div className="space-y-2">
        <Button
          variant="outline"
          size="sm"
          onClick={handleUnsave}
          className="w-full"
        >
          Remove from Saved
        </Button>
        <RatingReviewSection tmdbId={savedMovie.tmdbId} />
      </div>
    </div>
  );
}

