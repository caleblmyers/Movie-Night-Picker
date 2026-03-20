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

// Common streaming providers with their TMDB provider IDs
// Provider IDs from TMDB watch providers API
const STREAMING_PROVIDERS = [
  { id: "8", label: "Netflix" },
  { id: "9", label: "Amazon Prime Video" },
  { id: "337", label: "Disney Plus" },
  { id: "350", label: "Apple TV Plus" },
  { id: "31", label: "HBO Max" },
  { id: "384", label: "HBO" },
  { id: "283", label: "Crunchyroll" },
  { id: "531", label: "Paramount Plus" },
  { id: "2", label: "Apple TV" },
  { id: "3", label: "Google Play Movies" },
  { id: "68", label: "Microsoft Store" },
  { id: "192", label: "YouTube" },
  { id: "15", label: "Hulu" },
  { id: "1796", label: "Max" },
  { id: "387", label: "Peacock" },
  { id: "10", label: "Amazon Video" },
] as const;

interface StreamingFilterProps {
  selectedProviders: string[];
  onProvidersChange: (providers: string[]) => void;
}

export function StreamingFilter({
  selectedProviders,
  onProvidersChange,
}: StreamingFilterProps) {
  const toggleProvider = (providerId: string) => {
    onProvidersChange(
      selectedProviders.includes(providerId)
        ? selectedProviders.filter((id) => id !== providerId)
        : [...selectedProviders, providerId]
    );
  };

  const selectedProviderLabels = selectedProviders
    .map((id) => STREAMING_PROVIDERS.find((p) => p.id === id)?.label)
    .filter(Boolean) as string[];

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-foreground">
        Streaming Availability
      </label>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            className="w-full justify-between"
          >
            {selectedProviders.length > 0
              ? `${selectedProviders.length} provider(s) selected`
              : "Select streaming providers..."}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-full p-0" align="start">
          <Command>
            <CommandInput placeholder="Search providers..." />
            <CommandList>
              <CommandEmpty>No providers found.</CommandEmpty>
              <CommandGroup>
                {STREAMING_PROVIDERS.map((provider) => (
                  <CommandItem
                    key={provider.id}
                    value={provider.label}
                    onSelect={() => toggleProvider(provider.id)}
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        selectedProviders.includes(provider.id)
                          ? "opacity-100"
                          : "opacity-0"
                      )}
                    />
                    {provider.label}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
      {selectedProviderLabels.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-2">
          {selectedProviderLabels.map((label, idx) => (
            <div
              key={selectedProviders[idx]}
              className="inline-flex items-center gap-1 px-2 py-1 bg-secondary text-secondary-foreground rounded-md text-sm"
            >
              {label}
              <button
                onClick={() => toggleProvider(selectedProviders[idx])}
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

