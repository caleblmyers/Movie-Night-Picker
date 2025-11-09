"use client";

import { Slider } from "@/components/ui/slider";

interface VoteAverageFilterProps {
  minVoteAverage: number;
  onVoteAverageChange: (value: number) => void;
}

export function VoteAverageFilter({
  minVoteAverage,
  onVoteAverageChange,
}: VoteAverageFilterProps) {
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-foreground">
        Minimum Vote Average: {minVoteAverage.toFixed(1)}/10
      </label>
      <Slider
        value={[minVoteAverage]}
        onValueChange={(values) => onVoteAverageChange(values[0])}
        min={0}
        max={10}
        step={0.1}
        className="w-full"
      />
      <div className="flex justify-between text-xs text-muted-foreground">
        <span>0.0</span>
        <span>10.0</span>
      </div>
    </div>
  );
}

