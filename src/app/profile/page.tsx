"use client";

import { useSession } from "next-auth/react";
import { LoadingState } from "@/components/shared/loading-state";
import { SavedMovieCard } from "@/components/profile/saved-movie-card";
import { UnauthenticatedProfile } from "@/components/profile/unauthenticated-profile";
import { EmptySavedMovies } from "@/components/profile/empty-saved-movies";
import { useSavedMovies } from "@/hooks/use-saved-movies";

export default function ProfilePage() {
  const { data: session } = useSession();
  const { savedMovies, loading, refetch, isAuthenticated, isLoading } =
    useSavedMovies();

  if (isLoading) {
    return <LoadingState message="Loading profile..." />;
  }

  if (!isAuthenticated) {
    return <UnauthenticatedProfile />;
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
              <EmptySavedMovies />
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {savedMovies.map((savedMovie) => (
                  <SavedMovieCard
                    key={savedMovie.id}
                    savedMovie={savedMovie}
                    onUnsave={refetch}
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

