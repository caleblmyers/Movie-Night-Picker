"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";

export function EmptySavedMovies() {
  return (
    <div className="bg-card/50 backdrop-blur-sm border rounded-lg p-12 text-center space-y-6">
      <p className="text-muted-foreground text-lg">
        Your movie collection is empty. Start building your watchlist!
      </p>
      <div className="flex gap-4 justify-center">
        <Button asChild className="bg-linear-to-r from-primary to-primary/80">
          <Link href="/suggest">Get Suggestions</Link>
        </Button>
        <Button asChild variant="outline">
          <Link href="/shuffle">Shuffle Movies</Link>
        </Button>
      </div>
    </div>
  );
}

