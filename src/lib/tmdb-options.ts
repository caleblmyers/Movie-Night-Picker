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

function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

// Helper function to convert Person to SelectionOption (for actors)
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

// Helper function to convert Person to SelectionOption (for directors)
export function directorToOption(person: {
  id: number;
  name: string;
}): SelectionOption {
  return {
    id: person.id.toString(),
    type: "director",
    label: person.name,
    value: person.id.toString(),
  };
}

// Generate static options (genres)
export function generateStaticOptions(
  type: "genre",
  count: number
): SelectionOption[] {
  const source = GENRES;

  return shuffleArray(source)
    .slice(0, count)
    .map((item) => ({
      id: item.id,
      type: "genre" as const,
      label: item.label,
      value: item.id,
    }));
}
