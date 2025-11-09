"use client";

import { useState } from "react";
import { useQuery } from "@apollo/client/react";
import { COLLECTIONS } from "@/lib/graphql";
import { Collection } from "@/types/suggest";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { Check, ChevronsUpDown, X, Folder } from "lucide-react";
import { cn } from "@/lib/utils";

interface CollectionFilterProps {
  selectedCollections: number[];
  onCollectionsChange: (collections: number[]) => void;
  label?: string;
  placeholder?: string;
  variant?: "default" | "exclude";
}

export function CollectionFilter({
  selectedCollections,
  onCollectionsChange,
  label = "Include Collections",
  placeholder = "Select collections...",
  variant = "default",
}: CollectionFilterProps) {
  const [open, setOpen] = useState(false);
  const { data, loading } = useQuery<{ collections: Collection[] }>(COLLECTIONS);

  const collections = data?.collections || [];

  const toggleCollection = (collectionId: number) => {
    onCollectionsChange(
      selectedCollections.includes(collectionId)
        ? selectedCollections.filter((id) => id !== collectionId)
        : [...selectedCollections, collectionId]
    );
  };

  const selectedCollectionNames = selectedCollections
    .map((id) => collections.find((c) => c.id === id)?.name)
    .filter(Boolean) as string[];

  const badgeClassName = variant === "exclude"
    ? "bg-destructive/20 text-destructive"
    : "bg-secondary text-secondary-foreground";

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-foreground flex items-center gap-2">
        <Folder className="h-4 w-4" />
        {label}
      </label>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            className="w-full justify-between"
          >
            {selectedCollections.length > 0
              ? `${selectedCollections.length} collection(s) selected`
              : placeholder}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-(--radix-popover-trigger-width) p-0" align="start">
          <Command shouldFilter={false}>
            <CommandInput placeholder="Search collections..." />
            <CommandList>
              {loading ? (
                <CommandEmpty>Loading collections...</CommandEmpty>
              ) : collections.length === 0 ? (
                <CommandEmpty>No collections found. Create one first.</CommandEmpty>
              ) : (
                <CommandGroup>
                  {collections.map((collection) => (
                    <CommandItem
                      key={collection.id}
                      value={collection.id.toString()}
                      onSelect={() => toggleCollection(collection.id)}
                    >
                      <Check
                        className={cn(
                          "mr-2 h-4 w-4",
                          selectedCollections.includes(collection.id)
                            ? "opacity-100"
                            : "opacity-0"
                        )}
                      />
                      {collection.name} ({collection.movieCount} movies)
                    </CommandItem>
                  ))}
                </CommandGroup>
              )}
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
      {selectedCollections.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-2">
          {selectedCollections.map((collectionId) => {
            const collection = collections.find((c) => c.id === collectionId);
            return (
              <div
                key={collectionId}
                className={`inline-flex items-center gap-1 px-2 py-1 ${badgeClassName} rounded-md text-sm`}
              >
                {collection?.name || `Collection ${collectionId}`}
                <button
                  onClick={() =>
                    onCollectionsChange(
                      selectedCollections.filter((id) => id !== collectionId)
                    )
                  }
                  className="ml-1 hover:opacity-70"
                  aria-label={`Remove ${collection?.name || "collection"}`}
                >
                  <X className="h-3 w-3" />
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

