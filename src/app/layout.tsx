import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import Script from "next/script";
import { SITE_URL } from "@/lib/site";
import { SiteHeader } from "@/components/site-header";
import { SiteFooter } from "@/components/site-footer";
import "./globals.css";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
});

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
};

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: "Sudoku Hints - Free Sudoku Solver & Help - fastsudoku",
  description:
    "Free sudoku hints tool on fastsudoku: enter any grid, get the next logical move explained, or reveal the full solution step by step.",
  openGraph: {
    title: "Sudoku Hints - Free Sudoku Solver & Step-by-Step Help",
    description:
      "Stuck on a sudoku? Enter your grid or generate one, get the next logical move explained, or reveal the full solution step by step. Free fastsudoku hints and solver, no sign-up.",
    url: SITE_URL,
    siteName: "fastsudoku",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Sudoku Hints - Free Sudoku Solver & Step-by-Step Help",
    description:
      "Stuck on a sudoku? Enter your grid or generate one, get the next logical move explained, or reveal the full solution step by step.",
  },
};

const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/maker", label: "Maker" },
  { href: "/mega", label: "Mega" },
  { href: "/kids", label: "Kids" },
  { href: "/what-is-sudoku", label: "What Is Sudoku" },
  { href: "/guides", label: "Guides" },
];

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${inter.variable} antialiased`}>
      <body className="flex min-h-screen flex-col">
        <SiteHeader links={NAV_LINKS} />
        <main className="flex-1">{children}</main>
        <SiteFooter />
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-W1GYJK94MB"
          strategy="afterInteractive"
        />
        <Script id="google-analytics" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-W1GYJK94MB');
          `}
        </Script>
      </body>
    </html>
  );
}
