"use client";

import { Slider } from "@/components/ui/slider";

interface YearRangeFilterProps {
  yearRange: number[];
  onYearRangeChange: (range: number[]) => void;
  minYear: number;
  maxYear: number;
}

export function YearRangeFilter({
  yearRange,
  onYearRangeChange,
  minYear,
  maxYear,
}: YearRangeFilterProps) {
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-foreground">
        Release Year Range: {yearRange[0]} - {yearRange[1]}
      </label>
      <Slider
        value={yearRange}
        onValueChange={onYearRangeChange}
        min={minYear}
        max={maxYear}
        step={1}
        className="w-full"
      />
      <div className="flex justify-between text-xs text-muted-foreground">
        <span>{minYear}</span>
        <span>{maxYear}</span>
      </div>
    </div>
  );
}
