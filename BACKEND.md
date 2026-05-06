# BACKEND.md

Backend stack and setup for the Bóthar hackathon MVP.

## Executive summary

- The §12 hackathon demo flow needs **8 backend capabilities**: web host, off-chain SQL DB, private file storage, Solana RPC, scheduled job, server-side relayer keypair, auth, and an EUR→USDC FX rate.
- **Primary stack: Vercel-only where possible**, with two third-party free tiers (Helius, CoinGecko) for the pieces Vercel does not cover.
- **Backup stack: Supabase** (Postgres + Storage). Drop-in for the off-chain pieces if Vercel free-tier limits are hit during the build.
- All third-party services used are on free tiers. Total monthly cost for the hackathon: zero.
- Verdict: **Promising** for an MVP. The single real trade-off vs. Supabase is loss of Row-Level Security on the database — acceptable here because all DB access flows through Next.js server actions, not direct browser→DB calls.

## Capability map (mapped to spec §)

| #   | Capability              | Why we need it (spec §)         | Provider                                       |
| --- | ----------------------- | ------------------------------- | ---------------------------------------------- |
| 1   | Next.js hosting / SSR   | All UI + API + server actions   | **Vercel** (Hobby)                             |
| 2   | Off-chain SQL DB        | Trips, KYC, nicknames (§7.5)    | **Neon Postgres** via Vercel Marketplace       |
| 3   | Private file storage    | Driver licence images (§4.2.1)  | **Vercel Blob** (private mode, broker via API) |
| 4   | Scheduled job           | `auto_release` (§4.5, §8.1)     | **Vercel Cron** (Hobby = daily granularity)    |
| 5   | Server-side keypair     | Cron signs `auto_release`       | Encrypted Vercel **env vars**                  |
| 6   | Solana devnet RPC       | On-chain reads + tx submit      | **Helius** free tier                           |
| 7   | Auth / embedded wallets | Privy + JWT verification (§4.7) | **Privy** free tier (already in app)           |
| 8   | EUR→USDC rate snapshot  | Posting-time fare (§4.1, §9.2)  | **CoinGecko** public API (no key)              |

Optional, not blocking the demo: realtime updates (poll instead), web push (§3 stretch), rate limiting.

## Vercel-only verdict per capability

| #   | Capability | Vercel-native? | Notes                                                                                                                                 |
| --- | ---------- | -------------- | ------------------------------------------------------------------------------------------------------------------------------------- |
| 1   | Hosting    | Yes            | Hobby tier — already deployed.                                                                                                        |
| 2   | Postgres   | Yes            | Provisioned via **Marketplace** (Neon). Free tier ≈ 256 MB DB / 0.5 GB storage / 60 h compute per month. Demo size is far below this. |
| 3   | Blob       | Yes            | First-party. Hobby = 1 GB store / 10 GB bandwidth / month. Private mode + signed-URL access through API routes.                       |
| 4   | Cron       | Yes            | `vercel.json` `crons[]` — Hobby = daily granularity, sufficient for the spec's "auto-release after 24h".                              |
| 5   | Secrets    | Yes            | Project env vars, encrypted. Use the Vercel CLI's `vercel env` for local sync.                                                        |
| 6   | Solana RPC | **No**         | Public devnet RPC is rate-limited and unreliable. Use **Helius** free (100k req/day) — single endpoint URL, drop-in.                  |
| 7   | Auth       | N/A            | Privy is the auth provider. Vercel just runs the verification middleware.                                                             |
| 8   | FX rate    | **No**         | CoinGecko `simple/price?ids=usd-coin&vs_currencies=eur` — no key, cache 60 s in-process.                                              |

## Trade-offs vs. the Supabase backup

Worth being clear about:

- **No Row-Level Security on Vercel Postgres.** All DB access has to go through Next.js server actions / route handlers. That is how this app is structured anyway, so it is not a real cost — but it forecloses the option of "client SDK reads with policy" later.
- **Storage ACL is coarser than Supabase.** Vercel Blob is "public or private + signed URL" rather than per-row policies. Fine for a single admin-reviewed bucket; outgrown if v2 wants e.g. driver-uploadable but passenger-readable buckets.
- **No realtime channel.** Supabase has Realtime out of the box; Vercel does not. The demo does not need it (poll on the funding screen). For v2 PWA push you would add Web Push (still fine on Vercel) or layer in Pusher / Ably free tiers.
- **Compute caps are real.** Hobby has function-invocation limits; an over-eager poll loop can burn through them. Set polling intervals to 5–10 s, not 1 s.

If any of these bite during the build, swap to the Supabase backup — see **Migration to Supabase backup** at the end of this file.

---

# Setup actions for Niamh

Each step is independently verifiable. Do them in order; stop at the first failure and ask before improvising.

## 0. Prerequisites

