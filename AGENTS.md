# AGENTS.md

## Current repo state

- This repo is pre-MVP/spec-first: verified root files are `README.md`, `SPECIFICATION.md`, `.gitignore`, and this file.
- There is no `package.json`, lockfile, source tree, `Anchor.toml`, CI workflow, lint/test/typecheck config, or verified dev command yet.
- Do not invent `npm`, `pnpm`, `next`, `anchor`, or test commands until the matching manifest/config exists; add/update this file once commands are executable.

## Product source of truth

- Treat `SPECIFICATION.md` as the detailed product/architecture source; `README.md` is only the short project overview.
- v1 target: mobile-first PWA, Next.js 15 + Tailwind, Privy embedded Solana wallets, Anchor program, Supabase off-chain trip index, Solana devnet only.
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
- Off-chain/Supabase: trip listings, origin/destination text, user nicknames, comments, and push subscriptions.
- Anchor program scope: `init_trip`, `accept_trip`, `complete_trip`, `auto_release`, `dispute`, `resolve_dispute`, `submit_rating`, `issue_badge`, `revoke_badge`.
- Planned routes: `/`, `/feed`, `/post`, `/trips/[id]`, `/rides`, `/u/[wallet]`, `/profile`, `/about`, `/payments`, `/terms`, `/privacy`.

## Local workflow notes

- `.gitignore` intentionally excludes `.opencode`, `.opencode/`, `.opencode.*`, `.sisyphus/`, and `.claude/`; do not commit local agent workspace files.
- Existing `.git/hooks/*` files are only Git sample hooks; no active repo hook workflow is verified.
- Before adding code, create executable scripts/configs first, then document the exact verified commands here.
