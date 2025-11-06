import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background">
      <main className="flex flex-col items-center justify-center gap-12 px-4 py-16">
        <h1 className="text-6xl font-bold tracking-tight text-foreground">
          Movie Night Picker
        </h1>
        <div className="flex flex-col gap-4 sm:flex-row">
          <Button asChild size="lg" className="min-w-[200px] text-lg">
            <Link href="/suggest">Suggest</Link>
          </Button>
          <Button asChild size="lg" variant="outline" className="min-w-[200px] text-lg">
            <Link href="/shuffle">Shuffle</Link>
          </Button>
        </div>
      </main>
    </div>
  );
}
