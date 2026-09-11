import type { Metadata, Viewport } from "next";
import "@fontsource-variable/geist/wght.css";
import "@fontsource-variable/geist-mono/wght.css";
import "@fontsource/instrument-serif/400.css";
import "@fontsource/instrument-serif/400-italic.css";
import "@fontsource-variable/newsreader/wght.css";
import "@fontsource-variable/newsreader/wght-italic.css";
import "./globals.css";
import { ThemeProvider } from "@/components/site/theme-provider";

export const metadata: Metadata = {
  title: { default: "BOOK — The Private Shelf", template: "%s — BOOK" },
  description: "A premium private library of original books on attraction, dating, confidence, and relationships.",
  openGraph: {
    title: "BOOK — The Private Shelf",
    description: "Attraction is a language. Learn how to read it.",
    type: "website",
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#090807",
  colorScheme: "dark",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body>
        <ThemeProvider>{children}</ThemeProvider>
      </body>
    </html>
  );
}
