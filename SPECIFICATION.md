# Bóthar — Product Spec v0.1

## Executive summary

- **Bóthar** is a Solana-powered lift-share network for rural communities where taxis and public transport are absent or unreliable.
- A passenger posts a trip, a verified neighbour accepts, and the fare sits in **USDC escrow** on Solana until the ride is confirmed completed.
- Identity is **wallet-based**, with embedded wallets (Privy) so non-crypto users can log in with Google or email and never see a seed phrase.
- Reputation is **on-chain and portable**: completed rides, ratings, and an optional "Local Verified" badge live with the user's wallet, not in our database.
- v1 ships as a **mobile-first PWA** (Next.js + Tailwind). Native (Expo + Solana Mobile Wallet Adapter) is a v2 path.
- Built for the **Colosseum Frontier** hackathon (06-04-2026 → 11-05-2026). MVP is judged on a working end-to-end demo, not feature breadth.

---

# 1. Product overview

## 1.1 Name

**Bóthar** — Irish for "road".

## 1.2 Product concept

A lightweight coordination and payment layer for shared rural journeys. Locals post trips they're already making or trips they need; matched passengers and drivers settle small payments via Solana escrow when the ride is complete.

This is **community cost-sharing**, not a commercial taxi service. No commission for full taxi-style operation. Drivers are not on duty — they are people already going somewhere, offering a seat.

## 1.3 Product type

- **Mobile-first Progressive Web App (PWA)**
- Public read access (anyone can browse ride routes / coverage)
- Wallet/account required to post a trip, accept a trip, or receive payment
- Designed to be installable to home screen on iOS and Android

---

# 2. Goals

## 2.1 Primary goals

- Let rural users coordinate verified shared rides with a few taps.
- Settle ride fares instantly in USDC on Solana, held in escrow until the ride completes.
- Build portable on-chain reputation that travels with the user across the network.
- Onboard non-crypto users without seed phrases (embedded wallets, social login).
- Deliver a hackathon-ready end-to-end demo on Solana **devnet**.

## 2.2 Secondary goals

- Make the crypto layer invisible to the end user.
- Give judges a clear demo story rooted in real rural Irish use cases (GAA matches, festivals, pub nights, school runs).
- Keep the codebase portable so a native Expo client can be added in v2.

## 2.3 Non-goals (v1)

- No commercial taxi replacement positioning.
- No KYC, no government ID verification, no background checks.
- No real-time GPS tracking during the ride.
- No multi-passenger fare splitting (one passenger per booking in v1).
- No native mobile app.
- No driver earnings dashboard / tax reporting.
- No insurance integration.
- No multi-language UI (English only in v1).
- No fiat on-ramp inside the app (Privy or external on-ramp handles funding).
- No mainnet deployment for the hackathon submission — devnet only.

---

# 3. Core user stories

## 3.1 Visitor

As a visitor, I want to see what trips are being posted in my area without logging in, so I can decide whether the network is useful.

## 3.2 New rural user (no wallet)

As someone with no crypto experience, I want to sign up with Google or email and have a wallet created for me, so I can request a ride without learning about seed phrases.

## 3.3 Passenger

As a passenger, I want to post a trip from my village to a destination with a date, time, and offered fare in EUR (settled in USDC), so a neighbour can pick me up.

## 3.4 Driver

As a driver already making a journey, I want to browse trips that match my route and accept one, so I can earn a fair contribution to my fuel costs.

## 3.5 Escrow

As a passenger, I want the fare locked in escrow when the driver accepts, so I'm confident the deal is committed and the driver knows they will be paid.

## 3.6 Completion

As a passenger, I want to confirm the ride is complete with one tap, so the driver gets paid immediately.

## 3.7 Auto-release

As a driver, I want the escrow to auto-release to me 24 hours after the scheduled drop-off if the passenger doesn't confirm or dispute, so I'm never stuck waiting for payment.

## 3.8 Dispute

As either party, I want to raise a dispute within the auto-release window, so unfair situations can be reviewed before payment moves.

## 3.9 Reputation

As a user, I want to see how many rides another user has completed and their average rating, so I can judge whether to trust them.

## 3.10 Local verification

As a community organiser (event, GAA club, parish), I want to issue a "Local Verified" badge to known locals, so the network has a baseline trust layer.

## 3.11 Rating

As either party after a ride, I want to leave a 1-5 star rating, so reputation reflects real experience.

