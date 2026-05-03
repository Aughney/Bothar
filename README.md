# Bóthar

A Solana-powered lift-share network for rural communities where taxis and public transport don't exist. Locals coordinate shared journeys, escrow small USDC/SOL payments, and build portable on-chain reputation through completed rides.

_Bóthar_ — Irish for "road".

Built for the [Colosseum](https://colosseum.com/hackathon) Frontier hackathon (06-04-2026 → 11-05-2026).

---

## The problem

In rural Ireland, and many places like it, there are no taxis, no buses after 6pm, and no Uber. People are already driving past each other on the same routes — to the pub, the GAA match, the train station, the next village over — but there is no trusted, lightweight way to coordinate a lift and settle the small payment that makes it fair.

Cash is awkward. Bank transfers are slow and socially clunky. Card payments are overkill for a €5 lift home.

## The idea

Bóthar lets a passenger post a trip, a verified neighbour accept it, and the fare sit in escrow until the ride is completed — settled instantly in USDC or SOL. Over time, drivers and passengers build a portable reputation that travels with their wallet.

This is not a taxi replacement. It is **community cost-sharing**, designed around real rural use cases: event transport, GAA matches, festivals, pub nights, school runs, elder mobility.

## Why Solana

- **Micro-payments**: rural fares are small; Solana fees are negligible.
- **Instant settlement**: driver gets paid the moment the ride is confirmed.
- **Stablecoin-native**: USDC removes price volatility for everyday users.
- **Programmable escrow**: trustless hold-and-release without a payment processor.
- **Portable reputation**: ride history lives on-chain, not locked to one app.

The crypto is invisible to the user. The win is "I got home and the driver got paid", not "I used a token".

---

## Status

Pre-MVP. Specification and build plan in [`SPECIFICATION.md`](SPECIFICATION.md) _(coming soon)_.

## License

TBD.
