import Link from "next/link";
import { SolanaLogo, SuperteamLogo } from "./Icons";

export default function Footer() {
  return (
    <footer className="w-full border-t border-[rgba(255,255,255,0.04)] bg-transparent">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-[var(--color-cream)]/90">
          <div className="flex items-center gap-2">
            <SolanaLogo className="h-6 w-auto" />
            <span className="text-sm">Solana</span>
          </div>

          <div className="flex items-center gap-2">
            <SuperteamLogo className="h-6 w-auto text-[var(--color-cream)]" />
            <a
              href="https://ie.superteam.fun/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm py-2 -my-2 hover:underline"
            >
              Superteam Ireland
            </a>
          </div>
        </div>

        <nav
          aria-label="Legal"
          className="text-sm text-[var(--color-cream)]/70 flex flex-wrap items-center gap-x-4 gap-y-1"
        >
          <Link href="/team" className="py-2 -my-2 hover:underline">
            Team
          </Link>
          <Link href="/terms" className="py-2 -my-2 hover:underline">
            Terms
          </Link>
          <Link href="/privacy" className="py-2 -my-2 hover:underline">
            Privacy
          </Link>
        </nav>
      </div>
    </footer>
  );
}
