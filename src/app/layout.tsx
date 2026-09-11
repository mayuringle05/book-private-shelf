import type { Metadata, Viewport } from "next";
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
  themeColor: "#080706",
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
