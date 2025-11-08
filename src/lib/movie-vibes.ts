/**
 * Movie vibes/moods that will be translated to genre/keyword weights on the backend
 */
export const MOVIE_VIBES = [
  { id: "lighthearted", label: "Lighthearted" },
  { id: "intense", label: "Intense" },
  { id: "emotional", label: "Emotional" },
  { id: "dark", label: "Dark" },
  { id: "wholesome", label: "Wholesome" },
  { id: "suspenseful", label: "Suspenseful" },
  { id: "fantasy", label: "Fantasy" },
  { id: "true-story", label: "True Story" },
  { id: "cozy", label: "Cozy" },
  { id: "uplifting", label: "Uplifting" },
  { id: "gritty", label: "Gritty" },
  { id: "thought-provoking", label: "Thought-Provoking" },
  { id: "chaotic", label: "Chaotic" },
  { id: "heartwarming", label: "Heartwarming" },
  { id: "somber", label: "Somber" },
  { id: "playful", label: "Playful" },
  { id: "nostalgic", label: "Nostalgic" },
  { id: "adventurous", label: "Adventurous" },
  { id: "mysterious", label: "Mysterious" },
  { id: "funny-comedic", label: "Funny / Comedic" },
  { id: "dramatic", label: "Dramatic" },
  { id: "atmospheric", label: "Atmospheric" },
  { id: "fast-paced", label: "Fast-Paced" },
  { id: "slow-burn", label: "Slow-Burn" },
  { id: "feel-good", label: "Feel-Good" },
  { id: "edge-of-your-seat", label: "Edge-of-Your-Seat" },
  { id: "mind-bending", label: "Mind-Bending" },
  { id: "chill-easy-watch", label: "Chill / Easy-Watch" },
  { id: "comfort-movie", label: "Comfort Movie" },
  { id: "sci-fi", label: "Sci-Fi" },
  { id: "historical", label: "Historical" },
  { id: "futuristic", label: "Futuristic" },
  { id: "supernatural", label: "Supernatural" },
  { id: "crime-focused", label: "Crime-Focused" },
  { id: "survival", label: "Survival" },
  { id: "coming-of-age", label: "Coming-of-Age" },
  { id: "cult-classic-vibes", label: "Cult Classic Vibes" },
  { id: "indie-artsy", label: "Indie / Artsy" },
];

/**
 * Era/release window options
 */
export const ERA_OPTIONS = [
  // Broad ranges
  { id: "70s-earlier", label: "70s & Earlier", value: "70s-earlier" },
  { id: "80s", label: "80s", value: "80s" },
  { id: "90s", label: "90s", value: "90s" },
  { id: "2000-2009", label: "2000–2009", value: "2000-2009" },
  { id: "2010-2019", label: "2010–2019", value: "2010-2019" },
  { id: "2020-present", label: "2020–Present", value: "2020-present" },
  // Abstract options
  { id: "classic", label: "Classic", value: "classic" },
  { id: "older-great", label: "Older but Great", value: "older-great" },
  { id: "newer-releases", label: "Newer Releases", value: "newer-releases" },
  { id: "golden-age", label: "Golden Age", value: "golden-age" },
  { id: "retro-favorites", label: "Retro Favorites", value: "retro-favorites" },
  { id: "vintage-gems", label: "Vintage Gems", value: "vintage-gems" },
  { id: "90s-nostalgia", label: "90s Nostalgia", value: "90s-nostalgia" },
  { id: "early-2000s-feel", label: "Early 2000s Feel", value: "early-2000s-feel" },
  { id: "modern-era", label: "Modern Era", value: "modern-era" },
  { id: "fresh-recent", label: "Fresh & Recent", value: "fresh-recent" },
  { id: "latest-trending", label: "Latest & Trending", value: "latest-trending" },
  { id: "throwbacks", label: "Throwbacks", value: "throwbacks" },
  { id: "timeless-picks", label: "Timeless Picks", value: "timeless-picks" },
  { id: "recent-hits", label: "Recent Hits", value: "recent-hits" },
  { id: "hidden-old-school-finds", label: "Hidden Old-School Finds", value: "hidden-old-school-finds" },
  { id: "pre-cgi-era", label: "Pre-CGI Era", value: "pre-cgi-era" },
  { id: "streaming-era-films", label: "Streaming-Era Films", value: "streaming-era-films" },
  { id: "blockbuster-era", label: "Blockbuster Era", value: "blockbuster-era" },
  { id: "contemporary-stories", label: "Contemporary Stories", value: "contemporary-stories" },
  { id: "old-hollywood-style", label: "Old Hollywood Style", value: "old-hollywood-style" },
  { id: "feels-like-80s", label: "Feels Like the 80s", value: "feels-like-80s" },
  { id: "feels-like-90s", label: "Feels Like the 90s", value: "feels-like-90s" },
  { id: "pre-millennium", label: "Pre-Millennium", value: "pre-millennium" },
  { id: "post-millennium", label: "Post-Millennium", value: "post-millennium" },
  { id: "pre-streaming-era", label: "Pre-Streaming Era", value: "pre-streaming-era" },
  { id: "streaming-era", label: "Streaming Era", value: "streaming-era" },
  { id: "post-covid-era", label: "Post-COVID Era", value: "post-covid-era" },
  { id: "late-night-classics", label: "Late-Night Classics", value: "late-night-classics" },
];

function shuffleArray<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

/**
 * Generate random movie vibe options
 */
export function generateMoodOptions(count: number) {
  return shuffleArray(MOVIE_VIBES)
    .slice(0, count)
    .map((vibe) => ({
      id: vibe.id,
      type: "mood" as const,
      label: vibe.label,
      value: vibe.id,
    }));
}

/**
 * Generate random era options
 */
export function generateEraOptions(count: number) {
  return shuffleArray(ERA_OPTIONS)
    .slice(0, count)
    .map((era) => ({
      id: era.id,
      type: "era" as const,
      label: era.label,
      value: era.value,
    }));
}