---

# 4. Functional requirements

## 4.1 Trip posting (passenger)

A passenger creates a trip request with:

- Origin (village / postcode / pinned location)
- Destination (village / postcode / pinned location)
- Date and time window (e.g. "5 May, 18:00–18:30")
- Offered fare in **EUR**, displayed and settled as **USDC** at posting-time rate
- Optional notes (meeting point, luggage, accessibility needs)
- Optional event tag (e.g. "Cork v Tipp GAA, 4 May")

Rules:

- Trip cannot be posted with empty origin, destination, or fare.
- Fare minimum: TBD (suggest €2 to deter spam).
- Fare maximum: TBD (suggest €100 to keep v1 community-scoped).
- Trip is visible in the public feed immediately after posting.
- Trip can be cancelled by the passenger before a driver accepts, with no escrow consequence (no escrow has moved yet).

## 4.2 Trip discovery (driver)

Drivers browse trips matching their plans:

- Filter by origin region, destination region, date, event tag.
- List view sorted by departure time ascending.
- Each entry shows: passenger display name, reputation summary (rides + avg rating), origin → destination, time window, offered fare in EUR (with USDC equivalent), distance estimate.

## 4.3 Trip acceptance (driver)

When a driver accepts a trip:

- Driver's wallet does not need to deposit anything (driver is the payee).
- Passenger's wallet is prompted to fund escrow with the agreed USDC amount.
- Trip state moves to **Accepted, Awaiting Funding**.
- Once escrow is funded, trip state moves to **Funded, Ride Pending**.
- Once funded, neither party can unilaterally cancel without entering the dispute flow.

## 4.4 Escrow lifecycle

States:

- **Open** — posted, no driver assigned
- **Accepted, Awaiting Funding** — driver accepted, passenger has not yet funded (timeout: 15 min, then trip returns to Open)
- **Funded, Ride Pending** — escrow holds USDC, ride scheduled
- **Completed** — passenger confirmed; escrow released to driver
- **Auto-Released** — 24h after scheduled drop-off with no dispute; escrow released to driver
- **Disputed** — either party raised a dispute before auto-release; escrow frozen pending resolution
- **Cancelled** — pre-funding cancellation; no funds moved
- **Refunded** — dispute resolved in passenger's favour; escrow returned to passenger

## 4.5 Ride confirmation

After the scheduled drop-off time:

- Passenger sees a "Confirm ride completed" button.
- One tap releases escrow to driver.
- If passenger does not confirm within 24h of scheduled drop-off, escrow auto-releases to driver.
- Driver cannot trigger release directly (only passenger or auto-release).

## 4.6 Disputes

Either party can raise a dispute before escrow has released. v1 dispute handling is **manual**:

- Dispute flag freezes escrow.
- Both parties can submit a short text statement.
- A platform admin (multisig in v1) reviews and resolves: release to driver, refund to passenger, or split.
- v2 will explore community arbitration.

## 4.7 Identity and authentication

- Login via **Privy** (Google, email, or existing Solana wallet).
- Privy provisions an **embedded Solana wallet** for users who don't bring one.
- Display name defaults to "Local Lift #1234" until the user sets a nickname.
- No real names are required or surfaced in v1.

## 4.8 Reputation

Each user wallet accumulates:

- `ridesAsPassenger` (count)
- `ridesAsDriver` (count)
- `avgRating` (1.00–5.00, computed from on-chain rating accounts)
- `localVerified` (bool, set by issuer authority)

All four are read from on-chain accounts and displayed on profile cards.

## 4.9 Ratings

After ride completion or auto-release:

- Both parties have a 7-day window to submit a 1-5 star rating.
- One rating per ride per direction.
- Optional 140-character comment.
- Ratings are written to on-chain rating accounts and feed into `avgRating`.

## 4.10 Local Verified badge

- Issued by an authorised issuer wallet (e.g. event organiser, GAA club).
- Stored as a flag on the user's reputation account, scoped per issuer.
- Displayed on profile and trip listings as a badge with the issuer name.
- Revocable by the same issuer.

## 4.11 Public pages

- Landing page with "How it works" + active trip ticker.
- Trip detail page (publicly readable, requires auth to interact).
- Profile page (publicly readable).
- Static **Terms** and **Privacy** pages (footer linked).
- "How payments work" explainer (USDC, escrow, no surprise fees).

