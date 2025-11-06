"use client";

import { MovieResult, Movie } from "@/types/suggest";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";

interface MovieResultDisplayProps {
  movie: MovieResult | Movie;
  title?: string;
  subtitle?: string;
  showActions?: boolean;
}

export function MovieResultDisplay({
  movie,
  title = "Your Movie Pick",
  subtitle = "Based on your preferences",
  showActions = true,
}: MovieResultDisplayProps) {
  const posterUrl = movie.posterUrl || "/placeholder-poster.jpg";
  const releaseYear = movie.releaseDate
    ? new Date(movie.releaseDate).getFullYear()
    : null;

  return (
    <div className="flex flex-col items-center justify-center gap-8 px-4 py-16 max-w-4xl mx-auto">
      <div className="text-center space-y-2">
        <h1 className="text-4xl font-bold tracking-tight text-foreground">
          {title}
        </h1>
        {subtitle && (
          <p className="text-lg text-muted-foreground">{subtitle}</p>
        )}
      </div>

      <div className="w-full bg-card border rounded-lg p-8 shadow-lg">
        <div className="flex flex-col md:flex-row gap-6">
          <div className="flex-shrink-0 mx-auto md:mx-0">
            <Image
              src={posterUrl}
              alt={movie.title}
              width={300}
              height={450}
              className="rounded-lg object-cover"
              unoptimized
            />
          </div>
          <div className="flex-1 space-y-4">
            <div>
              <h2 className="text-3xl font-bold text-foreground mb-2">
                {movie.title}
              </h2>
              {releaseYear && (
                <p className="text-muted-foreground">{releaseYear}</p>
              )}
            </div>
            {movie.overview && (
              <div>
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  Overview
                </h3>
                <p className="text-muted-foreground leading-relaxed">
                  {movie.overview}
                </p>
              </div>
            )}
            {showActions && (
              <div className="flex gap-4 pt-4">
                <Button asChild>
                  <Link href="/">Start Over</Link>
                </Button>
                <Button asChild variant="outline">
                  <Link href="/suggest">Try Again</Link>
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

