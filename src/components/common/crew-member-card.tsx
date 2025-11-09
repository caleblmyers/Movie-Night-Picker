import Image from "next/image";
import Link from "next/link";
import { CrewMember } from "@/types/suggest";
import { User } from "lucide-react";

interface CrewMemberCardProps {
  member: CrewMember;
}

/**
 * Reusable crew member card component with consistent styling
 */
export function CrewMemberCard({ member }: CrewMemberCardProps) {
  return (
    <Link
      href={`/person/${member.id}`}
      className="flex items-center gap-2 rounded-lg bg-secondary px-3 py-2 transition-opacity hover:opacity-80"
    >
      {member.profileUrl ? (
        <div className="relative h-8 w-8 shrink-0 overflow-hidden rounded-full bg-muted">
          <Image
            src={member.profileUrl}
            alt={member.name}
            fill
            className="object-cover"
            sizes="32px"
          />
        </div>
      ) : (
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-muted">
          <User className="h-4 w-4 text-muted-foreground" />
        </div>
      )}
      <span className="text-sm text-foreground">{member.name}</span>
    </Link>
  );
}