---

# 5. User experience requirements

## 5.1 Information architecture

Tabs on the bottom nav (mobile) / top nav (desktop):

1. **Feed** — trips relevant to me (region, route, events I follow)
2. **Post** — create a new trip request
3. **My rides** — my active and past rides as passenger or driver
4. **Profile** — me, settings, wallet, reputation

## 5.2 Onboarding flow

1. Land → "Get a lift" or "Offer a lift" CTA
2. Privy login (one screen, social or email)
3. First-run prompt: nickname + home village
4. Land in the Feed scoped to home village

Goal: onboarding to first useful screen in **under 30 seconds**, no crypto vocabulary.

## 5.3 Posting a trip (passenger)

- 4-field form: from, to, when, fare.
- Quick-pick chips for common destinations (configured per region).
- Event tag dropdown when an event is upcoming nearby.
- Submit shows: "Your trip is live. We'll notify you when a driver accepts."

## 5.4 Funding escrow

- After a driver accepts, passenger sees a single "Pay €X (USDC)" button.
- Privy handles transaction signing; user sees one approval screen.
- If user has insufficient USDC, surface an on-ramp link (external).
- After funding, screen shows "Driver is on their way" + driver profile card.

## 5.5 Confirming the ride

- "Confirm completed" button enabled at scheduled drop-off time.
- Big, single-action screen — no fee, no signing required after escrow funded (release is a passenger-side instruction signed by passenger wallet).
- After release: "€X paid to [driver]. Tap to rate."

## 5.6 Tone

- Plain, friendly, rural-Irish-flavoured copy.
- No crypto jargon in user-facing strings (no "wallet", "transaction", "escrow on-chain"). Prefer "your account", "payment", "held safely".
- "Powered by Solana" appears in About / How payments work, not in the main flow.

---

# 6. Pages and routes

| Route         | Auth                          | Purpose                            |
| ------------- | ----------------------------- | ---------------------------------- |
| `/`           | Public                        | Landing + active trip ticker       |
| `/feed`       | Public read, auth to interact | Region/route trip feed             |
| `/post`       | Auth                          | Trip composer                      |
| `/trips/[id]` | Public                        | Trip detail                        |
| `/rides`      | Auth                          | My rides (active + past)           |
| `/u/[wallet]` | Public                        | Profile + reputation               |
| `/profile`    | Auth                          | My profile + settings              |
| `/about`      | Public                        | How it works                       |
| `/payments`   | Public                        | How payments work (USDC explainer) |
| `/terms`      | Public                        | Terms of Service                   |
| `/privacy`    | Public                        | Privacy Policy                     |

---

# 7. Data model (product-level)

## 7.1 Trip

- `id` (uuid, off-chain)
- `escrowPda` (Solana PDA, set after funding)
- `passengerWallet`
- `driverWallet` (nullable until accepted)
- `originLabel`, `originCoords`
- `destinationLabel`, `destinationCoords`
- `departAt`, `departWindowMinutes`
- `fareEur`, `fareUsdc`
- `eventTag` (nullable)
- `notes` (nullable, max 500 chars)
- `state` (Open / Accepted / Funded / Completed / AutoReleased / Disputed / Cancelled / Refunded)
- `createdAt`, `acceptedAt`, `fundedAt`, `completedAt`

## 7.2 Reputation account (on-chain, per wallet)

- `wallet`
- `ridesAsPassenger` (u32)
- `ridesAsDriver` (u32)
- `ratingSum` (u64), `ratingCount` (u32) — `avgRating = ratingSum / ratingCount / 100`
- `verifiedBitmap` (set of issuer pubkeys → bit)

## 7.3 Rating account (on-chain, per ride per direction)

- `tripId` (hashed to fit on-chain)
- `rater` (passenger or driver)
- `rated` (the other party)
- `stars` (1-5)
- `commentHash` (off-chain comment, hashed for integrity)

## 7.4 Off-chain vs on-chain split

- **On-chain**: escrow program state, reputation accounts, ratings, verification badges.
- **Off-chain (Postgres / Supabase)**: trip listings (origin/destination text, search-friendly), user nicknames, comments, push subscriptions.
- Trip ID anchors both sides: created off-chain, then referenced on-chain when escrow is funded.

---

# 8. Solana program (high-level)

A single Anchor program handles escrow, reputation, ratings, and verification. Detailed program spec lives in `Bothar-program-spec.md` _(coming soon)_.

