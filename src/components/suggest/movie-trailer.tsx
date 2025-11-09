"use client";

import { memo, useState } from "react";
import Image from "next/image";
import type { MovieTrailer } from "@/types/suggest";
import { Play, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";

interface MovieTrailerProps {
  trailer: MovieTrailer;
  className?: string;
}

function MovieTrailerComponent({ trailer, className }: MovieTrailerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [imageError, setImageError] = useState(false);

  // Generate YouTube embed URL
  const getEmbedUrl = () => {
    if (trailer.site === "YouTube" && trailer.key) {
      return `https://www.youtube.com/embed/${trailer.key}?autoplay=1&rel=0`;
    }
    // For other platforms, use the provided URL
    return trailer.url;
  };

  // Generate thumbnail URL for YouTube
  const getThumbnailUrl = () => {
    if (trailer.site === "YouTube" && trailer.key) {
      return `https://img.youtube.com/vi/${trailer.key}/maxresdefault.jpg`;
    }
    return null;
  };

  const thumbnailUrl = getThumbnailUrl();
  const embedUrl = getEmbedUrl();

  if (isPlaying) {
    return (
      <div className={className}>
        <div className="relative w-full aspect-video rounded-lg overflow-hidden bg-black shadow-md">
          <iframe
            src={embedUrl}
            title={trailer.name || "Movie Trailer"}
            className="w-full h-full"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
      </div>
    );
  }

  return (
    <div className={className}>
      <div className="relative w-full aspect-video rounded-lg overflow-hidden bg-muted group cursor-pointer shadow-md">
        {thumbnailUrl && !imageError ? (
          <Image
            src={thumbnailUrl}
            alt={trailer.name || "Trailer thumbnail"}
            fill
            className="object-cover transition-transform group-hover:scale-105"
            onError={() => setImageError(true)}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-linear-to-br from-primary/20 to-primary/5">
            <Play className="h-16 w-16 text-primary opacity-50" />
          </div>
        )}
        <button
          onClick={() => setIsPlaying(true)}
          className="absolute inset-0 w-full h-full flex items-center justify-center bg-black/40 group-hover:bg-black/50 transition-colors duration-200"
          aria-label="Play trailer"
        >
          <div className="flex flex-col items-center gap-2">
            <div className="rounded-full bg-primary/90 p-4 group-hover:bg-primary group-hover:scale-110 transition-all duration-200">
              <Play className="h-8 w-8 text-primary-foreground fill-primary-foreground" />
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

