# AGENTS.md

## Current repo state

- Bootstrapped: Next.js 16 + React 19 + Tailwind v4 (App Router, TypeScript, ESLint) at the repo root. Privy (`@privy-io/react-auth` v2.x) and `@solana/web3.js` are installed.
- App entry points: `app/layout.tsx`, `app/page.tsx`, `app/providers.tsx`, `app/globals.css`.
- Shared UI: `app/components/{Footer,Navbar,MobileNav,Icons,RidesManager}.tsx`.
- Implemented route folders: `app/{about,how-it-works,signin,team,rides}/`.
- App Router infrastructure: `app/{error,loading,not-found}.tsx` (error boundary, route loading state, 404).
- Repo-root docs/content: `README.md`, `SPECIFICATION.md`, `DESIGN.md`, `terms.md`, `AGENTS.md`, `TODO.md`.
- Privy provider is env-gated on `NEXT_PUBLIC_PRIVY_APP_ID` (see `.env.example`); without it the app renders without Privy login.
- `anchor/` is a placeholder directory with toolchain install + scaffold instructions; no Anchor program code exists yet.
- No CI, no test suite, no Anchor program, no Supabase wiring yet.

## Verified commands

Run from the repo root:

- `npm install` — install dependencies
- `npm run dev` — Next.js dev server at http://localhost:3000 (Turbopack)
- `npm run build` — production build
- `npm run start` — serve the production build
- `npm run lint` — ESLint
- `npm run typecheck` — `tsc --noEmit`

**Required pre-merge gate:** `npm run build` must pass. Lint and typecheck alone do **not** catch Next.js 16 static-prerender errors (e.g. an unbounded `useSearchParams()` failing the static export). Always run `npm run build` before claiming a UI change is done.

Anchor commands are **not** yet runnable on this machine (Rust / Solana CLI / Anchor are not installed). See `anchor/README.md` for install + scaffold steps. Solana Playground (https://beta.solpg.io) is the recommended zero-install path for v1.

## Product source of truth

- Treat `SPECIFICATION.md` as the detailed product/architecture source; `README.md` is only the short project overview.
- `DESIGN.md` is the visual-identity source of truth (DESIGN.md format spec, https://github.com/google-labs-code/design.md). Tokens in its YAML front matter are normative — do not introduce colour, typography, spacing, or component values that contradict or duplicate them. When the UI grows, extend `DESIGN.md` first, then implement.
- v1 target: mobile-first PWA, Next.js 16 + Tailwind v4, Privy embedded Solana wallets, Anchor program, Vercel Postgres (Neon via Marketplace) + Vercel Blob for the off-chain trip index and private licence-image storage, Solana devnet only. Supabase Postgres + Supabase Storage are the documented backup if Vercel free-tier limits are hit.
- Native Expo/Solana Mobile Wallet Adapter is v2; do not introduce native-app work for v1 unless the spec changes.
- Hackathon demo scope is one end-to-end devnet flow: Privy signup, post trip, second wallet accepts, fund USDC escrow, passenger confirms, driver receives USDC, both rate.

## Product constraints agents may miss

- Always position Bóthar as community cost-sharing, not a taxi/commercial transport service.
- v1 uses USDC only for settlement; native SOL payment is deferred to v2.
- Fares are quoted in EUR but settled in USDC using a posting-time rate snapshot; escrow must hold the exact USDC amount.
- No mainnet deployment for the hackathon submission; use Solana devnet assumptions unless explicitly changed.
- UI copy should hide crypto jargon in primary flows: prefer “your account”, “payment”, and “held safely” over “wallet”, “transaction”, or “escrow on-chain”.

## Architecture constraints from the spec

- On-chain: escrow state, reputation accounts, ratings, and verification badges.
- Off-chain (Postgres + private file storage): trip listings, origin/destination text, user nicknames, comments, push subscriptions, driver KYC submission metadata + verification status (Postgres), and driver licence images (Vercel Blob private store). Primary host: Vercel Marketplace; backup: Supabase. See `BACKEND.md`.
- Anchor program scope: `init_trip`, `accept_trip`, `complete_trip`, `auto_release`, `dispute`, `resolve_dispute`, `submit_rating`, `issue_badge`, `revoke_badge`.
- Routes — implemented: `/`, `/about`, `/how-it-works`, `/signin`, `/team`, `/rides`, `/terms`, `/privacy`. Planned (not yet built): `/waitlist`, `/feed`, `/post`, `/trips/[id]`, `/u/[wallet]`, `/profile`, `/payments`.

## Privy integration (v2.x)

- The package is `@privy-io/react-auth` v2.x. There is **no `LoginButton` export** — do not import one. Trigger sign-in via the `usePrivy()` hook: `const { login, ready, authenticated, logout } = usePrivy();` and call `login()` from a button's `onClick`.
- `usePrivy()` must be called from a component rendered inside `PrivyProvider`. `app/providers.tsx` only mounts `PrivyProvider` when `NEXT_PUBLIC_PRIVY_APP_ID` is set, so gate any Privy-hook usage behind that env check (see `app/signin/page.tsx` for the pattern).
- Pages that use `useSearchParams()` (or any other CSR-bailout hook) must be wrapped in a `<Suspense>` boundary; otherwise `next build` fails to prerender. See `app/signin/page.tsx`.

## Local workflow notes

- `.gitignore` intentionally excludes `.opencode`, `.opencode/`, `.opencode.*`, `.sisyphus/`, and `.claude/`; do not commit local agent workspace files.
- Existing `.git/hooks/*` files are only Git sample hooks; no active repo hook workflow is verified.
- Before adding code, create executable scripts/configs first, then document the exact verified commands here.
