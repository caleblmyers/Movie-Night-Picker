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

  if (status === "loading" || loading) {
    return <LoadingState message="Loading profile..." />;
  }

  if (status === "unauthenticated") {
    return (
      <div className="min-h-screen bg-gradient-to-b from-background via-background to-muted/20 flex items-center justify-center px-4 py-16">
        <div className="text-center space-y-6 max-w-md">
          <h1 className="text-5xl font-bold tracking-tight bg-gradient-to-r from-primary via-primary/80 to-primary bg-clip-text text-transparent">
            Join the Show
          </h1>
          <p className="text-muted-foreground text-lg">
            Sign in to view your saved movies, ratings, and reviews
          </p>
          <div className="flex gap-4 justify-center pt-4">
            <Button asChild size="lg" className="bg-gradient-to-r from-primary to-primary/80">
              <Link href="/login">Sign In</Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="/register">Sign Up</Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-muted/20 px-4 py-16">
      <main className="w-full max-w-6xl mx-auto space-y-8">
        <div className="text-center space-y-4">
          <h1 className="text-5xl font-bold tracking-tight bg-gradient-to-r from-primary via-primary/80 to-primary bg-clip-text text-transparent">
            Your Profile
          </h1>
          <div className="space-y-2">
            <p className="text-xl text-foreground font-medium">
              {session?.user?.name || "Movie Enthusiast"}
            </p>
            <p className="text-muted-foreground">{session?.user?.email}</p>
          </div>
        </div>

        <div className="space-y-6">
          <div>
            <h2 className="text-2xl font-bold mb-4">Saved Movies</h2>
            {savedMovies.length === 0 ? (
              <div className="bg-card/50 backdrop-blur-sm border rounded-lg p-12 text-center space-y-6">
                <p className="text-muted-foreground text-lg">
                  Your movie collection is empty. Start building your watchlist!
                </p>
                <div className="flex gap-4 justify-center">
                  <Button asChild className="bg-gradient-to-r from-primary to-primary/80">
                    <Link href="/suggest">Get Suggestions</Link>
                  </Button>
                  <Button asChild variant="outline">
                    <Link href="/shuffle">Shuffle Movies</Link>
                  </Button>
                </div>
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
             await fetch(`/api/movies/unsave?tmdbId=${savedMovie.tmdbId}`, {
               method: "DELETE",
             });
             onUnsave();
           } catch {
             // Error is handled silently - user can try again
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
        <p className="text-xs text-muted-foreground pt-2 border-t">
          Data from{" "}
          <a
            href="https://www.themoviedb.org"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#01b4e4] hover:underline"
          >
            TMDB
          </a>
        </p>
      </div>
    </div>
  );
}

