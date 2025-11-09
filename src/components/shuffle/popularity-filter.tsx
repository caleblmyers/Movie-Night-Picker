"use client";

import { Slider } from "@/components/ui/slider";

interface PopularityFilterProps {
  popularityRange: number[];
  onPopularityRangeChange: (range: number[]) => void;
}

// TMDB popularity typically ranges from 0 to ~1000+
// Most movies are between 0-500
const MIN_POPULARITY = 0;
const MAX_POPULARITY = 1000;

export function PopularityFilter({
  popularityRange,
  onPopularityRangeChange,
}: PopularityFilterProps) {
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-foreground">
        Popularity Range: {popularityRange[0].toFixed(0)} - {popularityRange[1].toFixed(0)}
      </label>
      <Slider
        value={popularityRange}
        onValueChange={onPopularityRangeChange}
        min={MIN_POPULARITY}
        max={MAX_POPULARITY}
        step={1}
        className="w-full"
      />
      <div className="flex justify-between text-xs text-muted-foreground">
        <span>{MIN_POPULARITY}</span>
        <span>{MAX_POPULARITY}</span>
      </div>
    </div>
  );
}

