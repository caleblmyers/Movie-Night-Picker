"use client";

import { useQuery } from "@apollo/client/react";
import { COLLECTIONS } from "@/lib/graphql";
import { Collection } from "@/types/suggest";
import { LoadingState } from "@/components/shared/loading-state";
import { ErrorState } from "@/components/shared/error-state";
import { CardContainer } from "@/components/common/card-container";
import { SectionHeader } from "@/components/common/section-header";
import { CreateCollectionDialog } from "@/components/collections/create-collection-dialog";
import { Folder, Film, Calendar } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";

export default function CollectionsPage() {
  const { data, loading, error, refetch } = useQuery<{ collections: Collection[] }>(COLLECTIONS);

  if (loading) {
    return <LoadingState message="Loading collections..." />;
  }

  if (error) {
    return (
      <ErrorState
        message={error.message || "Failed to load collections. Please try again."}
        onRetry={() => refetch()}
      />
    );
  }

  const collections = data?.collections || [];

  return (
    <div className="min-h-screen bg-background px-4 py-8 md:py-16">
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
              My Collections
            </h1>
            <p className="text-muted-foreground">
              Organize your favorite movies into collections
            </p>
          </div>
          <CreateCollectionDialog onCollectionCreated={() => refetch()} />
        </div>

        {collections.length === 0 ? (
          <CardContainer>
            <div className="text-center py-12">
              <Folder className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
              <h3 className="text-xl font-semibold text-foreground mb-2">
                No collections yet
              </h3>
              <p className="text-muted-foreground mb-6">
                Create your first collection to organize your favorite movies
              </p>
              <CreateCollectionDialog onCollectionCreated={() => refetch()} />
            </div>
          </CardContainer>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {collections.map((collection) => (
              <Link key={collection.id} href={`/collections/${collection.id}`}>
                <CardContainer className="h-full transition-opacity hover:opacity-80 cursor-pointer">
                  <div className="space-y-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="text-xl font-semibold text-foreground mb-1">
                          {collection.name}
                        </h3>
                        {collection.description && (
                          <p className="text-sm text-muted-foreground line-clamp-2">
                            {collection.description}
                          </p>
                        )}
                      </div>
                      {collection.isPublic && (
                        <span className="text-xs bg-primary/20 text-primary px-2 py-1 rounded">
                          Public
                        </span>
                      )}
                    </div>

                    {collection.movies && collection.movies.length > 0 ? (
                      <div className="grid grid-cols-4 gap-2">
                        {collection.movies.slice(0, 4).map((collectionMovie) => (
                          <div
                            key={collectionMovie.id}
                            className="relative aspect-2/3 w-full overflow-hidden rounded bg-muted"
                          >
                            {collectionMovie.movie?.posterUrl ? (
                              <Image
                                src={collectionMovie.movie.posterUrl}
                                alt={collectionMovie.movie.title}
                                fill
                                sizes="(max-width: 768px) 25vw, 20vw"
                                className="object-cover"
                              />
                            ) : (
                              <div className="flex h-full w-full items-center justify-center">
                                <Film className="h-6 w-6 text-muted-foreground" />
                              </div>
                            )}
                          </div>
                        ))}
                        {collection.movieCount > 4 && (
                          <div className="flex items-center justify-center aspect-2/3 bg-muted rounded">
                            <span className="text-sm font-medium text-muted-foreground">
                              +{collection.movieCount - 4}
                            </span>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="flex items-center justify-center h-32 bg-muted rounded">
                        <div className="text-center">
                          <Film className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                          <p className="text-sm text-muted-foreground">No movies yet</p>
                        </div>
                      </div>
                    )}

                    <div className="flex items-center justify-between text-sm text-muted-foreground pt-2 border-t">
                      <span>{collection.movieCount} movie{collection.movieCount !== 1 ? "s" : ""}</span>
                      <span className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        {new Date(collection.updatedAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </CardContainer>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

