"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { createClient } from "@/lib/supabase/client";

interface SiteHeaderProps {
  links: { href: string; label: string }[];
}

export function SiteHeader({ links }: SiteHeaderProps) {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [userLoading, setUserLoading] = useState(true);
  const [userEmail, setUserEmail] = useState<string | null>(null);

  useEffect(() => {
    const supabase = createClient();
    supabase.auth.getUser().then(({ data }) => {
      setUserEmail(data.user?.email ?? null);
      setUserLoading(false);
    });
  }, []);

  const isActive = (href: string) =>
    href === "/" ? pathname === "/" : pathname.startsWith(href);

  return (
    <header className="sticky top-0 z-10 border-b border-gray-200 bg-white print:hidden">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3">
        <Link
          href="/"
          className="flex shrink-0 items-center gap-2 font-bold text-gray-900"
          aria-label="fastsudoku home"
        >
          <svg className="size-7" viewBox="0 0 1024 1024" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M869.382 404.75c3.315-13.92 5.303-28.501 5.303-43.083 0-39.105-12.593-76.222-34.466-109.362 13.256-42.42 41.757-145.817 20.547-212.098-69.594 68.27-171.003 82.188-208.12 84.84-44.408-13.257-93.456-20.548-144.491-20.548-51.7 0-100.747 7.291-145.154 21.21-33.803-1.988-139.19-13.919-211.435-84.839-22.535 70.92 10.605 180.946 22.536 216.074-19.885 31.152-31.815 66.943-31.815 104.06 0 17.896 2.651 34.466 7.29 51.036-95.443 265.785-65.617 438.776-24.523 536.208h78.874c-0.663-3.314-0.663-5.965-0.663-9.279 1.325 3.314 2.651 5.965 3.977 9.28H814.37c1.325-1.989 1.988-4.64 3.314-7.291 0 2.65-0.663 4.64-0.663 7.29h78.874c41.756-98.095 71.582-273.075-26.513-543.499zM429.944 799.117c-22.536 0-41.094-29.164-41.094-64.955s18.558-64.955 41.094-64.955c11.267 0 21.872 7.29 29.163 19.221 7.29 11.93 11.93 27.838 11.93 45.734 0 35.791-18.558 64.955-41.093 64.955z m110.025 33.14c-22.535 0-41.094-29.164-41.094-64.955s18.559-64.955 41.094-64.955 41.094 29.164 41.094 64.955-18.559 64.955-41.094 64.955z m110.025-33.14c-22.535 0-41.093-29.164-41.093-64.955s18.558-64.955 41.093-64.955c11.268 0 21.873 7.29 29.164 19.221 7.29 11.93 11.93 27.838 11.93 45.734 0 35.791-18.558 64.955-41.094 64.955z m108.7-306.878c-1.988 1.988-3.977 3.976-5.965 5.302h-0.663c-227.341 158.41-468.602 15.907-468.602 15.907-5.965-2.651-11.93-5.302-17.896-9.279-19.22-11.268-35.128-28.5-47.721-48.385-15.908-26.512-25.85-58.99-25.85-94.118 0-88.815 60.978-161.061 135.212-161.061 66.28 0 121.293 56.338 133.224 131.235 2.65 21.873 5.965 41.094 8.616 57.664 28.5 163.05 54.35 68.932 66.943-1.988 5.303-29.827 8.617-55.676 8.617-55.676h1.325c11.93-74.897 66.943-131.235 133.224-131.235 74.897 0 135.212 72.246 135.212 161.061 1.325 53.687-21.21 101.41-55.676 130.573z" fill="#2563eb" />
            <path d="M388.85 386.19c0 30.49-23.861 55.014-53.024 55.014-4.64 0-9.28-0.663-13.92-1.989-5.965-3.314-11.267-5.965-17.232-8.616-13.256-9.942-21.21-25.85-21.21-43.745 0-1.989 0-4.64 0.663-6.628 3.314-27.175 25.186-48.385 52.361-48.385 13.256 0 24.524 4.64 33.803 12.593 1.326 1.326 2.652 1.989 3.314 3.314 9.28 9.942 15.245 23.861 15.245 38.443z m314.169 16.571H630.11c-9.279 0-16.57-7.29-16.57-16.57s7.291-16.57 16.57-16.57h72.909c9.279 0 16.57 7.29 16.57 16.57s-7.954 16.57-16.57 16.57z" fill="#2563eb" />
          </svg>
          <span className="hidden text-lg sm:inline">fastsudoku</span>
        </Link>

        <nav className="hidden sm:flex items-center gap-1" aria-label="Main navigation">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "rounded-lg px-3 py-1.5 text-sm font-medium transition-colors",
                isActive(link.href)
                  ? "bg-blue-50 text-blue-600"
                  : "text-gray-500 hover:bg-blue-50 hover:text-blue-600",
              )}
            >
              {link.label}
            </Link>
          ))}
          {!userLoading && (
            <Link
              href={userEmail ? "/account" : "/auth"}
              className="ml-2 rounded-lg border border-gray-300 px-3 py-1.5 text-sm font-medium text-gray-500 transition-colors hover:bg-gray-50"
            >
              {userEmail ? "Account" : "Sign In"}
            </Link>
          )}
        </nav>

        <button
          className="sm:hidden rounded-lg p-1.5 text-gray-500 hover:bg-gray-100"
          onClick={() => setMenuOpen((open) => !open)}
          aria-label={menuOpen ? "Close menu" : "Open menu"}
          aria-expanded={menuOpen}
        >
          <svg className="size-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            {menuOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </div>

      {menuOpen && (
        <nav
          className="sm:hidden border-t border-gray-100 bg-white px-4 py-3"
          aria-label="Mobile navigation"
        >
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMenuOpen(false)}
              className={cn(
                "block rounded-lg px-3 py-2 text-sm font-medium",
                isActive(link.href)
                  ? "bg-blue-50 text-blue-600"
                  : "text-gray-600 hover:bg-gray-50",
              )}
            >
              {link.label}
            </Link>
          ))}
          {!userLoading && (
            <Link
              href={userEmail ? "/account" : "/auth"}
              onClick={() => setMenuOpen(false)}
              className="block rounded-lg px-3 py-2 text-sm font-medium text-gray-600 hover:bg-gray-50"
            >
              {userEmail ? "Account" : "Sign In"}
            </Link>
          )}
        </nav>
      )}
    </header>
  );
}
