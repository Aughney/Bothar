"use client";

import Link from "next/link";
import { useState } from "react";
import { navCtas, navLinks } from "./nav-links";

export default function MobileNav() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        className="md:hidden inline-flex items-center justify-center rounded border border-[rgba(255,255,255,0.14)] h-11 w-11 text-[var(--foreground)]"
        aria-expanded={menuOpen}
        aria-label="Toggle navigation menu"
        aria-controls="mobile-navigation"
        onClick={() => setMenuOpen((open) => !open)}
      >
        <span aria-hidden className="flex flex-col gap-[3px]">
          <span className="block h-[2px] w-5 rounded-full bg-current" />
          <span className="block h-[2px] w-5 rounded-full bg-current" />
          <span className="block h-[2px] w-5 rounded-full bg-current" />
        </span>
      </button>

      {menuOpen ? (
        <nav
          id="mobile-navigation"
          aria-label="Mobile navigation"
          className="md:hidden flex flex-col gap-1 rounded border border-[rgba(255,255,255,0.08)] bg-[rgba(0,0,0,0.08)] p-4"
        >
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="py-2 text-[var(--foreground)]/90 hover:text-[var(--foreground)]"
              onClick={() => setMenuOpen(false)}
            >
              {link.label}
            </Link>
          ))}

          <div className="flex flex-col gap-3 pt-3">
            {navCtas.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={link.mobileClassName}
                onClick={() => setMenuOpen(false)}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </nav>
      ) : null}
    </>
  );
}
