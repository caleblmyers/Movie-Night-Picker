"use client";

import { memo, useState, useRef, useEffect, useCallback } from "react";
import { Collection } from "@/types/suggest";
import { CardContainer } from "@/components/common/card-container";
import { ChevronLeft, ChevronRight, Film } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";

interface CollectionCardProps {
  collection: Collection;
}

function CollectionCardComponent({ collection }: CollectionCardProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  const movies = collection.movies || [];

  const checkScrollability = useCallback(() => {
    if (!scrollRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
    setCanScrollLeft(scrollLeft > 0);
    setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
  }, []);

  useEffect(() => {
    checkScrollability();
    const scrollElement = scrollRef.current;
    if (scrollElement) {
      scrollElement.addEventListener("scroll", checkScrollability);
      // Check on resize
      window.addEventListener("resize", checkScrollability);
      return () => {
        scrollElement.removeEventListener("scroll", checkScrollability);
        window.removeEventListener("resize", checkScrollability);
      };
    }
  }, [checkScrollability, movies.length]);

  const scroll = useCallback((direction: "left" | "right") => {
    if (!scrollRef.current) return;
    const scrollAmount = 200;
    const newScrollLeft =
      direction === "left"
        ? scrollRef.current.scrollLeft - scrollAmount
        : scrollRef.current.scrollLeft + scrollAmount;
    scrollRef.current.scrollTo({ left: newScrollLeft, behavior: "smooth" });
  }, []);

  return (
    <CardContainer className="space-y-4">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <Link href={`/collections/${collection.id}`}>
            <h3 className="text-xl font-semibold text-foreground mb-1 hover:text-primary transition-colors">
              {collection.name}
            </h3>
          </Link>
          {collection.description && (
            <p className="text-sm text-muted-foreground line-clamp-2">
              {collection.description}
            </p>
          )}
        </div>
        {collection.isPublic && (
          <span className="text-xs bg-primary/20 text-primary px-2 py-1 rounded shrink-0">
            Public
          </span>
        )}
      </div>

      {movies.length === 0 ? (
        <div className="flex items-center justify-center h-32 bg-muted rounded">
          <div className="text-center">
            <Film className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">No movies yet</p>
          </div>
        </div>
      ) : (
        <div className="relative">
          {/* Left scroll button */}
          {canScrollLeft && (
            <Button
              variant="outline"
              size="icon"
              className="absolute left-0 top-1/2 -translate-y-1/2 z-10 h-8 w-8 bg-background/90 backdrop-blur-sm shadow-md"
              onClick={() => scroll("left")}
              aria-label="Scroll left"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
          )}

          {/* Scrollable movie list */}
          <div
            ref={scrollRef}
            onScroll={checkScrollability}
            className="flex gap-3 overflow-x-auto pb-2 px-1 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
          >
            {movies.map((collectionMovie) => (
              <Link
                key={collectionMovie.id}
                href={`/movie/${collectionMovie.movie?.id || collectionMovie.tmdbId}`}
                className="group shrink-0"
              >
                <div className="relative w-24 aspect-2/3 overflow-hidden rounded bg-muted transition-opacity group-hover:opacity-80">
                  {collectionMovie.movie?.posterUrl ? (
                    <Image
                      src={collectionMovie.movie.posterUrl}
                      alt={collectionMovie.movie.title}
                      fill
                      sizes="96px"
                      className="object-cover"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center">
                      <Film className="h-6 w-6 text-muted-foreground" />
                    </div>
                  )}
                </div>
              </Link>
            ))}
          </div>

          {/* Right scroll button */}
          {canScrollRight && (
            <Button
              variant="outline"
              size="icon"
              className="absolute right-0 top-1/2 -translate-y-1/2 z-10 h-8 w-8 bg-background/90 backdrop-blur-sm shadow-md"
              onClick={() => scroll("right")}
              aria-label="Scroll right"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          )}
        </div>
      )}

      <div className="flex items-center justify-between text-sm text-muted-foreground pt-2 border-t">
        <span>{collection.movieCount} movie{collection.movieCount !== 1 ? "s" : ""}</span>
        <Link href={`/collections/${collection.id}`}>
          <Button variant="ghost" size="sm">
            View All
          </Button>
        </Link>
      </div>
    </CardContainer>
  );
}

export const CollectionCard = memo(CollectionCardComponent);

