import type { Metadata, Viewport } from "next";
import "@fontsource-variable/geist/wght.css";
import "@fontsource-variable/jetbrains-mono/wght.css";
import "@fontsource-variable/fraunces/full.css";
import "@fontsource-variable/fraunces/full-italic.css";
import "@fontsource-variable/newsreader/wght.css";
import "@fontsource-variable/newsreader/wght-italic.css";
import "./globals.css";
import { ThemeProvider } from "@/components/site/theme-provider";
import { PageExperience } from "@/components/site/page-experience";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000"),
  title: { default: "BOOK — The Private Shelf", template: "%s — BOOK" },
  description: "A premium private library of original books on attraction, dating, confidence, and relationships.",
  keywords: ["books", "private library", "attraction", "confidence", "relationships", "editorial books"],
  alternates: { canonical: "/" },
  openGraph: {
    title: "BOOK — The Private Shelf",
    description: "Attraction is a language. Learn how to read it.",
    type: "website",
    siteName: "BOOK — The Private Shelf",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "BOOK — The Private Shelf",
    description: "Attraction is a language. Learn how to read it.",
  },
  robots: { index: true, follow: true },
};

const websiteJsonLd = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: "BOOK — The Private Shelf",
  description: "A premium private library of original books on attraction, dating, confidence, and relationships.",
  potentialAction: {
    "@type": "SearchAction",
    target: {
      "@type": "EntryPoint",
      urlTemplate: (process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000") + "/library?q={search_term_string}",
    },
    "query-input": "required name=search_term_string",
  },
};

export const viewport: Viewport = {
  themeColor: "#090807",
  colorScheme: "dark",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteJsonLd) }}
        />
        <ThemeProvider>
          <PageExperience>{children}</PageExperience>
        </ThemeProvider>
      </body>
    </html>
  );
}
