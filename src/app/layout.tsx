import type { Metadata } from "next";
import { Playfair_Display, Inter } from "next/font/google";
import "./globals.css";

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-serif",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Writely — Social Platform for Writers & Readers",
  description:
    "A modern social network built specifically for writers. Publish stories, discover works, connect with authors, and polish your craft with AI writing tools.",
  keywords: ["writing", "stories", "poetry", "novels", "essays", "authors", "social network", "AI writing"],
  authors: [{ name: "Writely" }],
  openGraph: {
    title: "Writely — Social Platform for Writers & Readers",
    description: "Publish stories, discover works, connect with authors, and polish your craft with AI writing tools.",
    type: "website",
    siteName: "Writely",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${playfair.variable} ${inter.variable}`} suppressHydrationWarning>
      <body className="min-h-screen bg-background text-foreground font-sans antialiased">
        {children}
      </body>
    </html>
  );
}
