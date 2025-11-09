"use client";

import { Input } from "@/components/ui/input";

interface VoteCountFilterProps {
  minVoteCount: number;
  onVoteCountChange: (value: number) => void;
}

export function VoteCountFilter({
  minVoteCount,
  onVoteCountChange,
}: VoteCountFilterProps) {
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-foreground">
        Minimum Vote Count
      </label>
      <Input
        type="number"
        min="0"
        value={minVoteCount || ""}
        onChange={(e) => {
          const value = parseInt(e.target.value, 10);
          onVoteCountChange(isNaN(value) ? 0 : value);
        }}
        placeholder="0"
        className="w-full"
      />
    </div>
  );
}

