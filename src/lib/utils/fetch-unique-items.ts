/**
 * Fetches unique items from a GraphQL query, avoiding duplicates
 */
export async function fetchUniqueItems<T extends { id: number }>(params: {
  count: number;
  fetchFn: () => Promise<T | undefined>;
  delay?: number;
  maxAttempts?: number;
}): Promise<T[]> {
  const { count, fetchFn, delay = 100, maxAttempts = count * 3 } = params;
  const items: T[] = [];
  const seenIds = new Set<number>();
  let attempts = 0;

  while (items.length < count && attempts < maxAttempts) {
    const item = await fetchFn();
    if (item && !seenIds.has(item.id)) {
      items.push(item);
      seenIds.add(item.id);
    }
    attempts++;
    if (items.length < count && delay > 0) {
      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  }

  return items;
}

