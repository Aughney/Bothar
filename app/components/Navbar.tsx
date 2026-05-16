import Link from "next/link";
import { ConnectionIcon } from "./Icons";
import MobileNav from "./MobileNav";
import { navCtas, navLinks } from "./nav-links";

export default function Navbar() {
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

          <MobileNav />
        </div>

        <div className="hidden md:flex items-center gap-4">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-[var(--foreground)]/90 hover:text-[var(--foreground)]"
            >
              {link.label}
            </Link>
          ))}

          <div className="ml-4 flex items-center gap-3">
            {navCtas.map((link) => (
              <Link key={link.href} href={link.href} className={link.className}>
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
}
