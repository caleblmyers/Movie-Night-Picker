"use client";

import { memo } from "react";
import { Person } from "@/types/suggest";
import { PersonRoleType } from "@/types/suggest";
import { PersonSearchInput } from "@/components/common/person-search-input";

interface CrewFilterProps {
  selectedCrew: Person[];
  onCrewChange: (crew: Person[]) => void;
}

function CrewFilterComponent({ selectedCrew, onCrewChange }: CrewFilterProps) {
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

export const CrewFilter = memo(CrewFilterComponent);

