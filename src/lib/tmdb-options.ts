import { SelectionOption } from "@/types/suggest";

// Static genres list (no backend query for genres)
export const GENRES = [
  { id: "28", label: "Action" },
  { id: "12", label: "Adventure" },
  { id: "16", label: "Animation" },
  { id: "35", label: "Comedy" },
  { id: "80", label: "Crime" },
  { id: "99", label: "Documentary" },
  { id: "18", label: "Drama" },
  { id: "10751", label: "Family" },
  { id: "14", label: "Fantasy" },
  { id: "36", label: "History" },
  { id: "27", label: "Horror" },
  { id: "10402", label: "Music" },
  { id: "9648", label: "Mystery" },
  { id: "10749", label: "Romance" },
  { id: "878", label: "Science Fiction" },
  { id: "10770", label: "TV Movie" },
  { id: "53", label: "Thriller" },
  { id: "10752", label: "War" },
  { id: "37", label: "Western" },
];

// Static year ranges (no backend query for year ranges)
const YEAR_RANGES = [
  { id: "2020s", label: "2020s", value: "2020-2029" },
  { id: "2010s", label: "2010s", value: "2010-2019" },
  { id: "2000s", label: "2000s", value: "2000-2009" },
  { id: "1990s", label: "1990s", value: "1990-1999" },
  { id: "1980s", label: "1980s", value: "1980-1989" },
  { id: "1970s", label: "1970s", value: "1970-1979" },
  { id: "1960s", label: "1960s", value: "1960-1969" },
  { id: "1950s", label: "1950s", value: "1950-1959" },
];

function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

// Helper function to convert Movie to SelectionOption
export function movieToOption(movie: {
  id: number;
  title: string;
  releaseDate?: string;
}): SelectionOption {
  const year = movie.releaseDate
    ? new Date(movie.releaseDate).getFullYear()
    : "";
  return {
    id: movie.id.toString(),
    type: "movie",
    label: year ? `${movie.title} (${year})` : movie.title,
    value: movie.id.toString(),
  };
}

// Helper function to convert Person to SelectionOption
export function personToOption(person: {
  id: number;
  name: string;
}): SelectionOption {
  return {
    id: person.id.toString(),
    type: "actor",
    label: person.name,
    value: person.id.toString(),
  };
}

// Generate static options (genres and year ranges)
export function generateStaticOptions(
  type: "genre" | "yearRange",
  count: number
): SelectionOption[] {
  let source: Array<{ id: string; label: string; value?: string }> = [];

  if (type === "genre") {
    source = GENRES;
  } else if (type === "yearRange") {
    source = YEAR_RANGES;
  }

  return shuffleArray(source)
    .slice(0, count)
    .map((item) => ({
      id: item.id,
      type,
      label: item.label,
      value: item.value || item.id,
    }));
}
