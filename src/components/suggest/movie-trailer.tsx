"use client";

import { memo, useState, useMemo, useRef } from "react";
import Image from "next/image";
import type { MovieTrailer } from "@/types/suggest";
import { Play, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";

interface MovieTrailerProps {
  trailer: MovieTrailer;
  className?: string;
}

function MovieTrailerComponent({ trailer, className }: MovieTrailerProps) {
  // Create a unique key for the trailer to force remount when it changes
  const trailerKey = `${trailer.site}-${trailer.key}`;
  
  // Use a separate component for the thumbnail to reset state when key changes
  return <MovieTrailerThumbnail key={trailerKey} trailer={trailer} className={className} />;
}

function MovieTrailerThumbnail({ trailer, className }: MovieTrailerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [imageError, setImageError] = useState(false);
  const [fallbackFormat, setFallbackFormat] = useState<string | null>(null);
  
  // Compute thumbnail URL from props
  const thumbnailUrl = useMemo(() => {
    if (trailer.site === "YouTube" && trailer.key) {
      // Use fallback format if set, otherwise start with hqdefault
      const format = fallbackFormat || "hqdefault";
      return `https://img.youtube.com/vi/${trailer.key}/${format}.jpg`;
    }
    return null;
  }, [trailer.site, trailer.key, fallbackFormat]);

  // Generate YouTube embed URL
  const getEmbedUrl = () => {
    if (trailer.site === "YouTube" && trailer.key) {
      return `https://www.youtube.com/embed/${trailer.key}?autoplay=1&rel=0`;
    }
    // For other platforms, use the provided URL
    return trailer.url;
  };

  const embedUrl = getEmbedUrl();

  if (isPlaying) {
    return (
      <div className={className}>
        <div className="relative w-full aspect-video overflow-hidden rounded-lg bg-black shadow-md">
          <iframe
            src={embedUrl}
            title={trailer.name || "Movie Trailer"}
            className="h-full w-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
      </div>
    );
  }

  return (
    <div className={className}>
      {/* Layout → spacing → visual → states */}
      <div className="group relative w-full aspect-video overflow-hidden rounded-lg bg-muted shadow-md cursor-pointer">
        {thumbnailUrl && !imageError ? (
          <Image
            src={thumbnailUrl}
            alt={trailer.name || "Trailer thumbnail"}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            className="object-cover transition-transform group-hover:scale-105"
            onError={() => {
              // If current format fails, try other YouTube thumbnail formats
              if (thumbnailUrl?.includes("img.youtube.com") && trailer.key) {
                const formats = ["hqdefault", "mqdefault", "sddefault", "default"];
                const currentFormat = fallbackFormat || "hqdefault";
                const currentIndex = formats.indexOf(currentFormat);
                
                if (currentIndex < formats.length - 1) {
                  const nextFormat = formats[currentIndex + 1];
                  // Update fallback format, which will trigger useMemo to recompute thumbnailUrl
                  setFallbackFormat(nextFormat);
                  setImageError(false);
                } else {
                  setImageError(true);
                }
              } else {
                setImageError(true);
              }
            }}
            unoptimized
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-linear-to-br from-primary/20 to-primary/5">
            <Play className="h-16 w-16 text-primary opacity-50" />
          </div>
        )}
        {/* Layout → spacing → visual → states */}
        <button
          onClick={() => setIsPlaying(true)}
          className="absolute inset-0 flex h-full w-full items-center justify-center bg-black/40 transition-colors duration-200 group-hover:bg-black/50"
          aria-label="Play trailer"
        >
          <div className="flex flex-col items-center gap-2">
            <div className="rounded-full bg-primary/90 p-4 transition-all duration-200 group-hover:scale-110 group-hover:bg-primary">
              <Play className="h-8 w-8 fill-primary-foreground text-primary-foreground" />
            </div>
            {trailer.name && (
              <p className="text-sm font-medium text-white drop-shadow-lg">
                {trailer.name}
              </p>
            )}
          </div>
        </button>
      </div>
      {trailer.url && (
        <div className="mt-3">
          <Button
            variant="outline"
            size="sm"
            asChild
            className="w-full"
          >
            <a
              href={trailer.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2"
            >
              <ExternalLink className="h-4 w-4" />
              Open on {trailer.site || "External Site"}
            </a>
          </Button>
        </div>
      )}
    </div>
  );
}

export const MovieTrailerDisplay = memo(MovieTrailerComponent);

