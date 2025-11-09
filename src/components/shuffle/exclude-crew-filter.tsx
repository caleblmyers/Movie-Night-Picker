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

interface ExcludeCrewFilterProps {
  selectedCrew: Person[];
  onCrewChange: (crew: Person[]) => void;
}

export function ExcludeCrewFilter({
  selectedCrew,
  onCrewChange,
}: ExcludeCrewFilterProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<Person[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const apolloClient = useApolloClient();

  const selectedIds = useMemo(
    () => new Set(selectedCrew.map((c) => c.id)),
    [selectedCrew]
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
            roleType: PersonRoleType.CREW,
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

  const addCrewMember = useCallback(
    (person: Person) => {
      if (!selectedIds.has(person.id)) {
        onCrewChange([...selectedCrew, person]);
        setSearchQuery("");
        setSearchResults([]);
        setIsOpen(false);
      }
    },
    [selectedCrew, selectedIds, onCrewChange]
  );

  const removeCrewMember = useCallback(
    (personId: number) => {
      onCrewChange(selectedCrew.filter((p) => p.id !== personId));
    },
    [selectedCrew, onCrewChange]
  );

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-foreground">
        Exclude Crew Members
      </label>
      <Popover open={isOpen} onOpenChange={setIsOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            className="w-full justify-between"
          >
            {selectedCrew.length > 0
              ? `${selectedCrew.length} crew member(s) excluded`
              : "Search and exclude crew members..."}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-full p-0" align="start">
          <Command>
            <CommandInput
              placeholder="Search crew members..."
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
                    : "No crew members found."}
                </CommandEmpty>
              ) : (
                <CommandGroup>
                  {searchResults.map((person) => (
                    <CommandItem
                      key={person.id}
                      value={person.name}
                      onSelect={() => addCrewMember(person)}
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
      {selectedCrew.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-2">
          {selectedCrew.map((person) => (
            <div
              key={person.id}
              className="inline-flex items-center gap-1 px-2 py-1 bg-destructive/20 text-destructive rounded-md text-sm"
            >
              {person.name}
              <button
                onClick={() => removeCrewMember(person.id)}
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

