import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link";
import {
  IoBagOutline,
  IoCarOutline,
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
      <body className="min-h-full flex flex-col">
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
                { Icon: IoCarOutline, ariaLabel: "Rides" },
                { Icon: IoGridOutline, ariaLabel: "Services" },
                { Icon: IoStatsChartOutline, href: "/leaderboard", ariaLabel: "Leaderboard" },
                { Icon: IoMusicalNotesOutline, ariaLabel: "Music" },
                { Icon: IoBagOutline, ariaLabel: "Orders" },
                { Icon: IoPersonOutline, ariaLabel: "Profile" },
              ].map(({ Icon, href, ariaLabel }, index) => {
                const iconClassName = index === 2 ? "h-8 w-8" : "h-7 w-7";
                const commonClassName = "text-[var(--accent)] transform transition ease-in-out duration-300 cursor-pointer hover:scale-110 hover:opacity-80";

                if (href) {
                  return (
                    <Link
                      key={index}
                      href={href}
                      className={commonClassName}
                      aria-label={ariaLabel ?? `Navigation item ${index + 1}`}
                    >
                      <Icon className={iconClassName} />
                    </Link>
                  );
                }

                return (
                  <button
                    key={index}
                    type="button"
                    className={commonClassName}
                    aria-label={ariaLabel ?? `Navigation item ${index + 1}`}
                  >
                    <Icon className={iconClassName} />
                  </button>
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