```bash
node --version              # >= 20
npm --version               # >= 10
gh --version                # gh CLI authenticated to github.com
vercel --version || npm i -g vercel
solana --version || sh -c "$(curl -sSfL https://release.anza.xyz/stable/install)"
```

You also need accounts on: **Vercel**, **Privy**, **Helius**. All free.

## 1. Link the repo to a Vercel project

Run from the repo root:

```bash
vercel login
vercel link            # answer: Set up and deploy → existing project, or create
```

Verify: `.vercel/project.json` exists and `cat .vercel/project.json` shows `projectId`.

## 2. Provision Neon Postgres via Marketplace

In the Vercel dashboard for the project:

1. **Storage** → **Create Database** → choose **Neon** → free plan.
2. Pick a region close to Ireland (e.g. `eu-west-2` Frankfurt or `lhr1` London).
3. Connect the database to this project (this auto-injects `DATABASE_URL`, `POSTGRES_URL`, `POSTGRES_PRISMA_URL`, etc. as env vars in Production, Preview, and Development).

Verify:

```bash
vercel env ls                    # should list DATABASE_URL across envs
```

## 3. Provision Vercel Blob

In the Vercel dashboard:

1. **Storage** → **Create Store** → **Blob** → free plan → connect to the project.
2. This auto-injects `BLOB_READ_WRITE_TOKEN` as an env var.

Verify: `vercel env ls | grep BLOB_READ_WRITE_TOKEN`.

## 4. Create the relayer wallet (devnet)

The cron job calls `auto_release` from a server-controlled wallet. Generate one and fund it on devnet.

```bash
mkdir -p .secrets
solana-keygen new --no-bip39-passphrase --outfile .secrets/relayer.json
solana airdrop 2 --keypair .secrets/relayer.json --url https://api.devnet.solana.com
solana balance --keypair .secrets/relayer.json --url https://api.devnet.solana.com   # expect: ~2 SOL
```

`.secrets/` is in `.gitignore` already (verify with `git check-ignore .secrets/relayer.json`); never commit the keypair.

Convert to a single-line base58 secret for env-var storage and push to Vercel:

```bash
node -e "const fs=require('fs'),bs=require('bs58');const k=JSON.parse(fs.readFileSync('.secrets/relayer.json'));process.stdout.write(bs.default.encode(Buffer.from(k)))" \
  | vercel env add RELAYER_SECRET_KEY production
```

(Repeat for `preview` and `development` if you want the cron to run in those envs too.)

`bs58` is needed for that one-liner: `npm i -D bs58` if it complains.

## 5. Helius RPC

1. Sign up at `https://helius.dev`.
2. Create an API key, **devnet** endpoint.
3. Copy the URL (looks like `https://devnet.helius-rpc.com/?api-key=...`).
4. Add to Vercel env:

```bash
vercel env add HELIUS_RPC_URL production
vercel env add HELIUS_RPC_URL preview
vercel env add HELIUS_RPC_URL development
```

## 6. Privy server-side verification

The client-side SDK (`@privy-io/react-auth`) is already installed. To verify Privy JWTs on the server we need the server SDK — **propose, do not install yet without Frank's approval**:

```bash
# AWAITING APPROVAL:
# npm i @privy-io/server-auth
```

Required env vars (already partially present):

| Var                        | Where it comes from              |
| -------------------------- | -------------------------------- |
| `NEXT_PUBLIC_PRIVY_APP_ID` | Privy dashboard → App → Settings |
| `PRIVY_APP_SECRET`         | Privy dashboard → App → Settings |

Add the missing one:

```bash
vercel env add PRIVY_APP_SECRET production
vercel env add PRIVY_APP_SECRET preview
vercel env add PRIVY_APP_SECRET development
```

## 7. Admin wallet allowlist

`/admin/kyc` (spec §4.2.1) must be gated to admin wallets. Store the list as a comma-separated env var:

```bash
vercel env add ADMIN_WALLETS production    # value: <wallet1>,<wallet2>
vercel env add ADMIN_WALLETS preview
vercel env add ADMIN_WALLETS development
```

The admin check goes in a Next.js middleware or in the route handler that powers `/admin/kyc`. It compares the Privy-authenticated user's Solana wallet against this list.

## 8. Schema migration tool

Pick one and stick with it. **Decision pending — propose to Frank before installing**:

- **Drizzle ORM** — recommended for this stack: tiny, SQL-first, generates types from schema, plays nicely with Neon and serverless. `npm i drizzle-orm pg && npm i -D drizzle-kit`.
- **Prisma** — heavier, more abstractions, larger cold-start. Avoid on Hobby unless the team already knows it.

Initial schema (per spec §7.1, §7.4):

