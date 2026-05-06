---
version: alpha
name: Bóthar
description: Visual identity for Bóthar — a Solana-powered rural lift-share network.
colors:
  irish-green: "#169B62"
  irish-green-dark: "#0E5E2C"
  cream: "#F7F3E9"
typography:
  wordmark-hero:
    fontFamily: Cinzel
    fontWeight: 400
    letterSpacing: 0.2em
  wordmark-nav:
    fontFamily: Cinzel
    fontWeight: 400
    letterSpacing: 0.15em
  body:
    fontFamily: Open Sans
    fontWeight: 400
    lineHeight: 1.5
  body-strong:
    fontFamily: Open Sans
    fontWeight: 600
    lineHeight: 1.5
rounded:
  sm: 0.25rem
components:
  page:
    backgroundColor: "{colors.irish-green}"
    textColor: "{colors.cream}"
    typography: "{typography.body}"
  wordmark:
    typography: "{typography.wordmark-hero}"
    textColor: "{colors.cream}"
  button-primary:
    backgroundColor: "{colors.cream}"
    textColor: "{colors.irish-green}"
    typography: "{typography.body-strong}"
    rounded: "{rounded.sm}"
  button-secondary:
    textColor: "{colors.cream}"
    typography: "{typography.body-strong}"
    rounded: "{rounded.sm}"
  button-secondary-hover:
    backgroundColor: "{colors.irish-green-dark}"
  panel:
    textColor: "{colors.cream}"
    rounded: "{rounded.sm}"
---

## Overview

Bóthar means "road" in Irish. The visual identity should feel like a rural Irish road sign carved in stone — quiet, durable, unmistakably Irish, with no crypto noise. The first surface is the wordmark on a flag-green field; everything else builds outward from there.

This file documents only what currently ships in the code. New tokens (full spacing scale, additional typography levels, form controls, modals) get added as features land, not in advance.

## Colors

A three-colour palette derived from the Irish tricolour and traditional book-paper.

