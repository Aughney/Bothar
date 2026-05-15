# React Best Practices — Deferred Fixes

Identified during the React skill audit (2026-05-15). Skipped because they touch components under active development. Pick these up before the first real feature milestone.

---

## FIX 1 — Split `RidesManager.tsx` into focused components

**Why:** 456-line god component violates single-responsibility and ships more JS than needed in a single client bundle slice.

**Skill rules:** React — "Keep client boundaries small"; `bundle-dynamic-imports`

**Proposed file split:**

```
app/components/rides/
  RidesManager.tsx     # thin orchestrator (~60 lines) — 'use client'
  RidesList.tsx        # pure list display — receives rides[] as props
  RideCard.tsx         # single ride row + remove button
  RideForm.tsx         # controlled form with its own local state — 'use client'
  useRides.ts          # custom hook: getAuthorizationHeader, fetchRides,
                       #   handleSubmit, handleRemove
```

**What moves where:**

- `getAuthorizationHeader`, `fetchRides`, `handleSubmit`, `handleRemove`, the `feedback` / `submitting` states → `useRides.ts`
- Form fields state and `validate()` → `RideForm.tsx`
- `rides.map(...)` render → `RidesList.tsx` + `RideCard.tsx`
- Auth gate (unauthenticated / loading states) stays in `RidesManager.tsx`

---

## FIX 2 — Dynamic import `RidesManager` in `app/rides/page.tsx`

**Why:** The entire Privy dependency tree is bundled eagerly even though `RidesManager` only activates post-auth. `next/dynamic` defers it and reduces the initial JS payload.

**Skill rule:** `bundle-dynamic-imports`

```tsx
// app/rides/page.tsx
import dynamic from "next/dynamic";
import { Suspense } from "react";

const RidesManager = dynamic(
  () => import("@/app/components/rides/RidesManager"),
  { ssr: false },
);

// wrap with Suspense (see FIX 3)
```

**Note:** Do this after FIX 1 so the import path is already the new location.

---

## FIX 3 — Add `Suspense` boundaries + improve `SignInShell` fallback

**Why:**

- `app/rides/page.tsx` has no `<Suspense>` around `<RidesManager />`. Any future CSR-bailout hook inside will silently break `npm run build`.
- `SignInShell` uses `<Suspense fallback={null}>`, causing a visible blank flash during hydration.

**Skill rule:** `async-suspense-boundaries`

### Rides page

```tsx
// app/rides/page.tsx
import { Suspense } from "react";
import Loading from "@/app/loading";

<Suspense fallback={<Loading />}>
  <RidesManager />
</Suspense>;
```

### SignIn skeleton

```tsx
// app/signin/SignInClient.tsx
function SignInSkeleton() {
  return (
    <main className="min-h-screen bg-[var(--background)]">
      <div className="mx-auto max-w-2xl px-4 py-8 sm:px-6 lg:px-8 animate-pulse">
        <div className="h-10 w-32 rounded bg-[rgba(255,255,255,0.08)] mb-4" />
        <div className="h-5 w-48 rounded bg-[rgba(255,255,255,0.05)]" />
      </div>
    </main>
  );
}

export function SignInShell(props: SignInContentProps) {
  return (
    <Suspense fallback={<SignInSkeleton />}>
      <SignInContent {...props} />
    </Suspense>
  );
}
```
