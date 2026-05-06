"use client";

import Link from "next/link";
import { useState } from "react";
import { ConnectionIcon } from "./Icons";

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="w-full border-b border-[rgba(255,255,255,0.06)]">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-4 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center justify-between gap-4 w-full md:w-auto">
          <Link href="/" className="flex items-center gap-3 sm:gap-4 shrink-0">
            <ConnectionIcon className="h-8 w-8 text-[var(--color-cream)]" />
            <span className="font-display text-2xl tracking-[0.15em] text-[var(--foreground)]">
              Bóthar
            </span>
          </Link>

          <button
            type="button"
            className="md:hidden inline-flex items-center justify-center rounded border border-[rgba(255,255,255,0.14)] px-3 py-2 text-[var(--foreground)]"
            aria-expanded={menuOpen}
            aria-label="Toggle navigation menu"
            onClick={() => setMenuOpen((open) => !open)}
          >
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" aria-hidden>
              <path d="M4 6h16" />
              <path d="M4 12h16" />
              <path d="M4 18h16" />
            </svg>
          </button>
        </div>

        <div className="hidden md:flex items-center gap-4">
          <Link href="/about" className="text-[var(--foreground)]/90 hover:text-[var(--foreground)]">
            About
          </Link>
          <Link href="/how-it-works" className="text-[var(--foreground)]/90 hover:text-[var(--foreground)]">
            How it works
          </Link>

          <div className="ml-4 flex items-center gap-3">
            <Link
              href="/signin?role=passenger"
              className="inline-flex items-center gap-2 py-2 px-3 rounded bg-[var(--color-cream)] text-[var(--color-irish-green)] font-semibold"
            >
              Find a lift
            </Link>

            <Link
              href="/signin?role=driver"
              className="inline-flex items-center gap-2 py-2 px-3 rounded border border-[var(--color-cream)] text-[var(--color-cream)] hover:bg-[var(--color-irish-green-dark)]/20"
            >
              Offer a lift
            </Link>
          </div>
        </div>

        {menuOpen ? (
          <div className="md:hidden flex flex-col gap-3 rounded border border-[rgba(255,255,255,0.08)] bg-[rgba(0,0,0,0.08)] p-4">
            <Link href="/about" className="text-[var(--foreground)]/90 hover:text-[var(--foreground)]" onClick={() => setMenuOpen(false)}>
              About
            </Link>
            <Link href="/how-it-works" className="text-[var(--foreground)]/90 hover:text-[var(--foreground)]" onClick={() => setMenuOpen(false)}>
              How it works
            </Link>

            <div className="flex flex-col gap-3 pt-2">
              <Link
                href="/signin?role=passenger"
                className="inline-flex items-center justify-center gap-2 py-2 px-3 rounded bg-[var(--color-cream)] text-[var(--color-irish-green)] font-semibold"
                onClick={() => setMenuOpen(false)}
              >
                Find a lift
              </Link>

              <Link
                href="/signin?role=driver"
                className="inline-flex items-center justify-center gap-2 py-2 px-3 rounded border border-[var(--color-cream)] text-[var(--color-cream)] hover:bg-[var(--color-irish-green-dark)]/20"
                onClick={() => setMenuOpen(false)}
              >
                Offer a lift
              </Link>
            </div>
          </div>
        ) : null}
      </div>
    </nav>
  );
}
