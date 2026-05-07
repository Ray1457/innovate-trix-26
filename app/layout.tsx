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

            <nav
              aria-label="Primary"
              className="hidden flex-1 items-center justify-center gap-14 md:flex lg:gap-16"
            >
              {(() => {
                const iconClassName =
                  "text-[var(--primary)] transform transition ease-in-out duration-300 cursor-pointer hover:scale-110 hover:opacity-80";
                return [
                  { icon: IoGridOutline, label: "Explore" },
                  { icon: IoStatsChartOutline, label: "Leaderboard", href: "/leaderboard" },
                  { icon: IoMusicalNotesOutline, label: "Sound" },
                  { icon: IoBagOutline, label: "Merch", href: "/merch" },
                  { icon: IoCartOutline, label: "Cart" },
                  { icon: IoPersonOutline, label: "Profile" },
                ].map((item) => {
                  const Icon = item.icon;
                  if (item.href) {
                    return (
                      <Link
                        key={item.label}
                        href={item.href}
                        aria-label={item.label}
                        className={iconClassName}
                      >
                        <Icon className="h-8 w-8" />
                      </Link>
                    );
                  }
                  return (
                    <button
                      key={item.label}
                      type="button"
                      className={iconClassName}
                      aria-label={item.label}
                    >
                      <Icon className="h-8 w-8" />
                    </button>
                  );
                });
              })()}
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
