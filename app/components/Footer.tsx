import Link from "next/link";
import { SolanaLogo, SuperteamLogo } from "./Icons";

export default function Footer() {
  return (
    <footer className="w-full border-t border-[rgba(255,255,255,0.04)] bg-transparent">
      <div className="max-w-5xl mx-auto px-6 py-6 flex items-center justify-between">
        <div className="flex items-center gap-4 text-[var(--color-cream)]/90">
          <div className="flex items-center gap-2">
            <SolanaLogo className="h-6 w-auto" />
            <span className="text-sm">Solana</span>
          </div>

          <div className="flex items-center gap-2">
            <SuperteamLogo className="h-6 w-auto text-[var(--color-cream)]" />
            <Link href="https://superteam.ie" className="text-sm hover:underline">
              Superteam Ireland
            </Link>
          </div>
        </div>

        <div className="text-sm text-[var(--color-cream)]/70 flex items-center gap-4">
          <Link href="/team" className="hover:underline">
            Team
          </Link>
          <Link href="/terms" className="hover:underline">
            Terms
          </Link>
          <Link href="/privacy" className="hover:underline">
            Privacy
          </Link>
        </div>
      </div>
    </footer>
  );
}
