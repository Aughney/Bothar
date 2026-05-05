import Navbar from "./components/Navbar";
import { SolanaLogo } from "./components/Icons";

export default function Home() {
  return (
    <main className="min-h-screen flex flex-col bg-[var(--background)] text-[var(--foreground)]">
      <Navbar />

      <section className="flex-1 max-w-5xl mx-auto px-6 py-12 flex flex-col items-start gap-8">
        <div className="flex items-center gap-4">
          <div className="p-2 rounded bg-[rgba(255,255,255,0.03)]">
            {/* inline connection icon */}
            <svg viewBox="0 0 24 24" className="h-10 w-10 text-[var(--color-cream)]" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
              <circle cx="7" cy="12" r="3" stroke="currentColor" strokeWidth="1.2" />
              <circle cx="17" cy="7" r="2.5" stroke="currentColor" strokeWidth="1.2" />
              <circle cx="17" cy="17" r="2.5" stroke="currentColor" strokeWidth="1.2" />
              <path d="M9.2 12c2-1 3.6-1.4 5.6-5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
              <path d="M9.2 12c2 1 3.6 1.4 5.6 5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
            </svg>
          </div>

          <div className="flex flex-col">
            <h1 className="font-display text-6xl tracking-[0.2em] sm:text-8xl md:text-9xl">
              Bóthar
            </h1>
            <p className="mt-1 text-[var(--color-cream)]/85 text-lg">Irish for “road”</p>
          </div>
        </div>

        <p className="max-w-3xl text-lg leading-relaxed text-[var(--color-cream)]/95">
          Community-first lift-sharing for rural Ireland — connect drivers and passengers on the same route, reduce
          solo journeys, and earn on-chain reputation on Solana for reliable, safer rides.
        </p>

        <div className="flex gap-4">
          <a
            href="/signin?role=passenger"
            className="inline-block bg-[var(--color-cream)] text-[var(--color-irish-green)] font-semibold py-3 px-5 rounded"
          >
            I'm looking for a lift
          </a>

          <a
            href="/signin?role=driver"
            className="inline-block border border-[var(--color-cream)] text-[var(--color-cream)] py-3 px-5 rounded hover:bg-[var(--color-irish-green-dark)]/20"
          >
            I can offer a lift
          </a>
        </div>

        {/* On-chain reputation section */}
        <section className="w-full mt-8 p-6 rounded bg-[rgba(0,0,0,0.06)] max-w-3xl">
          <div className="flex items-start gap-4">
            <div className="mt-1">
              <SolanaLogo className="h-8 w-auto" />
            </div>
            <div>
              <h3 className="text-xl font-semibold text-[var(--color-cream)]">On-chain reputation — Earn trust on Solana</h3>
              <p className="mt-2 text-[var(--color-cream)]/90">
                Build a public, verifiable reputation for reliable, safer rides. After each completed trip both
                passengers and drivers can give feedback; positive ratings mint lightweight reputation badges on Solana.
                These badges are fast, low-cost to update, and help you get matched more often.
              </p>

              <ul className="mt-3 list-disc pl-5 text-[var(--color-cream)]/90 space-y-1">
                <li>Fast, low-cost updates on Solana.</li>
                <li>Privacy-first: only minimal trust signals are stored on-chain.</li>
                <li>Earn rewards and priority matching as your reputation grows.</li>
              </ul>

              <div className="mt-4 flex gap-3">
                <a href="/how-it-works" className="inline-block text-[var(--color-cream)] underline">Learn how it works</a>
                <a href="/signin?role=driver" className="inline-block bg-[var(--color-cream)] text-[var(--color-irish-green)] font-semibold py-2 px-3 rounded">Get started</a>
              </div>
            </div>
          </div>
        </section>

        <article className="mt-8 bg-[rgba(255,255,255,0.03)] p-6 rounded max-w-3xl">
          <h2 className="text-2xl font-semibold text-[var(--color-cream)]">Why Bóthar</h2>
          <p className="mt-3 text-[var(--color-cream)]/90">
            Ireland's rural commuters face unreliable public transport, long, stressful drives, and safety risks from
            impaired driving. Bóthar reduces solo driving by matching drivers and passengers on shared routes. Drivers
            are rewarded and build on-chain reputation, while passengers gain safer, more reliable options.
          </p>

          {/* Infographic: public transport scarcity */}
          <div className="mt-6 p-4 bg-[rgba(255,255,255,0.02)] rounded">
            <h3 className="text-lg font-semibold text-[var(--color-cream)]">Public transport is sparse in many rural areas</h3>
            <p className="text-[var(--color-cream)]/80 mt-2">Many communities have infrequent buses and limited train routes — making car-sharing a practical necessity.</p>

            <div className="mt-4 space-y-4">
              <div className="flex items-center gap-4">
                {/* Bus row */}
                <svg viewBox="0 0 24 24" className="h-6 w-6 text-[var(--color-cream)]" aria-hidden>
                  <rect x="2" y="6" width="20" height="10" rx="2" stroke="currentColor" fill="none" strokeWidth="1" />
                  <circle cx="7" cy="17" r="1" fill="currentColor" />
                  <circle cx="17" cy="17" r="1" fill="currentColor" />
                </svg>
                <div className="flex-1">
                  <div className="flex items-center justify-between text-[var(--color-cream)]/90">
                    <span>Bus services</span>
                    <span className="text-sm">Infrequent</span>
                  </div>
                  <svg viewBox="0 0 100 10" className="w-full mt-2 h-2" role="img" aria-label="Bus service availability">
                    <rect x="0" y="0" width="100" height="10" rx="2" fill="rgba(255,255,255,0.08)" />
                    <rect x="0" y="0" width="28" height="10" rx="2" fill="var(--color-cream)" opacity="0.9" />
                  </svg>
                </div>
              </div>

              <div className="flex items-center gap-4">
                {/* Train row */}
                <svg viewBox="0 0 24 24" className="h-6 w-6 text-[var(--color-cream)]" aria-hidden>
                  <rect x="3" y="7" width="18" height="8" rx="1" stroke="currentColor" fill="none" strokeWidth="1" />
                  <path d="M6 15v2" stroke="currentColor" strokeWidth="1" />
                  <path d="M18 15v2" stroke="currentColor" strokeWidth="1" />
                </svg>
                <div className="flex-1">
                  <div className="flex items-center justify-between text-[var(--color-cream)]/90">
                    <span>Train routes</span>
                    <span className="text-sm">Limited</span>
                  </div>
                  <svg viewBox="0 0 100 10" className="w-full mt-2 h-2" role="img" aria-label="Train route availability">
                    <rect x="0" y="0" width="100" height="10" rx="2" fill="rgba(255,255,255,0.08)" />
                    <rect x="0" y="0" width="18" height="10" rx="2" fill="var(--color-cream)" opacity="0.9" />
                  </svg>
                </div>
              </div>
            </div>

            <p className="text-xs mt-3 text-[var(--color-cream)]/70">Illustrative: check local timetables for exact service levels.</p>
          </div>

          <ul className="mt-4 list-disc pl-5 text-[var(--color-cream)]/90 space-y-2">
            <li>Lower commuting costs and less congestion for rural communities.</li>
            <li>Reward good driving behaviour with on-chain reputation on Solana.</li>
            <li>Community-first: privacy-respecting, not commercial taxi service.</li>
            <li>No ride-hail services (like Uber) are available in many rural areas — Bóthar connects drivers and passengers directly.</li>
          </ul>
        </article>
      </section>
    </main>
  );
}
