# Bóthar Anchor program (placeholder)

This directory will host the Anchor program for Bóthar's escrow, reputation, ratings, and verification badges. See `../SPECIFICATION.md` §8 for the planned instruction set.

## Toolchain (not yet installed)

The host machine does not currently have Rust / Solana / Anchor installed. Before scaffolding the program, install:

```bash
# Rust
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh

# Solana CLI
sh -c "$(curl -sSfL https://release.anza.xyz/stable/install)"

# Anchor via avm
cargo install --git https://github.com/coral-xyz/anchor avm --locked
avm install latest
avm use latest
```

Verify with:

```bash
rustc --version
solana --version
anchor --version
```

## Scaffold the workspace

Once Anchor is installed, from this `anchor/` directory:

```bash
anchor init bothar --no-git
```

This will create `programs/bothar/`, `Anchor.toml`, `Cargo.toml`, and `tests/`.

## Planned instructions

- `init_trip(trip_id, fare)`
- `accept_trip(trip_id)`
- `complete_trip(trip_id)`
- `auto_release(trip_id)`
- `dispute(trip_id)`
- `resolve_dispute(trip_id, outcome)`
- `submit_rating(trip_id, stars)`
- `issue_badge(wallet, issuer)`
- `revoke_badge(wallet, issuer)`

Detailed program spec to live in `../Bothar-program-spec.md`.
