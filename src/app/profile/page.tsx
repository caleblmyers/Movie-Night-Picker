"use client";

import { useSession } from "next-auth/react";
import { useQuery } from "@apollo/client/react";
import { LoadingState } from "@/components/shared/loading-state";
import { ErrorState } from "@/components/shared/error-state";
import { UnauthenticatedProfile } from "@/components/profile/unauthenticated-profile";
import { CollectionCard } from "@/components/profile/collection-card";
import { COLLECTIONS } from "@/lib/graphql";
import { Collection } from "@/types/suggest";
import { Button } from "@/components/ui/button";
import { FolderPlus } from "lucide-react";
import { CreateCollectionDialog } from "@/components/collections/create-collection-dialog";

export default function ProfilePage() {
  const { data: session } = useSession();
  const { data, loading, error, refetch } = useQuery<{ collections: Collection[] }>(COLLECTIONS);

  if (loading) {
    return <LoadingState message="Loading profile..." />;
  }

  if (error) {
    return (
      <ErrorState
        message={error.message || "Failed to load collections. Please try again."}
        onRetry={() => refetch()}
      />
    );
  }

  if (!session) {
    return <UnauthenticatedProfile />;
  }

  const collections = data?.collections || [];

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
            <h2 className="text-2xl font-bold">My Collections</h2>
            <CreateCollectionDialog onCollectionCreated={() => refetch()}>
              <Button variant="outline">
                <FolderPlus className="h-4 w-4 mr-2" />
                Create Collection
              </Button>
            </CreateCollectionDialog>
          </div>
          <div>
            {collections.length === 0 ? (
              <div className="text-center py-12 bg-card border rounded-lg">
                <p className="text-muted-foreground mb-4">No collections yet</p>
                <CreateCollectionDialog onCollectionCreated={() => refetch()}>
                  <Button>
                    <FolderPlus className="h-4 w-4 mr-2" />
                    Create Your First Collection
                  </Button>
                </CreateCollectionDialog>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-6">
                {collections.map((collection) => (
                  <CollectionCard key={collection.id} collection={collection} />
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

