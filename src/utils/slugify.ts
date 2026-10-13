/**
 * Convert a title to a URL-friendly slug.
 * e.g. "Annual Alumni Homecoming 2026 — Registration Now Open"
 *      → "annual-alumni-homecoming-2026-registration-now-open"
 */
export function slugify(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // strip diacritics
    .replace(/[^a-z0-9\s-]/g, "") // drop punctuation
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}
