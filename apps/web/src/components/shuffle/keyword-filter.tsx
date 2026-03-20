"use client";

import { useState, useEffect } from "react";
import { useLazyQuery } from "@apollo/client/react";
import { SEARCH_KEYWORDS } from "@/lib/graphql";
import { Keyword } from "@/lib/graphql/keywords";
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
import { Check, ChevronsUpDown, X, Tag } from "lucide-react";
import { cn } from "@/lib/utils";
import { useDebounce } from "@/hooks/use-debounce";

interface KeywordFilterProps {
  selectedKeywords: Keyword[];
  onKeywordsChange: (keywords: Keyword[]) => void;
  label?: string;
  placeholder?: string;
  limit?: number; // Limit for keyword search results (default: 20, max: 100)
}

const MIN_QUERY_LENGTH = 2;

export function KeywordFilter({
  selectedKeywords,
  onKeywordsChange,
  label = "Keywords",
  placeholder = "Search and add keywords...",
  limit = 20,
}: KeywordFilterProps) {
  const [open, setOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const debouncedQuery = useDebounce(searchQuery, 300);

  const [searchKeywords, { data, loading }] = useLazyQuery<{
    searchKeywords: Keyword[];
  }>(SEARCH_KEYWORDS);

  // Trigger search when debounced query changes
  useEffect(() => {
    if (debouncedQuery.trim().length >= MIN_QUERY_LENGTH) {
      searchKeywords({
        variables: {
          query: debouncedQuery,
          limit: limit > 100 ? 100 : limit, // Enforce max limit
        },
      });
    }
  }, [debouncedQuery, limit, searchKeywords]);

  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
  };

  const toggleKeyword = (keyword: Keyword) => {
    const isSelected = selectedKeywords.some((k) => k.id === keyword.id);
    if (isSelected) {
      onKeywordsChange(selectedKeywords.filter((k) => k.id !== keyword.id));
    } else {
      onKeywordsChange([...selectedKeywords, keyword]);
    }
  };

  const keywords = data?.searchKeywords || [];
  const shouldShowResults = debouncedQuery.trim().length >= MIN_QUERY_LENGTH;

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-foreground flex items-center gap-2">
        <Tag className="h-4 w-4" />
        {label}
      </label>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            className="w-full justify-between"
          >
            {selectedKeywords.length > 0
              ? `${selectedKeywords.length} keyword(s) selected`
              : placeholder}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-(--radix-popover-trigger-width) p-0" align="start">
          <Command shouldFilter={false}>
            <CommandInput
              placeholder="Search keywords (e.g., superhero, time travel)..."
              value={searchQuery}
              onValueChange={handleSearchChange}
            />
            <CommandList>
              {!shouldShowResults ? (
                <CommandEmpty>
                  Type at least {MIN_QUERY_LENGTH} characters to search
                </CommandEmpty>
              ) : loading ? (
                <CommandEmpty>Searching keywords...</CommandEmpty>
              ) : keywords.length === 0 ? (
                <CommandEmpty>No keywords found. Try a different search.</CommandEmpty>
              ) : (
                <CommandGroup>
                  {keywords.map((keyword) => {
                    const isSelected = selectedKeywords.some((k) => k.id === keyword.id);
                    return (
                      <CommandItem
                        key={keyword.id}
                        value={keyword.id.toString()}
                        onSelect={() => toggleKeyword(keyword)}
                      >
                        <Check
                          className={cn(
                            "mr-2 h-4 w-4",
                            isSelected ? "opacity-100" : "opacity-0"
                          )}
                        />
                        {keyword.name}
                      </CommandItem>
                    );
                  })}
                </CommandGroup>
              )}
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
      {selectedKeywords.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-2">
          {selectedKeywords.map((keyword) => (
            <div
              key={keyword.id}
              className="inline-flex items-center gap-1 px-2 py-1 bg-secondary text-secondary-foreground rounded-md text-sm"
            >
              {keyword.name}
              <button
                onClick={() =>
                  onKeywordsChange(
                    selectedKeywords.filter((k) => k.id !== keyword.id)
                  )
                }
                className="ml-1 hover:opacity-70"
                aria-label={`Remove ${keyword.name}`}
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

