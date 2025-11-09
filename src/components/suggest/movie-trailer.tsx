"use client";

import { memo, useState, useEffect } from "react";
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
  const [thumbnailUrl, setThumbnailUrl] = useState<string | null>(null);

  // Generate YouTube embed URL
  const getEmbedUrl = () => {
    if (trailer.site === "YouTube" && trailer.key) {
      return `https://www.youtube.com/embed/${trailer.key}?autoplay=1&rel=0`;
    }
    // For other platforms, use the provided URL
    return trailer.url;
  };

  // Initialize thumbnail URL on mount with fallback strategy
  useEffect(() => {
    if (trailer.site === "YouTube" && trailer.key) {
      // Try hqdefault first (more reliable), then maxresdefault if available
      // hqdefault is more widely available than maxresdefault
      setThumbnailUrl(`https://img.youtube.com/vi/${trailer.key}/hqdefault.jpg`);
      setImageError(false);
    } else {
      setThumbnailUrl(null);
    }
  }, [trailer.site, trailer.key]);

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
              // If hqdefault fails, try other YouTube thumbnail formats
              if (thumbnailUrl?.includes("img.youtube.com")) {
                const formats = ["mqdefault", "sddefault", "default"];
                const currentFormat = thumbnailUrl.match(/\/(\w+)\.jpg$/)?.[1];
                const currentIndex = formats.indexOf(currentFormat || "");
                
                if (currentIndex < formats.length - 1) {
                  const nextFormat = formats[currentIndex + 1];
                  const fallbackUrl = thumbnailUrl.replace(
                    `/${currentFormat}.jpg`,
                    `/${nextFormat}.jpg`
                  );
                  
                  const testImg = new Image();
                  testImg.onload = () => {
                    setThumbnailUrl(fallbackUrl);
                    setImageError(false);
                  };
                  testImg.onerror = () => {
                    setImageError(true);
                  };
                  testImg.src = fallbackUrl;
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