## 8.1 Instructions (sketch)

- `init_trip(trip_id, fare)` — creates an escrow PDA, transfers USDC from passenger
- `accept_trip(trip_id)` — sets driver pubkey on the escrow PDA
- `complete_trip(trip_id)` — passenger-signed release to driver
- `auto_release(trip_id)` — anyone can call after `depart_at + 24h` if not disputed
- `dispute(trip_id)` — either party freezes the escrow
- `resolve_dispute(trip_id, outcome)` — admin/multisig signed
- `submit_rating(trip_id, stars)` — updates rated party's reputation account
- `issue_badge(wallet, issuer)` / `revoke_badge(wallet, issuer)` — issuer-signed

## 8.2 Token

- USDC SPL token (devnet mint for hackathon).
- Native SOL payment is **deferred** to v2 — using USDC only keeps fare UX stable.

## 8.3 Fees

- Platform takes **0% commission** in v1 to reinforce the cost-sharing positioning.
- Solana network fees are paid by the signer (passenger for fund/release; either party for dispute).
- Privy embedded wallets cover fee payer UX; if needed, the program supports a fee-payer relayer address for v2.

---

# 9. Business rules

## 9.1 Trip rules

- One driver per trip.
- One passenger per trip in v1 (no pooling).
- A trip cannot be edited after a driver accepts.
- A passenger can cancel only before driver acceptance.
- A driver can withdraw acceptance only before escrow funding.

## 9.2 Payment rules

- Fares quoted in EUR, settled in USDC at posting-time rate (rate snapshot stored with trip).
- Escrow holds the exact USDC amount.
- Auto-release after `scheduled_drop_off + 24h` unless disputed.
- Disputed escrow is frozen until admin resolution.
- Platform takes 0% in v1.

## 9.3 Reputation rules

- Reputation is wallet-bound. A new wallet has zero reputation.
- Ratings older than 12 months are weighted at 50% (v2; v1 weighs equally).
- A user can only rate the counterparty of a ride they participated in.
- Self-rating is impossible (program-enforced).

## 9.4 Verification rules

- Only authorised issuer wallets can issue badges.
- Issuers are added/removed by the program upgrade authority (multisig in v1).
- A user can hold badges from multiple issuers.

## 9.5 Content rules

Trip notes and comments must not contain:

- personal addresses, phone numbers, emails (use in-app contact instead — v2)
- illegal content
- harassment

Moderation in v1 is manual: admin can hide off-chain trip listings; on-chain ratings cannot be edited but can be flagged for display suppression.

---

# 10. Trust, safety, and legal

## 10.1 Positioning safeguards

- Always describe Bóthar as **community cost-sharing**, not a taxi service.
- Suggested fare ranges nudge users to fuel-cost-only contributions, not commercial pricing.
- v1 is **not licensed** as a transport operator. The TOS makes this explicit and shifts responsibility for ride conduct, vehicle insurance, and licensing to the participants.

## 10.2 Safety features (v1 minimum)

- Both parties' display names, reputation, and verification status are visible before acceptance.
- Trip details (route + scheduled time) can be shared via system share sheet to a contact.
- "Report" button on every profile and trip surfaces it to admin.
- Emergency contact field (optional) on profile, surfaceable from an in-ride screen.

## 10.3 Insurance

- v1 does **not** provide ride insurance.
- TOS notes that drivers must ensure their personal vehicle insurance permits cost-sharing carriage of passengers (in Ireland, this is broadly accepted for non-commercial cost-sharing but driver-dependent).

## 10.4 Privacy

- Wallet addresses are public on-chain; nicknames are public in-app.
- Coordinates are stored as approximate (village-level pins) unless the user pins a precise location.
- No real names, phone numbers, or government IDs collected in v1.

## 10.5 Legal disclaimers

- Permanence: completed rides and ratings are immutable on-chain.
- Jurisdiction: TBD (likely Ireland for v1 pilot).
- TOS / Privacy text drafted separately, must be reviewed by counsel before any production launch.

---

# 11. Error and edge cases

## 11.1 Auth / wallet

- User abandons Privy login → return to landing, no state change.
- Embedded wallet provisioning fails → retry; surface support contact.
- User signs in on a new device → reputation and rides follow the wallet.

## 11.2 Funding

