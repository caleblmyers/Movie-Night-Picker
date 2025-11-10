import { memo } from "react";
import Image from "next/image";
import Link from "next/link";
import { CastMember } from "@/types/suggest";
import { User } from "lucide-react";

interface CastMemberCardProps {
  actor: CastMember;
}

/**
 * Reusable cast member card component with consistent styling
 */
function CastMemberCardComponent({ actor }: CastMemberCardProps) {
  return (
    <Link
      href={`/person/${actor.id}`}
      className="flex flex-col items-center space-y-2 text-center transition-opacity hover:opacity-80"
    >
      <div className="relative h-20 w-20 overflow-hidden rounded-full bg-muted">
        {actor.profileUrl ? (
          <Image
            src={actor.profileUrl}
            alt={actor.name}
            fill
            className="object-cover"
            sizes="80px"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center">
            <User className="h-8 w-8 text-muted-foreground" />
          </div>
        )}
      </div>
      <div className="space-y-1">
        <p className="text-sm font-medium text-foreground">{actor.name}</p>
        {actor.character && (
          <p className="text-xs text-muted-foreground">{actor.character}</p>
        )}
      </div>
    </Link>
  );
}

export const CastMemberCard = memo(CastMemberCardComponent);

