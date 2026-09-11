import { foundingCatalog } from "@/lib/catalog-fallback";
import { getBookBySlug, getBookUnits } from "@/lib/repository";

export async function safeBook(slug: string) {
  try {
    const book = await getBookBySlug(slug);
    if (!book) return null;
    const units = book.status === "published" ? await getBookUnits(book.id, true) : [];
    return { book, units };
  } catch {
    const book = foundingCatalog.find((item) => item.slug === slug) ?? null;
    return book ? { book, units: [] } : null;
  }
}
