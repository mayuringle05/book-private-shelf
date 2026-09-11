import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/components/site/theme-provider";

export const metadata: Metadata = {
  title: { default: "BOOK — The Private Shelf", template: "%s — BOOK" },
  description: "A private digital library about attraction, dating, confidence, and relationships.",
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
