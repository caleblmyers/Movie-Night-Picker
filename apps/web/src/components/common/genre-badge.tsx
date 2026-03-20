import { Genre } from "@/types/suggest";
import { memo } from "react";

interface GenreBadgeProps {
  genre: Genre;
}

/**
 * Reusable genre badge component with consistent styling
 */
export const GenreBadge = memo(function GenreBadge({ genre }: GenreBadgeProps) {
  return (
    <span className="rounded-full bg-secondary px-3 py-1 text-sm text-secondary-foreground">
      {genre.name}
    </span>
  );
});

