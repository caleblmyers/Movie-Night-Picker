"use client";

import { CollectionFilter } from "./collection-filter";

interface ExcludeCollectionFilterProps {
  selectedCollections: number[];
  onCollectionsChange: (collections: number[]) => void;
}

export function ExcludeCollectionFilter({
  selectedCollections,
  onCollectionsChange,
}: ExcludeCollectionFilterProps) {
  return (
    <CollectionFilter
      selectedCollections={selectedCollections}
      onCollectionsChange={onCollectionsChange}
      label="Exclude Collections"
      placeholder="Select collections to exclude..."
      variant="exclude"
    />
  );
}