- Insufficient USDC balance → surface on-ramp link.
- Funding transaction fails or expires (15 min timeout) → trip returns to Open, driver notified.
- Network congestion → standard retry UX.

## 11.3 Ride lifecycle

- Driver no-shows → passenger raises dispute before auto-release.
- Passenger no-shows → driver raises dispute before auto-release.
- Both parties confirm completion → no conflict, escrow releases to driver.
- Trip cancelled by passenger after acceptance but before funding → no escrow movement; reputation hit (TBD whether this counts).

## 11.4 Reputation / rating

- User submits two ratings for the same ride → second rejected by program.
- Rating window expires (7 days) → no rating recorded.
- User attempts to rate a counterparty they were not paired with → rejected by program.

## 11.5 PWA-specific

- iOS Safari notifications require add-to-home-screen → onboarding prompts the install.
- Geolocation denied → user enters location manually.
- Offline → cached feed shown, posting disabled with banner.

---

# 12. Success criteria for hackathon submission

A v1 demo is successful if a single end-to-end flow works on **devnet**:

1. Niamh (passenger) signs up with Google via Privy.
2. She posts a trip "Schull → Cork, Saturday 18:00, €15".
3. A driver wallet (pre-seeded) accepts the trip in a second browser/device.
4. Niamh funds the escrow with one tap.
5. After the (simulated) scheduled time, she taps "Confirm completed".
6. Escrow releases USDC to the driver wallet on devnet.
7. Both parties leave a rating; reputation accounts update.
8. The driver's profile now shows `1 ride as driver, 5★ avg`.

Stretch goal: "Local Verified" badge issuance from an event-organiser wallet, displayed on the profile.

---

# 13. Open questions

## Product / policy

- Minimum and maximum fare values? (suggest €2–€100 for v1)
- Does a pre-funding cancellation by either party count toward reputation?
- Should drivers be able to post **offers** ("I'm driving Cork → Schull at 17:00") in addition to passengers posting requests? — strong "yes" signal for hackathon demo richness.
- Should rating comments be on-chain or off-chain only? (lean off-chain for v1)
- Multi-passenger pooling — punt to v2.

## Technical

- On-chain trip listings vs off-chain only? (v1: off-chain index, on-chain escrow only — keeps program small)
- Fee-payer relayer for users with zero SOL? (v2; v1 assumes Privy-managed SOL drip)
- Devnet USDC mint vs custom mock mint? (use circle-issued devnet USDC if available)
- Reputation weight decay? (v2)
- Solana Mobile Stack integration? (v2)

## UX

- Map view (Leaflet/Mapbox) for trip discovery — v1 nice-to-have, not blocker
- Push notifications via PWA — v1 stretch
- Driver photo / vehicle photo — v1 nice-to-have, raises moderation cost
- In-app chat between matched parties — defer to v2 (use phone share via system share sheet for v1)

---

# 14. One-page ADR

## Context

A rural lift-share network needs trustless small-value settlement, light-weight reputation, and onboarding that does not require crypto literacy. Solana provides cheap micro-settlement and stablecoin-native payments. Hackathon timeline (5 weeks) forces tight scope.

## Decision

Build Bóthar as a **mobile-first PWA** (Next.js 15 + Tailwind), with **Privy embedded wallets** for non-crypto onboarding, an **Anchor program** for USDC escrow + reputation + verification, and **Supabase** for the off-chain trip index. Ship on **devnet** for the hackathon submission. Defer native (Expo + Solana Mobile Wallet Adapter) to v2.

## Consequences

### Positive

- Fastest path to a demo-able end-to-end flow.
- Onboarding is friendly to rural, non-crypto users.
- Solana program scope is small and auditable in the available time.
- Code is portable to a native client without rewrites.

### Negative

- PWA push notifications are weaker than native on iOS pre-install.
- Off-chain trip index introduces a small trust seam (admin can hide listings).
- Devnet-only submission means no real revenue/usage signal during judging.
- Skipping commission in v1 means no revenue model demonstrated; we'll narrate the v2 fee model in the pitch.

---

# 15. Suggested next spec sections

1. `Bothar-program-spec.md` — Anchor program: instructions, accounts, errors, security model
2. `Bothar-website-spec.md` — Next.js routes, components, Privy + wallet adapter integration
3. Indexer / trip search strategy
4. Demo script and pitch deck outline
5. TOS + Privacy drafts (counsel review required)
