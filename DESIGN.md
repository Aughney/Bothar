---
version: alpha
name: Bóthar
description: Visual identity for Bóthar — a Solana-powered rural lift-share network.
colors:
  irish-green: "#169B62"
  irish-green-dark: "#0E5E2C"
  cream: "#F7F3E9"
typography:
  wordmark:
    fontFamily: Cinzel
    fontWeight: 400
    letterSpacing: 0.2em
components:
  page:
    backgroundColor: "{colors.irish-green-dark}"
    textColor: "{colors.cream}"
  wordmark:
    typography: "{typography.wordmark}"
    textColor: "{colors.cream}"
---

## Overview

Bóthar means "road" in Irish. The visual identity should feel like a rural Irish road sign carved in stone — quiet, durable, unmistakably Irish, with no crypto noise. The first surface is the wordmark on a flag-green field; everything else builds outward from there.

This file is intentionally small. It documents only what currently ships in the code; new tokens (body type, spacing scale, button states, form controls) get added as features land, not in advance.

## Colors

A three-colour palette derived from the Irish tricolour and traditional book-paper.

- **`irish-green` (#169B62)**: the dominant surface colour, taken from Pantone 347 C — the green of the Irish flag. Used as page background and as the brand's primary identifier.
- **`irish-green-dark` (#0E5E2C)**: deeper variant reserved for hover, pressed, and elevation states. Not yet used in the rendered UI.
- **`cream` (#F7F3E9)**: warm off-white for foreground type. Softer than pure white so the wordmark reads like ink on paper, not a pixel display.

**Contrast note.** `cream` on `irish-green` lands at ~3.2:1 — passes WCAG AA Large (display type ≥18pt or ≥14pt bold) but **fails AA for body text**. Today this only carries the wordmark, which is large display. When body text is introduced on the green surface, switch to a darker cream or layer a panel; do not run paragraph copy directly on `irish-green`.

## Typography

One typeface, one role for now.

- **`wordmark` — Cinzel.** Cinzel is a Roman-capitals display serif modelled on first-century inscriptions. It reads as carved-stone, milestone-marker, road-sign — all on-theme for "Bóthar". Weight 400 is enough at display sizes; 600 and 700 are loaded for headline use later. Tracking is widened to `0.2em` so the letterforms breathe like an engraving. The fada on **Ó** is supported.

A separate body typeface will be added when the app needs running text. Until then, Cinzel inherits as `--font-display` and the rest of the page has no typographic vocabulary.

## Components

Two components are in the code today.

- **`page`** — the full-bleed layout shell. `irish-green` background, `cream` text. Defined globally on `<body>` via CSS variables in `app/globals.css` so every route inherits it without repetition.
- **`wordmark`** — the "Bóthar" title on the landing page (`app/page.tsx`). `cream` on the inherited `page` background, Cinzel at responsive display sizes (`6xl → 8xl → 9xl` across the Tailwind breakpoints), tracking `0.2em`.

No buttons, inputs, cards, or interactive states are defined yet. They will be added when the matching code ships.
