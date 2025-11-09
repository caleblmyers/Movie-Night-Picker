import Link from "next/link";

export function Footer() {
  return (
    <footer className="mt-auto border-t bg-background/95 backdrop-blur-sm">
      <div className="container mx-auto px-4 py-6">
        <div className="flex flex-col items-center justify-center gap-4 text-center">
          <div className="flex flex-col items-center justify-center gap-2 text-sm text-muted-foreground sm:flex-row">
            <span>This product uses the</span>
            <Link
              href="https://www.themoviedb.org"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-2 py-1 rounded bg-[#0d253f] text-[#01b4e4] hover:bg-[#0d253f]/90 transition-colors font-semibold"
              aria-label="The Movie Database"
            >
              <span className="text-[#01b4e4] font-bold">TMDB</span>
              <span className="text-[#90cea1]">API</span>
            </Link>
            <span>but is not endorsed or certified by</span>
            <Link
              href="https://www.themoviedb.org"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-[#01b4e4] hover:text-[#01b4e4]/80 transition-colors font-semibold underline"
            >
              TMDB
            </Link>
          </div>
          <p className="text-xs text-muted-foreground">
            Movie data and images provided by{" "}
            <Link
              href="https://www.themoviedb.org"
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#01b4e4] hover:underline"
            >
              The Movie Database
            </Link>
          </p>
        </div>
      </div>
    </footer>
  );
}

