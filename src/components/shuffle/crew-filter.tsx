"use client";

import { Person } from "@/types/suggest";
import { PersonRoleType } from "@/types/suggest";
import { PersonSearchInput } from "@/components/common/person-search-input";

interface CrewFilterProps {
  selectedCrew: Person[];
  onCrewChange: (crew: Person[]) => void;
}

export function CrewFilter({ selectedCrew, onCrewChange }: CrewFilterProps) {
  return (
    <PersonSearchInput
      selectedPeople={selectedCrew}
      onPeopleChange={onCrewChange}
      roleType={PersonRoleType.CREW}
      label="Crew (Directors, Writers, etc.)"
      placeholder="Search and add crew members..."
      emptyMessage="No crew members found."
      limit={10}
    />
  );
}

