"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import dynamic from "next/dynamic";

const PrivyButton = dynamic(
  // Dynamically import so the page can render even if Privy isn't configured during build
  async () => {
    const mod = await import("@privy-io/react-auth");
    return function PrivySignInButton({ role }: { role: string }) {
      const { LoginButton } = mod;
      return <LoginButton appearance={{ theme: "light" }} /> as any;
    };
  },
  { ssr: false }
);

export default function SignInPage() {
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
        <p className="mb-6 text-[var(--color-cream)]/90">Signing in as: <strong>{role}</strong></p>

        <div className="space-y-4">
          {hasPrivy ? (
            <div>
              {/* Privy's LoginButton renders the embedded auth UI */}
              {/* @ts-ignore - dynamic import of LoginButton */}
              <PrivyButton role={role} />
            </div>
          ) : (
            <>
              <button className="w-full py-3 rounded bg-[var(--color-cream)] text-[var(--color-irish-green)] font-semibold">Continue with Privy</button>
              <button className="w-full py-3 rounded border border-[var(--color-cream)] text-[var(--color-cream)]">Use existing wallet</button>
            </>
          )}
        </div>

        <p className="mt-6 text-sm text-[var(--color-cream)]/80">Your account will keep a reputation score on-chain and a public profile with a short bio.</p>
      </div>
    </main>
  );
}
