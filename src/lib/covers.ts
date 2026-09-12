export function coverForSlug(slug: string, variant?: number) {
  return `/covers/${slug}${variant && variant > 1 ? `-v${variant}` : ""}.svg`;
}

const variantCache = new Map<string, number>();

/** Cached session variant — safe as a useSyncExternalStore getSnapshot. */
export function sessionCoverVariantCached(slug: string): number {
  let v = variantCache.get(slug);
  if (v === undefined) {
    v = sessionCoverVariant(slug);
    variantCache.set(slug, v);
  }
  return v;
}

/** Original edition + 5 generated variants per volume. */
export const COVER_VARIANT_COUNT = 6;

/**
 * Pick a stable cover variant for this browser session: every session shows a
 * different edition of the shelf, but the choice holds while you browse.
 * Server render always returns the original edition (no session storage there).
 */
export function sessionCoverVariant(slug: string): number {
  if (typeof window === "undefined") return 1;
  const key = `book-cover-variant-${slug}`;
  try {
    const stored = window.sessionStorage.getItem(key);
    if (stored) {
      const n = Number(stored);
      if (n >= 1 && n <= COVER_VARIANT_COUNT) return n;
    }
    const variant = 1 + Math.floor(Math.random() * COVER_VARIANT_COUNT);
    window.sessionStorage.setItem(key, String(variant));
    return variant;
  } catch {
    return 1;
  }
}