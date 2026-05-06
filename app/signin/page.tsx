"use client";

import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { usePrivy } from "@privy-io/react-auth";

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

function SignInContent() {
  const params = useSearchParams();
  const role = params.get("role") || "passenger";
  const [hasPrivy, setHasPrivy] = useState(false);

  useEffect(() => {
    setHasPrivy(!!process.env.NEXT_PUBLIC_PRIVY_APP_ID);
  }, []);

  return (
    <main className="min-h-screen bg-[var(--background)] text-[var(--foreground)] flex items-center justify-center">
      <div className="max-w-2xl mx-auto p-8">
        <h1 className="font-display text-4xl mb-4">Sign in</h1>
        <p className="mb-6 text-[var(--color-cream)]/90">
          Signing in as: <strong>{role}</strong>
        </p>

        <div className="space-y-4">
          {hasPrivy ? (
            <PrivySignInButton />
          ) : (
            <>
              <button className="w-full py-3 rounded bg-[var(--color-cream)] text-[var(--color-irish-green)] font-semibold">
                Continue with Privy
              </button>
              <button className="w-full py-3 rounded border border-[var(--color-cream)] text-[var(--color-cream)]">
                Use existing wallet
              </button>
            </>
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
