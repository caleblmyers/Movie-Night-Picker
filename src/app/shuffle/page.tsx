export default function ShufflePage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <main className="flex flex-col items-center justify-center gap-8 px-4 py-16 max-w-3xl">
        <h1 className="text-4xl font-bold tracking-tight text-foreground">
          Shuffle Mode
        </h1>
        <p className="text-lg text-muted-foreground text-center">
          Filter by genre, year range, and crew before randomizing. Get a random movie
          selection based on your preferences for a quick and fun movie night pick.
        </p>
      </main>
    </div>
  );
}

