import type { MetadataRoute } from "next";

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: "BOOK — The Private Shelf",
    short_name: "BOOK",
    description: "A premium private library of original books on attraction, dating, confidence, and relationships.",
    start_url: "/",
    display: "standalone",
    background_color: "#090807",
    theme_color: "#090807",
    icons: [{ src: "/icon.svg", sizes: "any", type: "image/svg+xml" }],
  };
}