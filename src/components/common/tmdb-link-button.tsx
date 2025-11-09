"use client";

import { Button } from "@/components/ui/button";
import { ExternalLink } from "lucide-react";

interface TMDBLinkButtonProps {
  movieId: number;
  variant?: "default" | "outline" | "ghost" | "link" | "destructive" | "secondary";
  size?: "default" | "sm" | "lg" | "icon";
  className?: string;
}

/**
 * Reusable button component for linking to TMDB movie pages
 */
export function TMDBLinkButton({
  movieId,
  variant = "outline",
  size = "default",
  className = "",
}: TMDBLinkButtonProps) {
  const tmdbUrl = `https://www.themoviedb.org/movie/${movieId}`;

  return (
    <Button asChild variant={variant} size={size} className={className}>
      <a
        href={tmdbUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="flex items-center gap-2"
      >
        <ExternalLink className="h-4 w-4" />
        View on TMDB
      </a>
    </Button>
  );
}

