export default function SuggestPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <main className="flex flex-col items-center justify-center gap-8 px-4 py-16 max-w-3xl">
        <h1 className="text-4xl font-bold tracking-tight text-foreground">
          Suggest Mode
        </h1>
        <p className="text-lg text-muted-foreground text-center">
          Choose between movie options to help refine a pick. We will learn your preferences
          and suggest the perfect movie for your movie night.
        </p>
      </main>
    </div>
  );
}

