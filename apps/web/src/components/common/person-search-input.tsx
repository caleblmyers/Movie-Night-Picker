"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { useApolloClient } from "@apollo/client/react";
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
import { Button } from "@/components/ui/button";
import { ChevronsUpDown, X } from "lucide-react";
import Image from "next/image";
import { SEARCH_PEOPLE } from "@/lib/graphql";
import { Person, PersonRoleType } from "@/types/suggest";
import { useDebounce } from "@/hooks/use-debounce";

interface PersonSearchInputProps {
  selectedPeople: Person[];
  onPeopleChange: (people: Person[]) => void;
  roleType?: PersonRoleType;
  label?: string;
  placeholder?: string;
  emptyMessage?: string;
  limit?: number;
  excludeIds?: Set<number>;
  variant?: "default" | "exclude";
  className?: string;
}

/**
 * Reusable smart input component for searching and selecting people from TMDB
 * Optimized for autocomplete use cases
 * 
 * Features:
 * - Debounced search (300ms) - waits for user to stop typing
 * - Minimum query length (2 characters) - reduces unnecessary API calls
 * - Configurable limit (default: 10 for autocomplete dropdowns, max: 100)
 * - Role type filtering (ACTOR, CREW, BOTH)
 * - Excludes already selected people
 * - Supports both include and exclude variants
 * - Displays profile images and knownForDepartment
 * - Backend caching: Results cached for 5 minutes
 * - Fuzzy matching: TMDB handles partial/case-insensitive matching automatically
 */
export function PersonSearchInput({
  selectedPeople,
  onPeopleChange,
  roleType,
  label = "People",
  placeholder = "Search and add people...",
  emptyMessage = "No people found.",
  limit = 10,
  excludeIds,
  variant = "default",
  className = "",
}: PersonSearchInputProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<Person[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const apolloClient = useApolloClient();

  const debouncedQuery = useDebounce(searchQuery, 300);

  // Memoize selected IDs to avoid recreating Set on every render
  const selectedIds = useMemo(
    () => new Set(selectedPeople.map((p) => p.id)),
    [selectedPeople]
  );

  // Combine selectedIds with excludeIds if provided
  const allExcludedIds = useMemo(() => {
    if (!excludeIds) return selectedIds;
    return new Set([...selectedIds, ...excludeIds]);
  }, [selectedIds, excludeIds]);

  useEffect(() => {
    if (debouncedQuery.trim().length < 2) {
      setSearchResults([]);
      setIsSearching(false);
      return;
    }

    let cancelled = false;
    setIsSearching(true);
    
    const searchPeople = async () => {
      try {
        const result = await apolloClient.query<{ searchPeople: Person[] }>({
          query: SEARCH_PEOPLE,
          variables: {
            query: debouncedQuery,
            roleType,
            limit,
            options: {
              region: "US",
              language: "en-US",
            },
          },
          fetchPolicy: "cache-first", // Use cache when available (5-minute TTL on backend)
        });

        if (!cancelled && result.data?.searchPeople) {
          // Filter out already selected people
          const filtered = result.data.searchPeople.filter(
            (person) => !allExcludedIds.has(person.id)
          );
          setSearchResults(filtered);
        }
      } catch {
        // Silently fail - user will see empty results
        if (!cancelled) {
          setSearchResults([]);
        }
      } finally {
        if (!cancelled) {
          setIsSearching(false);
        }
      }
    };

    searchPeople();

    return () => {
      cancelled = true;
    };
  }, [debouncedQuery, apolloClient, allExcludedIds, roleType, limit]);

  const addPerson = useCallback(
    (person: Person) => {
      if (!allExcludedIds.has(person.id)) {
        onPeopleChange([...selectedPeople, person]);
        setSearchQuery("");
        setSearchResults([]);
        setIsOpen(false);
      }
    },
    [selectedPeople, allExcludedIds, onPeopleChange]
  );

  const removePerson = useCallback(
    (personId: number) => {
      onPeopleChange(selectedPeople.filter((p) => p.id !== personId));
    },
    [selectedPeople, onPeopleChange]
  );

  const badgeClassName = variant === "exclude"
    ? "bg-destructive/20 text-destructive"
    : "bg-secondary text-secondary-foreground";

  const actionText = variant === "exclude" ? "excluded" : "selected";

  return (
    <div className={`space-y-2 ${className}`}>
      <label className="text-sm font-medium text-foreground">{label}</label>
      <Popover 
        open={isOpen} 
        onOpenChange={(open) => {
          setIsOpen(open);
          if (!open) {
            // Clear search when popover closes
            setSearchQuery("");
            setSearchResults([]);
          }
        }}
      >
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            className="w-full justify-between"
          >
            {selectedPeople.length > 0
              ? `${selectedPeople.length} person(s) ${actionText}`
              : placeholder}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-(--radix-popover-trigger-width) p-0" align="start">
          <Command shouldFilter={false}>
            <CommandInput
              placeholder="Search people..."
              value={searchQuery}
              onValueChange={setSearchQuery}
            />
            <CommandList>
              {isSearching ? (
                <CommandEmpty>Searching...</CommandEmpty>
              ) : searchResults.length === 0 ? (
                <CommandEmpty>
                  {debouncedQuery.trim().length < 2
                    ? "Type at least 2 characters to search"
                    : emptyMessage}
                </CommandEmpty>
              ) : (
                <CommandGroup>
                  {searchResults.map((person) => (
                    <CommandItem
                      key={person.id}
                      value={person.name}
                      onSelect={() => addPerson(person)}
                      className="flex items-center gap-3 cursor-pointer"
                    >
                      {person.profileUrl ? (
                        <div className="relative h-10 w-10 shrink-0 overflow-hidden rounded-full">
                          <Image
                            src={person.profileUrl}
                            alt={person.name}
                            fill
                            sizes="40px"
                            className="object-cover"
                            unoptimized
                          />
                        </div>
                      ) : (
                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-muted">
                          <span className="text-xs font-medium text-muted-foreground">
                            {person.name && person.name.length > 0
                              ? person.name.charAt(0).toUpperCase()
                              : "?"}
                          </span>
                        </div>
                      )}
                      <div className="flex flex-1 flex-col gap-0.5 min-w-0">
                        <span className="truncate text-sm font-medium">
                          {person.name || "Unknown Person"}
                        </span>
                        {person.knownForDepartment && (
                          <span className="truncate text-xs text-muted-foreground">
                            {person.knownForDepartment}
                          </span>
                        )}
                      </div>
                    </CommandItem>
                  ))}
                </CommandGroup>
              )}
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
      {selectedPeople.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-2">
          {selectedPeople.map((person) => (
            <div
              key={person.id}
              className={`inline-flex items-center gap-1 px-2 py-1 ${badgeClassName} rounded-md text-sm`}
            >
              {person.name}
              <button
                onClick={() => removePerson(person.id)}
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

