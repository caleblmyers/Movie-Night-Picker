"use client";

import { useState, useEffect } from "react";
import { useApolloClient } from "@apollo/client/react";
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
import { ChevronsUpDown, X } from "lucide-react";
import { SEARCH_PEOPLE } from "@/lib/graphql/queries";
import { Person } from "@/types/suggest";

interface CastFilterProps {
  selectedCast: Person[];
  onCastChange: (cast: Person[]) => void;
}

export function CastFilter({ selectedCast, onCastChange }: CastFilterProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<Person[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const apolloClient = useApolloClient();

  useEffect(() => {
    if (searchQuery.trim().length < 2) {
      setSearchResults([]);
      return;
    }

    const timeoutId = setTimeout(async () => {
      setIsSearching(true);
      try {
        const result = await apolloClient.query<{ searchPeople: Person[] }>({
          query: SEARCH_PEOPLE,
          variables: { query: searchQuery },
          fetchPolicy: "network-only",
        });

        if (result.data?.searchPeople) {
          const selectedIds = new Set(selectedCast.map((c) => c.id));
          const filtered = result.data.searchPeople.filter(
            (person) => !selectedIds.has(person.id)
          );
          setSearchResults(filtered);
        }
      } catch {
        // Silently fail - user will see empty results
        setSearchResults([]);
      } finally {
        setIsSearching(false);
      }
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchQuery, apolloClient, selectedCast]);

  const addCastMember = (person: Person) => {
    if (!selectedCast.find((p) => p.id === person.id)) {
      onCastChange([...selectedCast, person]);
      setSearchQuery("");
      setSearchResults([]);
      setIsOpen(false);
    }
  };

  const removeCastMember = (personId: number) => {
    onCastChange(selectedCast.filter((p) => p.id !== personId));
  };

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-foreground">
        Cast Members
      </label>
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            className="w-full justify-between"
          >
            {selectedCast.length > 0
              ? `${selectedCast.length} cast member(s) selected`
              : "Search and add cast members..."}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-full p-0" align="start">
          <Command>
            <CommandInput
              placeholder="Search cast members..."
              value={searchQuery}
              onValueChange={setSearchQuery}
            />
            <CommandList>
              {isSearching ? (
                <CommandEmpty>Searching...</CommandEmpty>
              ) : searchResults.length === 0 ? (
                <CommandEmpty>
                  {searchQuery.trim().length < 2
                    ? "Type at least 2 characters to search"
                    : "No cast members found."}
                </CommandEmpty>
              ) : (
                <CommandGroup>
                  {searchResults.map((person) => (
                    <CommandItem
                      key={person.id}
                      value={person.name}
                      onSelect={() => addCastMember(person)}
                    >
                      {person.name}
                    </CommandItem>
                  ))}
                </CommandGroup>
              )}
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
      {selectedCast.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-2">
          {selectedCast.map((person) => (
            <div
              key={person.id}
              className="inline-flex items-center gap-1 px-2 py-1 bg-secondary text-secondary-foreground rounded-md text-sm"
            >
              {person.name}
              <button
                onClick={() => removeCastMember(person.id)}
                className="ml-1 hover:opacity-70"
                aria-label={`Remove ${person.name}`}
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
