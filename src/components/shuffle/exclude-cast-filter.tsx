"use client";

import { Person } from "@/types/suggest";
import { PersonRoleType } from "@/types/suggest";
import { PersonSearchInput } from "@/components/common/person-search-input";

interface ExcludeCastFilterProps {
  selectedCast: Person[];
  onCastChange: (cast: Person[]) => void;
}

export function ExcludeCastFilter({
  selectedCast,
  onCastChange,
}: ExcludeCastFilterProps) {
  return (
    <PersonSearchInput
      selectedPeople={selectedCast}
      onPeopleChange={onCastChange}
      roleType={PersonRoleType.ACTOR}
      label="Exclude Cast Members"
      placeholder="Search and exclude cast members..."
      emptyMessage="No cast members found."
      limit={10}
      variant="exclude"
    />
  );
}