```sql
-- trips: off-chain index of all posted trips
create table trips (
  id              uuid primary key default gen_random_uuid(),
  passenger_wallet text not null,
  driver_wallet   text,
  origin_label    text not null,
  origin_lat      double precision,
  origin_lng      double precision,
  dest_label      text not null,
  dest_lat        double precision,
  dest_lng        double precision,
  depart_at       timestamptz not null,
  depart_window_minutes int not null default 30,
  fare_eur        numeric(10,2) not null,
  fare_usdc       numeric(20,6) not null,
  fx_rate_snapshot numeric(20,8) not null,
  event_tag       text,
  notes           text,
  state           text not null default 'Open',
  escrow_pda      text,
  created_at      timestamptz not null default now(),
  accepted_at     timestamptz,
  funded_at       timestamptz,
  completed_at    timestamptz
);

-- KYC submissions (driver licence reviews)
create table kyc_submissions (
  id              uuid primary key default gen_random_uuid(),
  wallet          text not null,
  status          text not null default 'Pending',  -- Pending | Approved | Rejected
  licence_image_pathname text not null,             -- Vercel Blob pathname
  declaration_accepted_at timestamptz not null,
  submitted_at    timestamptz not null default now(),
  reviewed_at     timestamptz,
  reviewed_by     text,
  rejection_reason text,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

-- users: nickname + home village (lightweight profile cache)
create table users (
  wallet          text primary key,
  nickname        text not null,
  home_village    text,
  emergency_contact text,
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

-- ratings: off-chain comments only (numeric stars live on-chain per §7.3)
create table rating_comments (
  trip_id         uuid not null references trips(id) on delete cascade,
  rater_wallet    text not null,
  rated_wallet    text not null,
  comment         varchar(140),
  created_at      timestamptz not null default now(),
  primary key (trip_id, rater_wallet)
);
```

Apply via the chosen tool's migration command. Verify with:

```bash
psql "$DATABASE_URL" -c "\dt"     # expect: trips, kyc_submissions, users, rating_comments
```

## 9. Cron job for auto_release

Add to `vercel.json` (create if it does not exist):

```json
{
  "crons": [
    {
      "path": "/api/cron/auto-release",
      "schedule": "0 6 * * *"
    }
  ]
}
```

The route at `app/api/cron/auto-release/route.ts` should:

1. Verify the request comes from Vercel Cron (`x-vercel-cron-signature` header, or `CRON_SECRET` shared secret).
2. Query Postgres for trips in state `Funded` where `depart_at + interval '24 hours' <= now()` and not in `Disputed`.
3. For each, call the on-chain `auto_release(trip_id)` with the relayer keypair.
4. Update the row to state `AutoReleased` only on tx confirmation.
5. Log success / failure counts; do not throw on per-trip failures (one bad row should not abort the sweep).

Daily granularity is good enough for spec compliance; finer cadence is a paid-tier upgrade.

## 10. Local dev workflow

After all env vars are set in Vercel:

```bash
vercel env pull .env.local      # syncs all envs into a local file
npm run dev                      # uses .env.local
```

Re-run `vercel env pull` whenever Frank or you change a Vercel env var.

## 11. Verification gates (per AGENTS.md)

Before opening any PR:

```bash
npm run lint
npm run typecheck
npm run build                    # CRITICAL — catches static-prerender errors that lint+typecheck miss
```

If any of the three fail, fix before pushing.

---

# Migration to Supabase backup

If Vercel free-tier limits are hit (Postgres compute hours or Blob bandwidth), or if a feature later needs RLS / Realtime / per-bucket policies:

1. **Postgres**: create a Supabase project, copy the `Connection string (Pooler)` into `DATABASE_URL` on Vercel. The schema migration tool re-applies the same SQL. No code change.
2. **Storage**: Supabase Storage uses a different SDK (`@supabase/supabase-js`). Replace `@vercel/blob`'s `put()` / `head()` / signed-URL helpers with the Supabase Storage equivalents in the upload route and admin viewer route. ~30–60 minutes.
3. Keep `BLOB_READ_WRITE_TOKEN` removed and add `SUPABASE_URL` + `SUPABASE_SERVICE_ROLE_KEY` to Vercel envs.
4. Update `BACKEND.md` and the spec note in `SPECIFICATION.md` §7.5 / §14 if the migration becomes permanent.

The Solana RPC (Helius), FX rate (CoinGecko), and auth (Privy) pieces are unaffected by the storage swap.

---

# Open decisions for Frank

These need a yes/no before Niamh runs the relevant step:

1. **Install `@privy-io/server-auth`?** Required for server-side JWT verification of Privy sessions. (Step 6.)
2. **Drizzle vs. Prisma?** Recommend Drizzle for serverless cold-start and SQL-first ergonomics. (Step 8.)
3. **`bs58` as a dev dependency** for the keypair-to-base58 one-liner — acceptable, or use `base64` instead? (Step 4.)
4. **Cadence for `auto-release` cron** — daily (Hobby, free) vs. hourly (Pro paid)? Spec says "after 24h" so daily is compliant. (Step 9.)
