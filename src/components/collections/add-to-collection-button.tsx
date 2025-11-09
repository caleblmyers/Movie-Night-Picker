"use client";

import { useState } from "react";
import { useQuery, useMutation } from "@apollo/client/react";
import { COLLECTIONS, ADD_MOVIE_TO_COLLECTION, REMOVE_MOVIE_FROM_COLLECTION } from "@/lib/graphql";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Collection } from "@/types/suggest";
import { FolderPlus, Check, X } from "lucide-react";
import { CardContainer } from "@/components/common/card-container";

interface AddToCollectionButtonProps {
  tmdbId: number;
  currentCollections?: Array<{ id: number; name: string }>;
}

export function AddToCollectionButton({ 
  tmdbId, 
  currentCollections = [] 
}: AddToCollectionButtonProps) {
  const [open, setOpen] = useState(false);
  const currentCollectionIds = new Set(currentCollections.map((c) => c.id));

  const { data, loading } = useQuery<{ collections: Collection[] }>(COLLECTIONS, {
    skip: !open,
  });

  const [addMovie, { loading: adding }] = useMutation(ADD_MOVIE_TO_COLLECTION, {
    refetchQueries: [{ query: COLLECTIONS }],
  });

  const [removeMovie, { loading: removing }] = useMutation(REMOVE_MOVIE_FROM_COLLECTION, {
    refetchQueries: [{ query: COLLECTIONS }],
  });

  const collections = data?.collections || [];
  const isLoading = adding || removing;

  const handleToggle = async (collectionId: number, isInCollection: boolean) => {
    if (isInCollection) {
      await removeMovie({
        variables: { collectionId, tmdbId },
      });
    } else {
      await addMovie({
        variables: { collectionId, tmdbId },
      });
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">
          <FolderPlus className="h-4 w-4 mr-2" />
          Add to Collection
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add to Collection</DialogTitle>
          <DialogDescription>
            Select collections to add this movie to, or remove it from.
          </DialogDescription>
        </DialogHeader>
        {loading ? (
          <div className="py-8 text-center text-muted-foreground">
            Loading collections...
          </div>
        ) : collections.length === 0 ? (
          <div className="py-8 text-center text-muted-foreground">
            No collections found. Create a collection first.
          </div>
        ) : (
          <div className="space-y-2 py-4">
            {collections.map((collection) => {
              const isInCollection = currentCollectionIds.has(collection.id);
              return (
                <CardContainer key={collection.id}>
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h3 className="font-medium text-foreground">{collection.name}</h3>
                      {collection.description && (
                        <p className="text-sm text-muted-foreground mt-1">
                          {collection.description}
                        </p>
                      )}
                      <p className="text-xs text-muted-foreground mt-1">
                        {collection.movieCount} movie{collection.movieCount !== 1 ? "s" : ""}
                      </p>
                    </div>
                    <Button
                      variant={isInCollection ? "default" : "outline"}
                      size="sm"
                      onClick={() => handleToggle(collection.id, isInCollection)}
                      disabled={isLoading}
                    >
                      {isInCollection ? (
                        <>
                          <Check className="h-4 w-4 mr-2" />
                          Remove
                        </>
                      ) : (
                        <>
                          <FolderPlus className="h-4 w-4 mr-2" />
                          Add
                        </>
                      )}
                    </Button>
                  </div>
                </CardContainer>
              );
            })}
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

