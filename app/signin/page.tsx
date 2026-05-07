"use client";

import { useSearchParams } from "next/navigation";
import { Suspense } from "react";
import { usePrivy } from "@privy-io/react-auth";

const HAS_PRIVY = !!process.env.NEXT_PUBLIC_PRIVY_APP_ID;

function PrivySignInButton() {
  const { login, ready, authenticated, user, logout } = usePrivy();

  if (!ready) {
    return (
      <button
        disabled
        className="w-full py-3 rounded bg-[var(--color-cream)]/60 text-[var(--color-irish-green)] font-semibold"
      >
        Loading…
      </button>
    );
  }

  if (authenticated) {
    return (
      <div className="space-y-3">
        <p className="text-[var(--color-cream)]/90 text-sm">
          Signed in as{" "}
          <strong>
            {user?.email?.address ?? user?.wallet?.address ?? "user"}
          </strong>
        </p>
        <button
          onClick={() => logout()}
          className="w-full py-3 rounded border border-[var(--color-cream)] text-[var(--color-cream)]"
        >
          Sign out
        </button>
      </div>
    );
  }

  return (
    <button
      onClick={() => login()}
      className="w-full py-3 rounded bg-[var(--color-cream)] text-[var(--color-irish-green)] font-semibold"
    >
      Continue with Privy
    </button>
  );
}

const ROLES = ["passenger", "driver"] as const;
type Role = (typeof ROLES)[number];

function SignInContent() {
  const params = useSearchParams();
  const raw = params.get("role");
  const role: Role = (ROLES as readonly string[]).includes(raw ?? "")
    ? (raw as Role)
    : "passenger";

  return (
    <main className="min-h-screen bg-[var(--background)] text-[var(--foreground)]">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="font-display text-4xl mb-4">Sign in</h1>
        <p className="mb-6 text-[var(--color-cream)]/90">
          Signing in as: <strong>{role}</strong>
        </p>

        <div className="space-y-4">
          {HAS_PRIVY ? (
            <PrivySignInButton />
          ) : (
            <div className="rounded border border-[rgba(255,255,255,0.14)] bg-[rgba(0,0,0,0.08)] p-4 text-sm text-[var(--color-cream)]/90">
              <p className="font-semibold mb-1">Sign-in not configured</p>
              <p>
                Set <code className="font-mono">NEXT_PUBLIC_PRIVY_APP_ID</code>{" "}
                in your environment to enable login. See{" "}
                <code className="font-mono">.env.example</code>.
              </p>
            </div>
          )}
        </div>

        <p className="mt-6 text-sm text-[var(--color-cream)]/80">
          Your account will keep a reputation score on-chain and a public
          profile with a short bio.
        </p>
      </div>
    </main>
  );
}

export default function SignInPage() {
  return (
    <Suspense fallback={null}>
      <SignInContent />
    </Suspense>
  );
}
