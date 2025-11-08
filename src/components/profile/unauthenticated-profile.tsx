"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";

export function UnauthenticatedProfile() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-muted/20 flex items-center justify-center px-4 py-16">
      <div className="text-center space-y-6 max-w-md">
        <h1 className="text-5xl font-bold tracking-tight bg-gradient-to-r from-primary via-primary/80 to-primary bg-clip-text text-transparent">
          Join the Show
        </h1>
        <p className="text-muted-foreground text-lg">
          Sign in to view your saved movies, ratings, and reviews
        </p>
        <div className="flex gap-4 justify-center pt-4">
          <Button asChild size="lg" className="bg-gradient-to-r from-primary to-primary/80">
            <Link href="/login">Sign In</Link>
          </Button>
          <Button asChild variant="outline" size="lg">
            <Link href="/register">Sign Up</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}

