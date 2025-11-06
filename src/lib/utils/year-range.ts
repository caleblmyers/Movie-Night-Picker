/**
 * Generates an array of years from a range
 */
export function generateYearRange(
  startYear: number,
  endYear: number
): number[] {
  return Array.from(
    { length: endYear - startYear + 1 },
    (_, i) => startYear + i
  );
}

/**
 * Checks if a year range is the default (full range)
 */
export function isDefaultYearRange(
  range: number[],
  minYear: number,
  maxYear: number
): boolean {
  return range[0] === minYear && range[1] === maxYear;
}
