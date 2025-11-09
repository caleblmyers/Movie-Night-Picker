"use client";

import { useSession } from "next-auth/react";
import { LoadingState } from "@/components/shared/loading-state";
import { SavedMovieCard } from "@/components/profile/saved-movie-card";
import { UnauthenticatedProfile } from "@/components/profile/unauthenticated-profile";
import { EmptySavedMovies } from "@/components/profile/empty-saved-movies";
import { useSavedMovies } from "@/hooks/use-saved-movies";
import { Button } from "@/components/ui/button";
import { Folder } from "lucide-react";
import Link from "next/link";

export default function ProfilePage() {
  const { data: session } = useSession();
  const { savedMovies, refetch, isAuthenticated, isLoading } = useSavedMovies();

  if (isLoading) {
    return <LoadingState message="Loading profile..." />;
  }

  if (!isAuthenticated) {
    return <UnauthenticatedProfile />;
  }

  return (
    <div className="min-h-screen bg-linear-to-b from-background via-background to-muted/20 px-4 py-16">
      <main className="w-full max-w-6xl mx-auto space-y-8">
        <div className="text-center space-y-4">
          <h1 className="text-5xl font-bold tracking-tight bg-linear-to-r from-primary via-primary/80 to-primary bg-clip-text text-transparent">
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
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold">Saved Movies</h2>
            <Button variant="outline" asChild>
              <Link href="/collections">
                <Folder className="h-4 w-4 mr-2" />
                View Collections
              </Link>
            </Button>
          </div>
          <div>
            {savedMovies.length === 0 ? (
              <EmptySavedMovies />
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {savedMovies.map((savedMovie, index) => (
                  <SavedMovieCard
                    key={savedMovie.id}
                    savedMovie={savedMovie}
                    onUnsave={refetch}
                    priority={index === 0}
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

