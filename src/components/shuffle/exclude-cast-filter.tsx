"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
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
import { SEARCH_PEOPLE } from "@/lib/graphql";
import { Person, PersonRoleType } from "@/types/suggest";

interface ExcludeCastFilterProps {
  selectedCast: Person[];
  onCastChange: (cast: Person[]) => void;
}

export function ExcludeCastFilter({
  selectedCast,
  onCastChange,
}: ExcludeCastFilterProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<Person[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const apolloClient = useApolloClient();

  const selectedIds = useMemo(
    () => new Set(selectedCast.map((c) => c.id)),
    [selectedCast]
  );

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
          variables: {
            query: searchQuery,
            roleType: PersonRoleType.ACTOR,
          },
          fetchPolicy: "cache-first",
        });

        if (result.data?.searchPeople) {
          const filtered = result.data.searchPeople.filter(
            (person) => !selectedIds.has(person.id)
          );
          setSearchResults(filtered);
        }
      } catch {
        setSearchResults([]);
      } finally {
        setIsSearching(false);
      }
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchQuery, apolloClient, selectedIds]);

  const addCastMember = useCallback(
    (person: Person) => {
      if (!selectedIds.has(person.id)) {
        onCastChange([...selectedCast, person]);
        setSearchQuery("");
        setSearchResults([]);
        setIsOpen(false);
      }
    },
    [selectedCast, selectedIds, onCastChange]
  );

  const removeCastMember = useCallback(
    (personId: number) => {
      onCastChange(selectedCast.filter((p) => p.id !== personId));
    },
    [selectedCast, onCastChange]
  );

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-foreground">
        Exclude Cast Members
      </label>
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            className="w-full justify-between"
          >
            {selectedCast.length > 0
              ? `${selectedCast.length} cast member(s) excluded`
              : "Search and exclude cast members..."}
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
              className="inline-flex items-center gap-1 px-2 py-1 bg-destructive/20 text-destructive rounded-md text-sm"
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

