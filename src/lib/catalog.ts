import { foundingCatalog } from "@/lib/catalog-fallback";
import { getPublishedOrCatalogBooks } from "@/lib/repository";

export async function safeCatalog() {
  try {
    return await getPublishedOrCatalogBooks();
  } catch {
    return foundingCatalog;
  }
}