- **`irish-green` (#169B62)**: the dominant surface colour, taken from Pantone 347 C — the green of the Irish flag. Used as the page background and as the brand's primary identifier.
- **`irish-green-dark` (#0E5E2C)**: deeper variant used for `button-secondary-hover` and as an elevation tone in the homepage "70% solo drivers" infographic road graphic. In the hover overlay it ships at ~20% opacity above the parent surface (an opacity tier the token format does not yet capture).
- **`cream` (#F7F3E9)**: warm off-white for foreground type. Softer than pure white so the wordmark reads like ink on paper, not a pixel display.

**Known contrast debt.** The `cream` + `irish-green` pair lands at ~3.21:1 in both directions — passes WCAG AA Large but **fails AA for normal text**. Two surfaces are affected today:

- **Body copy on the green page surface** (across `/`, `/about`, `/how-it-works`, `/signin`, `/team`) — `cream` text on `irish-green`, often at 70–95% opacity which lowers contrast further.
- **`button-primary`** — `irish-green` text on `cream`. Same pair, reversed roles, same ratio.

Both are tracked accessibility regressions. Resolve by introducing a darker text token (e.g. `irish-green-dark` as the foreground for button-primary, a darker cream for body copy on green), or by moving paragraph copy onto an opaque panel. The current translucent `panel` does **not** raise contrast meaningfully — it only tints elevation.

## Typography

Two type families, four levels.

- **Cinzel** powers the wordmark. A Roman-capitals display serif modelled on first-century inscriptions — carved-stone, milestone-marker, road-sign. Weights 400, 600, 700 are loaded; 400 is enough at hero sizes. Tracking is widened so the letterforms breathe like an engraving. The fada on **Ó** is supported.
  - **`wordmark-hero`** (`0.2em` tracking) — used in `app/page.tsx` at responsive sizes `text-6xl → text-8xl → text-9xl`.
  - **`wordmark-nav`** (`0.15em` tracking) — tightened variant in `app/components/Navbar.tsx` at `text-2xl`, sized to fit the navbar without competing with the hero.
- **Open Sans** powers everything else. Loaded via `next/font` in `app/layout.tsx`, applied on `<body>` through the `--font-body` CSS variable. Weights 300, 400, 600, 700 are loaded; 400 and 600 are tokenised below. Falls back to `system-ui, -apple-system, "Segoe UI", Roboto, "Helvetica Neue", Arial`.
  - **`body`** (Open Sans 400) — default for paragraph copy.
  - **`body-strong`** (Open Sans 600) — used for buttons and for section headlines (h2/h3 elements at Tailwind `text-xl`–`text-3xl`). Headlines currently inherit `body-strong` typography and apply size via Tailwind utility classes; a dedicated `headline-*` typography level can be added when a second display weight or distinct rhythm is needed.

## Shapes

A single, modest corner radius.

- **`rounded.sm` (0.25rem / 4px)** — the only corner-radius token in the system. Applied to buttons, panels, and inset infographic surfaces. Keeps shapes feeling carved and architectural, in line with the Cinzel display voice. No softer or sharper variants are defined; introduce them only when a feature genuinely needs a different rhythm.

## Components

In the code today.

- **`page`** — the full-bleed layout shell. `irish-green` background, `cream` text, Open Sans body type. Defined globally on `<body>` via CSS variables in `app/globals.css` so every route inherits it without repetition.
- **`wordmark`** — the "Bóthar" mark. References `wordmark-hero` typography. The navbar variant uses `wordmark-nav` typography (see Typography). The fada accent is decorated with the `fadaRide` motion (see Motion).
- **`button-primary`** — `cream` background, `irish-green` text, `body-strong`, `rounded-sm`. The dominant call-to-action ("Find a lift", "Get started", "Continue with Privy", "I'm looking for a lift"). Padding ships as Tailwind `py-3 px-5` (12px vertical / 20px horizontal); not yet captured as a single Dimension token.
- **`button-secondary`** — `cream` text on a transparent background with a 1px `cream` border, `body-strong`, `rounded-sm`. Paired opposite the primary button ("Offer a lift", "Use existing wallet", "Sign out", "I can offer a lift"). The transparent background and the border are not representable under the current spec property set, so they are documented here.
- **`button-secondary-hover`** — overlays `irish-green-dark` on the secondary button. In code the overlay ships at 20% opacity (`bg-[var(--color-irish-green-dark)]/20`); the opacity tier is not yet tokenised and is therefore part of this prose, not the YAML.
- **`panel`** — translucent surface for content cards and section wells, `rounded-sm`, `cream` text. The translucent background (`rgba(255,255,255,0.03)`) cannot be expressed as a sRGB hex token, so the surface itself lives in **Inline values** below; only the rounded radius and text colour are tokenised.

Two structural surfaces (`navbar`, `footer`) carry no tokens that fit the spec's component property set today (their styling is a 1px translucent rule + layout). They are documented in prose only:

- **`navbar`** (`app/components/Navbar.tsx`) — full-width bar, max-width 5xl content, 1px `rgba(255,255,255,0.06)` bottom rule. Left side: `wordmark-nav` + connection icon. Right side: navigation links (`About`, `How it works`) followed by `button-primary` + `button-secondary`.
- **`footer`** (`app/components/Footer.tsx`) — full-width bar, max-width 5xl content, 1px `rgba(255,255,255,0.04)` top rule. Mounted globally in `app/layout.tsx`. Left side: partner logos (Solana, Superteam Ireland). Right side: secondary links (Team, Terms, Privacy).

No inputs, form controls, or modal/drawer surfaces are defined yet. They will be added when the matching code ships.

## Motion

The DESIGN.md spec does not currently define a `motion` token group, so animation is documented as prose only. Both animations live in `app/globals.css` and are gated by `@media (prefers-reduced-motion: reduce)` — disabled when the user has reduced-motion set.

- **`fadeUp`** — 700ms `cubic-bezier(.2,.9,.3,1)`. Subtle hero-headline entrance: 8px upward translate + opacity 0 → 1.
- **`fadaRide`** — 900ms `cubic-bezier(.2,.8,.2,1)`. Plays the fada accent on **Ó** as a left-to-right zoom with a slight rotate, evoking a car along a road. Decorative; do not gate any meaning on it.

Default to **no motion**. New animations should be additive to a specific moment, never a default decoration, and must respect `prefers-reduced-motion`.

## Inline values (not yet promoted to tokens)

These values appear inline across the codebase and are **not** yet promoted to named tokens. Documented here so future agents recognise them as deliberate-but-pending, not new ad-hoc additions:

- **Translucent surfaces**: `rgba(255,255,255,0.02 | 0.03 | 0.04 | 0.06 | 0.08)` and `rgba(0,0,0,0.06)` — used for panel backgrounds, inset wells, dividers, and elevation tints.
- **Text-on-green opacity tiers**: `cream/70 | /80 | /85 | /90 | /95` — ad-hoc opacity tiers standing in for a secondary/tertiary text scale.
- **Border-on-green tiers**: `rgba(255,255,255,0.04 | 0.06)` — navbar / footer rules.
- **Asymmetric button padding**: `py-3 px-5` (12px / 20px) — not representable as a single-Dimension `padding` token.

When the next feature touches these, promote to named tokens (`surface-1`, `surface-2`, `divider`, `text-secondary`, `text-tertiary`) in `app/globals.css` and replace the inline values, rather than introducing a new ad-hoc rgba/opacity. The DESIGN.md format will need a small extension (alpha-aware Color or an `opacity` group) before these can ship as tokens here.

## Do's and Don'ts

- **Do** keep `cream` on `irish-green` for display type only. **Don't** run new paragraph copy on the green surface without first introducing a darker text token or an opaque panel.
- **Do** use `button-primary` for the single most important action per screen and `button-secondary` for the alternate role. **Don't** stack two `button-primary` instances side-by-side.
- **Do** reuse `wordmark-hero` and `wordmark-nav` rather than introducing a new tracking value for the wordmark. **Don't** mix Cinzel into running text; it's display-only.
- **Do** respect `prefers-reduced-motion`: every animation must be disabled when the user opts out.
- **Don't** introduce new ad-hoc `rgba(...)` surfaces or `cream/NN` opacities without first checking the **Inline values** list and promoting to a token if the value is reused.
