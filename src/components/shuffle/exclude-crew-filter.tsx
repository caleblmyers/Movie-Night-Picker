"use client";

import { Person } from "@/types/suggest";
import { PersonRoleType } from "@/types/suggest";
import { PersonSearchInput } from "@/components/common/person-search-input";

interface ExcludeCrewFilterProps {
  selectedCrew: Person[];
  onCrewChange: (crew: Person[]) => void;
}

export function ExcludeCrewFilter({
  selectedCrew,
  onCrewChange,
}: ExcludeCrewFilterProps) {
  return (
    <PersonSearchInput
      selectedPeople={selectedCrew}
      onPeopleChange={onCrewChange}
      roleType={PersonRoleType.CREW}
      label="Exclude Crew Members"
      placeholder="Search and exclude crew members..."
      emptyMessage="No crew members found."
      limit={10}
      variant="exclude"
    />
  );
}

