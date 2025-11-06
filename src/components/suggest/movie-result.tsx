'use client';

import { MovieResult, Movie } from '@/types/suggest';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

interface MovieResultProps {
  movie: MovieResult | Movie;
}

export function MovieResultDisplay({ movie }: MovieResultProps) {
  const posterUrl = movie.posterUrl || '/placeholder-poster.jpg';

  return (
    <div className="flex flex-col items-center justify-center gap-8 px-4 py-16 max-w-4xl mx-auto">
      <div className="text-center space-y-2">
        <h1 className="text-4xl font-bold tracking-tight text-foreground">
          Your Movie Pick
        </h1>
        <p className="text-lg text-muted-foreground">
          Based on your preferences
        </p>
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
              {movie.releaseDate && (
                <p className="text-muted-foreground">
                  {new Date(movie.releaseDate).getFullYear()}
                </p>
              )}
            </div>
            <div>
              <h3 className="text-lg font-semibold text-foreground mb-2">
                Overview
              </h3>
              <p className="text-muted-foreground leading-relaxed">
                {movie.overview || 'No overview available.'}
              </p>
            </div>
            <div className="flex gap-4 pt-4">
              <Button asChild>
                <Link href="/">Start Over</Link>
              </Button>
              <Button asChild variant="outline">
                <Link href="/suggest">Try Again</Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

