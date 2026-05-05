import Link from "next/link";
import { ConnectionIcon } from "./Icons";

export default function Navbar() {
  return (
    <nav className="w-full border-b border-[rgba(255,255,255,0.06)]">
      <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-4">
          <ConnectionIcon className="h-8 w-8 text-[var(--color-cream)]" />
          <span className="font-display text-2xl tracking-[0.15em] text-[var(--foreground)]">
            Bóthar
          </span>
        </Link>

        <div className="flex items-center gap-4">
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
      </div>
    </nav>
  );
}
