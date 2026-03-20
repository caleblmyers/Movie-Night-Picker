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

// Common production countries (ISO 3166-1 alpha-2 codes)
const COUNTRIES = [
  { code: "US", label: "United States" },
  { code: "GB", label: "United Kingdom" },
  { code: "CA", label: "Canada" },
  { code: "AU", label: "Australia" },
  { code: "FR", label: "France" },
  { code: "DE", label: "Germany" },
  { code: "IT", label: "Italy" },
  { code: "ES", label: "Spain" },
  { code: "JP", label: "Japan" },
  { code: "KR", label: "South Korea" },
  { code: "CN", label: "China" },
  { code: "IN", label: "India" },
  { code: "BR", label: "Brazil" },
  { code: "MX", label: "Mexico" },
  { code: "AR", label: "Argentina" },
  { code: "RU", label: "Russia" },
  { code: "SE", label: "Sweden" },
  { code: "NO", label: "Norway" },
  { code: "DK", label: "Denmark" },
  { code: "NL", label: "Netherlands" },
  { code: "BE", label: "Belgium" },
  { code: "CH", label: "Switzerland" },
  { code: "AT", label: "Austria" },
  { code: "PL", label: "Poland" },
  { code: "CZ", label: "Czech Republic" },
  { code: "IE", label: "Ireland" },
  { code: "NZ", label: "New Zealand" },
  { code: "ZA", label: "South Africa" },
  { code: "TR", label: "Turkey" },
  { code: "GR", label: "Greece" },
] as const;

interface CountryFilterProps {
  selectedCountries: string[];
  onCountriesChange: (countries: string[]) => void;
}

export function CountryFilter({
  selectedCountries,
  onCountriesChange,
}: CountryFilterProps) {
  const toggleCountry = (countryCode: string) => {
    onCountriesChange(
      selectedCountries.includes(countryCode)
        ? selectedCountries.filter((code) => code !== countryCode)
        : [...selectedCountries, countryCode]
    );
  };

  const selectedCountryLabels = selectedCountries
    .map((code) => COUNTRIES.find((c) => c.code === code)?.label)
    .filter(Boolean) as string[];

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-foreground">
        Production Countries
      </label>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            className="w-full justify-between"
          >
            {selectedCountries.length > 0
              ? `${selectedCountries.length} country(ies) selected`
              : "Select production countries..."}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-full p-0" align="start">
          <Command>
            <CommandInput placeholder="Search countries..." />
            <CommandList>
              <CommandEmpty>No countries found.</CommandEmpty>
              <CommandGroup>
                {COUNTRIES.map((country) => (
                  <CommandItem
                    key={country.code}
                    value={country.label}
                    onSelect={() => toggleCountry(country.code)}
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        selectedCountries.includes(country.code)
                          ? "opacity-100"
                          : "opacity-0"
                      )}
                    />
                    {country.label}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
      {selectedCountryLabels.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-2">
          {selectedCountryLabels.map((label, idx) => (
            <div
              key={selectedCountries[idx]}
              className="inline-flex items-center gap-1 px-2 py-1 bg-secondary text-secondary-foreground rounded-md text-sm"
            >
              {label}
              <button
                onClick={() => toggleCountry(selectedCountries[idx])}
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

