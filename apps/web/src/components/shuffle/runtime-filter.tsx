"use client";

import { Slider } from "@/components/ui/slider";

interface RuntimeFilterProps {
  runtimeRange: number[];
  onRuntimeRangeChange: (range: number[]) => void;
}

const MIN_RUNTIME = 0;
const MAX_RUNTIME = 300; // 5 hours max

export function RuntimeFilter({
  runtimeRange,
  onRuntimeRangeChange,
}: RuntimeFilterProps) {
  const formatRuntime = (minutes: number) => {
    if (minutes === 0) return "Any";
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours === 0) return `${mins}m`;
    if (mins === 0) return `${hours}h`;
    return `${hours}h ${mins}m`;
  };

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-foreground">
        Runtime Range: {formatRuntime(runtimeRange[0])} - {formatRuntime(runtimeRange[1])}
      </label>
      <Slider
        value={runtimeRange}
        onValueChange={onRuntimeRangeChange}
        min={MIN_RUNTIME}
        max={MAX_RUNTIME}
        step={5}
        className="w-full"
      />
      <div className="flex justify-between text-xs text-muted-foreground">
        <span>Any</span>
        <span>{formatRuntime(MAX_RUNTIME)}</span>
      </div>
    </div>
  );
}

