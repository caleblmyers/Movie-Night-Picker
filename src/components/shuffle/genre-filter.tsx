"use client";

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
import { Check, ChevronsUpDown, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { GENRES } from "@/lib/tmdb-options";

interface GenreFilterProps {
  selectedGenres: string[];
  onGenresChange: (genres: string[]) => void;
}

export function GenreFilter({
  selectedGenres,
  onGenresChange,
}: GenreFilterProps) {
  const toggleGenre = (genreId: string) => {
    onGenresChange(
      selectedGenres.includes(genreId)
        ? selectedGenres.filter((id) => id !== genreId)
        : [...selectedGenres, genreId]
    );
  };

  const selectedGenreLabels = selectedGenres
    .map((id) => GENRES.find((g) => g.id === id)?.label)
    .filter(Boolean) as string[];

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-foreground">Genres</label>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            className="w-full justify-between"
          >
            {selectedGenres.length > 0
              ? `${selectedGenres.length} genre(s) selected`
              : "Select genres..."}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-full p-0" align="start">
          <Command>
            <CommandInput placeholder="Search genres..." />
            <CommandList>
              <CommandEmpty>No genres found.</CommandEmpty>
              <CommandGroup>
                {GENRES.map((genre) => (
                  <CommandItem
                    key={genre.id}
                    value={genre.label}
                    onSelect={() => toggleGenre(genre.id)}
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        selectedGenres.includes(genre.id)
                          ? "opacity-100"
                          : "opacity-0"
                      )}
                    />
                    {genre.label}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
      {selectedGenreLabels.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-2">
          {selectedGenreLabels.map((label, idx) => (
            <div
              key={selectedGenres[idx]}
              className="inline-flex items-center gap-1 px-2 py-1 bg-secondary text-secondary-foreground rounded-md text-sm"
            >
              {label}
              <button
                onClick={() => toggleGenre(selectedGenres[idx])}
                className="ml-1 hover:opacity-70"
                aria-label={`Remove ${label}`}
              >
                <X className="h-3 w-3" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
