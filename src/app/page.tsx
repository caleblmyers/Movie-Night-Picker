import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Film, Shuffle, Sparkles, Star, Heart, MessageSquare } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-muted/20">
      {/* Hero Section */}
      <main className="flex flex-col items-center justify-center min-h-[calc(100vh-80px)] px-4 py-16">
        <div className="text-center space-y-8 max-w-4xl">
          {/* Main Title with Theater Vibe */}
          <div className="space-y-4">
            <div className="flex items-center justify-center gap-3 mb-4">
              <Film className="h-12 w-12 text-primary animate-pulse" />
              <h1 className="text-7xl md:text-8xl font-bold tracking-tight bg-gradient-to-r from-primary via-primary/80 to-primary bg-clip-text text-transparent">
                Movie Night Picker
              </h1>
              <Sparkles className="h-12 w-12 text-primary animate-pulse" />
            </div>
            <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl mx-auto">
              Your personal movie curator for the perfect night in
            </p>
          </div>

          {/* Main Feature Buttons */}
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center pt-8">
            <Button
              asChild
              size="lg"
              className="min-w-[240px] h-16 text-lg bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 shadow-lg shadow-primary/20"
            >
              <Link href="/suggest" className="flex items-center gap-2">
                <Sparkles className="h-5 w-5" />
                Suggest a Movie
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="min-w-[240px] h-16 text-lg border-2 hover:bg-accent"
            >
              <Link href="/shuffle" className="flex items-center gap-2">
                <Shuffle className="h-5 w-5" />
                Shuffle & Discover
              </Link>
            </Button>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-16">
            <div className="bg-card/50 backdrop-blur-sm border rounded-lg p-6 space-y-3 hover:border-primary/50 transition-colors">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <Sparkles className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-lg font-semibold">Smart Suggestions</h3>
              </div>
              <p className="text-sm text-muted-foreground">
                Answer a few questions and get personalized movie recommendations tailored to your mood
              </p>
            </div>

            <div className="bg-card/50 backdrop-blur-sm border rounded-lg p-6 space-y-3 hover:border-primary/50 transition-colors">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <Shuffle className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-lg font-semibold">Random Discovery</h3>
              </div>
              <p className="text-sm text-muted-foreground">
                Filter by genre, year, or cast and let us surprise you with a random pick
              </p>
            </div>

            <div className="bg-card/50 backdrop-blur-sm border rounded-lg p-6 space-y-3 hover:border-primary/50 transition-colors">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <Heart className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-lg font-semibold">Save & Review</h3>
              </div>
              <p className="text-sm text-muted-foreground">
                Create an account to save favorites, rate movies, and write reviews
              </p>
            </div>
          </div>

          {/* Account Benefits */}
          <div className="pt-12 space-y-4">
            <p className="text-sm text-muted-foreground">
              <Link href="/register" className="text-primary hover:underline font-medium">
                Sign up for free
              </Link>{" "}
              to unlock these features:
            </p>
            <div className="flex flex-wrap justify-center gap-6 text-sm">
              <div className="flex items-center gap-2">
                <Heart className="h-4 w-4 text-primary" />
                <span>Save your favorite movies</span>
              </div>
              <div className="flex items-center gap-2">
                <Star className="h-4 w-4 text-primary" />
                <span>Rate movies 1-10</span>
              </div>
              <div className="flex items-center gap-2">
                <MessageSquare className="h-4 w-4 text-primary" />
                <span>Write and edit reviews</span>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
