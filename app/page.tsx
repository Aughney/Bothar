import Navbar from "./components/Navbar";

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

          <h1 className="font-display text-6xl tracking-[0.2em] sm:text-8xl md:text-9xl">
            Bóthar
          </h1>
        </div>

        <p className="max-w-3xl text-lg leading-relaxed text-[var(--color-cream)]/95">
          A community-first, low-cost lift-share for rural Ireland. Connect drivers and passengers travelling the
          same routes, reduce solo journeys, save money, and earn reputation on Solana for reliable, safe rides.
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

        <article className="mt-8 bg-[rgba(255,255,255,0.03)] p-6 rounded max-w-3xl">
          <h2 className="text-2xl font-semibold text-[var(--color-cream)]">Why Bóthar</h2>
          <p className="mt-3 text-[var(--color-cream)]/90">
            Ireland's rural commuters face unreliable public transport, long, stressful drives, and safety risks from
            impaired driving. Bóthar reduces solo driving by matching drivers and passengers on shared routes. Drivers
            are rewarded and build on-chain reputation, while passengers gain safer, more reliable options.
          </p>

          <ul className="mt-4 list-disc pl-5 text-[var(--color-cream)]/90 space-y-2">
            <li>Lower commuting costs and less congestion for rural communities.</li>
            <li>Reward good driving behaviour with on-chain reputation on Solana.</li>
            <li>Community-first: privacy-respecting, not commercial taxi service.</li>
          </ul>
        </article>

        <div className="mt-8 flex items-center gap-6">
          <div className="flex items-center gap-4 text-[var(--color-cream)]/90">
            <span className="text-sm uppercase tracking-wide">Powered by</span>
            <div className="flex items-center gap-4">
              <span className="inline-block">
                {/* Solana logo */}
                <svg viewBox="0 0 256 256" className="h-8 w-auto" xmlns="http://www.w3.org/2000/svg" aria-hidden>
                  <defs>
                    <linearGradient id="g2" x1="0" x2="1">
                      <stop offset="0" stopColor="#00FFA3" />
                      <stop offset="1" stopColor="#DC1FFF" />
                    </linearGradient>
                  </defs>
                  <g fill="url(#g2)">
                    <path d="M10 60 L210 10 L240 40 L40 90 Z" />
                    <path d="M10 110 L210 60 L240 90 L40 140 Z" opacity="0.9" />
                    <path d="M10 160 L210 110 L240 140 L40 190 Z" opacity="0.8" />
                  </g>
                </svg>
              </span>

              <span className="inline-flex items-center gap-2">
                {/* Superteam simplified shamrock */}
                <svg viewBox="0 0 64 64" className="h-8 w-auto text-[var(--color-cream)]" xmlns="http://www.w3.org/2000/svg" aria-hidden>
                  <g fill="currentColor">
                    <path d="M32 36c-6-6-12-6-12-12a6 6 0 1 1 12 0c0 4-2 4 0 12z" />
                    <path d="M32 36c6-6 12-6 12-12a6 6 0 1 0-12 0c0 4 2 4 0 12z" />
                    <path d="M32 36c-6 6-6 12-12 12a6 6 0 1 0 12 0c0-4 2-4 0-12z" />
                    <path d="M32 36c6 6 6 12 12 12a6 6 0 1 1-12 0c0-4-2-4 0-12z" />
                  </g>
                </svg>
                <span className="text-sm">Superteam Ireland</span>
              </span>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
