"use client";

import { useQuery } from "@apollo/client/react";
import { SUGGEST_HISTORY } from "@/lib/graphql";
import { Movie } from "@/types/suggest";
import Link from "next/link";
import Image from "next/image";
import { SectionHeader } from "@/components/common/section-header";
import { LoadingState } from "@/components/shared/loading-state";

export function SuggestHistory() {
  const { data, loading, error } = useQuery<{ suggestHistory: Movie[] }>(
    SUGGEST_HISTORY,
    {
      fetchPolicy: "cache-and-network",
      errorPolicy: "all",
    }
  );

  // Don't show anything if loading (to avoid flash) or if there's an error
  if (loading) {
    return null;
  }

  if (error || !data?.suggestHistory || data.suggestHistory.length === 0) {
    return null;
  }

  const history = data.suggestHistory;

  return (
    <div className="w-full max-w-4xl mx-auto px-4 py-8 border-t">
      <SectionHeader className="mb-6">Your Recent Suggestions</SectionHeader>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
        {history.map((movie) => (
          <Link
            key={movie.id}
            href={`/movie/${movie.id}`}
            className="group flex flex-col gap-2 transition-transform hover:scale-105"
          >
            <div className="relative aspect-2/3 w-full overflow-hidden rounded-lg bg-muted">
              {movie.posterUrl ? (
                <Image
                  src={movie.posterUrl}
                  alt={movie.title}
                  fill
                  sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, 20vw"
                  className="object-cover transition-transform group-hover:scale-105"
                />
              ) : (
                <div className="flex h-full w-full items-center justify-center">
                  <span className="text-xs text-muted-foreground">No Poster</span>
                </div>
              )}
            </div>
            <div className="space-y-1">
              <h3 className="text-sm font-semibold text-foreground line-clamp-2 group-hover:text-primary transition-colors">
                {movie.title}
              </h3>
              {movie.releaseDate && (
                <p className="text-xs text-muted-foreground">
                  {new Date(movie.releaseDate).getFullYear()}
                </p>
              )}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

