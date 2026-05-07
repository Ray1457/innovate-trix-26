import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link";
import {
  IoBagOutline,
  IoCartOutline,
  IoGridOutline,
  IoMusicalNotesOutline,
  IoPersonOutline,
  IoStatsChartOutline,
} from "react-icons/io5";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Uber-Jo",
  description: "Uber-Jo landing page",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-black text-[var(--text)]">
        <header className="relative z-10 mx-auto w-full max-w-6xl px-4 pb-2 pt-5 sm:px-6 lg:px-8 lg:pt-8">
          <div className="flex items-center justify-between">
            <Link
              href="/"
              className="text-base sm:text-lg font-semibold tracking-tight text-[var(--accent)] transform transition ease-in-out duration-300 cursor-pointer hover:scale-110 hover:opacity-80"
            >
              Uber-Jo
            </Link>

            <nav aria-label="Primary" className="hidden flex-1 items-center justify-center gap-14 md:flex lg:gap-16">
              {[
                IoGridOutline,
                IoStatsChartOutline,
                IoMusicalNotesOutline,
                IoBagOutline,
                IoCartOutline,
                IoPersonOutline,
              ].map((Icon, index) => {
                const isStats = Icon === IoStatsChartOutline;
                const inner = (
                  <button
                    key={index}
                    type="button"
                    className="text-[var(--primary)] transform transition ease-in-out duration-300 cursor-pointer hover:scale-110 hover:opacity-80"
                    aria-label={`Navigation item ${index + 1}`}
                  >
                    <Icon className="h-8 w-8" />
                  </button>
                );

                return isStats ? (
                  <Link key={index} href="/leaderboard" aria-label="Leaderboard">
                    {inner}
                  </Link>
                ) : (
                  inner
                );
              })}
            </nav>

            <div className="w-8 md:w-12" />
          </div>

          <div className="pointer-events-none mt-2 h-px w-full bg-[rgba(171,151,223,0.25)]" />
        </header>

        <div className="flex flex-1 flex-col">{children}</div>
      </body>
    </html>
  );
}
