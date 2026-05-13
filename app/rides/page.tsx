import RidesManager from "@/app/components/RidesManager";

const HAS_PRIVY = !!process.env.NEXT_PUBLIC_PRIVY_APP_ID;

export default function RidesPage() {
  return (
    <main className="min-h-screen bg-[var(--background)] text-[var(--foreground)]">
      <div className="mx-auto flex max-w-3xl flex-col gap-8 px-4 sm:px-6">
        {HAS_PRIVY ? (
          <RidesManager />
        ) : (
          <section className="py-10">
            <h1 className="font-display text-4xl tracking-[0.15em]">
              Manage Rides
            </h1>
            <div className="mt-6 rounded border border-[rgba(255,255,255,0.14)] bg-[rgba(0,0,0,0.08)] p-4 text-sm text-[var(--color-cream)]/90">
              <p className="mb-1 font-semibold">
                Ride management is not configured
              </p>
              <p>
                Set <code className="font-mono">NEXT_PUBLIC_PRIVY_APP_ID</code>{" "}
                to enable driver sign-in and ride management.
              </p>
            </div>
          </section>
        )}
      </div>
    </main>
  );
}
