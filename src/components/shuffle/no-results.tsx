"use client";

import { Button } from "@/components/ui/button";
import { Film } from "lucide-react";

interface NoResultsProps {
  onReset: () => void;
}

export function NoResults({ onReset }: NoResultsProps) {
  return (
    <div className="w-full bg-card border rounded-lg p-12 shadow-lg text-center">
      <Film className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
      <h3 className="text-2xl font-bold text-foreground mb-2">
        Nothing matched your criteria
      </h3>
      <p className="text-muted-foreground mb-6">
        Try adjusting your filters to find more movies.
      </p>
      <Button onClick={onReset} variant="outline">
        Reset Filters
      </Button>
    </div>
  );
}

