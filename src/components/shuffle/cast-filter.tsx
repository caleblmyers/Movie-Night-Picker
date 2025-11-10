"use client";

import { memo } from "react";
import { Person } from "@/types/suggest";
import { PersonRoleType } from "@/types/suggest";
import { PersonSearchInput } from "@/components/common/person-search-input";

interface CastFilterProps {
  selectedCast: Person[];
  onCastChange: (cast: Person[]) => void;
}

function CastFilterComponent({ selectedCast, onCastChange }: CastFilterProps) {
  return (
    <PersonSearchInput
      selectedPeople={selectedCast}
      onPeopleChange={onCastChange}
      roleType={PersonRoleType.ACTOR}
      label="Cast Members"
      placeholder="Search and add cast members..."
      emptyMessage="No cast members found."
      limit={10}
    />
  );
}

export const CastFilter = memo(CastFilterComponent);
