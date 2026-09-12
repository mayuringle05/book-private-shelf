import type { MetadataRoute } from "next";
import { safeCatalog } from "@/lib/catalog";

function siteUrl(): string {
  return (process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000").replace(/\/$/, "");
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = siteUrl();
  const books = await safeCatalog();

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${base}/`, changeFrequency: "weekly", priority: 1 },
    { url: `${base}/library`, changeFrequency: "weekly", priority: 0.9 },
  ];

  const bookRoutes: MetadataRoute.Sitemap = books.map((book) => ({
    url: `${base}/books/${book.slug}`,
    lastModified: book.published_at ?? undefined,
    changeFrequency: "monthly",
    priority: 0.8,
  }));

  return [...staticRoutes, ...bookRoutes];
}