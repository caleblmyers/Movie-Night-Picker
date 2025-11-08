"use client";

import { SelectionOption } from "@/types/suggest";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { RefreshCw } from "lucide-react";
import { Icon } from "@iconify/react";

interface SelectionRoundProps {
  round: number;
  totalRounds: number;
  options: SelectionOption[];
  onSelect: (option: SelectionOption) => void;
  onRefresh?: () => void;
}

function getRoundTitle(round: number): string {
  const titles = [
    "Pick a Genre",
    "Choose a Mood",
    "Select an Era",
    "Pick an Actor",
    "Choose a Director",
  ];
  return titles[round - 1] || "Choose your preference";
}

export function SelectionRound({
  round,
  totalRounds,
  options,
  onSelect,
  onRefresh,
}: SelectionRoundProps) {
  const isTwoOptions = options.length === 2;
  const isFourOptions = options.length === 4;

  return (
    <div className="flex flex-col items-center justify-center gap-8 px-4 py-16 max-w-4xl mx-auto">
      <div className="text-center space-y-2">
        <h1 className="text-4xl font-bold tracking-tight text-foreground">
          Round {round} of {totalRounds}
        </h1>
        <p className="text-lg text-muted-foreground">{getRoundTitle(round)}</p>
      </div>

      <div
        className={cn(
          "w-full grid gap-4",
          isTwoOptions && "grid-cols-1 sm:grid-cols-2",
          isFourOptions && "grid-cols-1 sm:grid-cols-2 lg:grid-cols-4"
        )}
      >
        {options.map((option) => (
          <Button
            key={option.id}
            variant="outline"
            size="lg"
            className={cn(
              "h-auto min-h-[120px] flex flex-col items-center justify-center gap-2 p-6",
              "hover:bg-accent hover:scale-105 transition-transform",
              "text-lg font-medium"
            )}
            onClick={() => onSelect(option)}
          >
            {option.icon && (
              <Icon
                icon={option.icon}
                width={32}
                height={32}
                className="text-foreground"
              />
            )}
            <span className="text-center">{option.label}</span>
          </Button>
        ))}
      </div>

      {onRefresh && (
        <Button
          variant="ghost"
          size="sm"
          onClick={onRefresh}
          className="mt-4 gap-2 text-muted-foreground hover:text-foreground"
        >
          <RefreshCw className="h-4 w-4" />
          <span>Refresh Options</span>
        </Button>
      )}
    </div>
  );
}
