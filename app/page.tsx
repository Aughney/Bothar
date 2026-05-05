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
            <p className="mt-1 text-[var(--color-cream)]/85 text-lg">Irish for "road"</p>
            <h2 className="mt-4 text-2xl sm:text-3xl font-semibold text-[var(--color-cream)]">Dependable when transit isn't.</h2>
            <p className="mt-1 text-[var(--color-cream)]/85 text-lg">Where buses won't go, we will.</p>
          </div>
        </div>

        <p className="max-w-3xl text-lg leading-relaxed text-[var(--color-cream)]/95">
          Community-first lift-sharing for rural Ireland — connect drivers and passengers on the same route, reduce
          solo journeys, and earn on-chain reputation on Solana for reliable, safer rides.
        </p>

        

        {/* Large infographic: solo driving stat */}
        <section className="w-full mt-8 p-6 rounded bg-[rgba(255,255,255,0.03)] max-w-4xl flex flex-col md:flex-row items-center gap-6">
          <div className="flex-none">
            <div className="text-[var(--color-cream)] text-6xl font-bold">70%</div>
            <div className="text-[var(--color-cream)]/90 mt-2">of drivers travel solo in Ireland</div>
          </div>

          <div className="flex-1">
            <p className="text-[var(--color-cream)]/90 mb-4">
              A majority drive alone every day — that represents a large, underused network of potential shared journeys.
              How many of them are travelling in the same direction at the same time? Even a small overlap creates huge
              opportunity to reduce solo trips, costs and emissions.
            </p>

            {/* stylised road with 10 cars, 3 highlighted as "matching" */}
            <div className="w-full">
              <svg viewBox="0 0 600 120" className="w-full h-24" role="img" aria-label="Illustration showing ten cars with three highlighted">
                <defs>
                  <style>{`.car{fill:var(--color-cream);opacity:0.85}.match{fill:var(--color-irish-green)}`}</style>
                </defs>

                {/* road background */}
                <rect x="0" y="20" width="600" height="80" rx="8" fill="#0e5e2c" opacity="0.15" />
                {/* lane stripe */}
                <rect x="0" y="60" width="600" height="6" fill="rgba(255,255,255,0.08)" />

                {/* ten cars spaced across the road */}
                <g transform="translate(20,30)">
                  ${Array.from({ length: 10 }).map((_, i) => {
                    const x = i * 54;
                    // mark cars 2,5,8 (0-indexed) as matches
                    const isMatch = [1,4,7].includes(i);
                    return `
                      <g transform="translate(${x},0)">
                        <rect x="0" y="6" width="36" height="18" rx="3" class="${isMatch ? 'match' : 'car'}" />
                        <circle cx="8" cy="26" r="2" fill="rgba(0,0,0,0.6)" />
                        <circle cx="28" cy="26" r="2" fill="rgba(0,0,0,0.6)" />
                      </g>
                    `;
                  }).join('')}
                </g>
              </svg>

              <div className="mt-2 text-sm text-[var(--color-cream)]/80">
                Example: out of 10 nearby drivers, 3 could be travelling the same way — that’s a quick path to sharing more seats.
              </div>
            </div>
          </div>
        </section>

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

        {/* Safety-first section */}
        <section className="w-full mt-8 p-6 rounded bg-[rgba(255,255,255,0.03)] max-w-3xl">
          <h3 className="text-xl font-semibold text-[var(--color-cream)]">Safety first</h3>
          <p className="mt-3 text-[var(--color-cream)]/90">
            Safety is central to Bóthar. We design the service so people feel comfortable sharing journeys — especially
            in rural areas where transport options are limited.
          </p>

          <ul className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4 text-[var(--color-cream)]/90">
            <li className="flex items-start gap-3">
              <svg className="h-6 w-6 flex-none" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
                <path d="M12 2 L3 6v5c0 5 4 9 9 11 5-2 9-6 9-11V6l-9-4z" stroke="currentColor" strokeWidth="1" fill="none" />
              </svg>
              <div>
                <strong className="block text-[var(--color-cream)]">Verified drivers</strong>
                Short bio, reputation badges and optional licence checks help passengers make informed choices.
              </div>
            </li>

            <li className="flex items-start gap-3">
              <svg className="h-6 w-6 flex-none" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
                <path d="M3 12h18" stroke="currentColor" strokeWidth="1" strokeLinecap="round" />
                <path d="M6 8v8" stroke="currentColor" strokeWidth="1" strokeLinecap="round" />
                <path d="M18 8v8" stroke="currentColor" strokeWidth="1" strokeLinecap="round" />
              </svg>
              <div>
                <strong className="block text-[var(--color-cream)]">Share trip details</strong>
                Optional in-trip location sharing with a trusted contact gives extra reassurance for both riders and drivers.
              </div>
            </li>

            <li className="flex items-start gap-3">
              <svg className="h-6 w-6 flex-none" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
                <rect x="4" y="5" width="16" height="14" rx="2" stroke="currentColor" strokeWidth="1" fill="none" />
                <path d="M8 12h8" stroke="currentColor" strokeWidth="1" strokeLinecap="round" />
                <path d="M12 8v8" stroke="currentColor" strokeWidth="1" strokeLinecap="round" />
              </svg>
              <div>
                <strong className="block text-[var(--color-cream)]">Earn in crypto — get rewarded for being economic</strong>
                Choose to share rides and earn small on-chain rewards or priority in matching for reducing solo trips.
              </div>
            </li>

            <li className="flex items-start gap-3">
              <svg className="h-6 w-6 flex-none" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
                <rect x="3" y="5" width="18" height="14" rx="2" stroke="currentColor" strokeWidth="1" fill="none" />
                <path d="M7 9h10" stroke="currentColor" strokeWidth="1" />
              </svg>
              <div>
                <strong className="block text-[var(--color-cream)]">Masked contact</strong>
                Contact details are only exchanged after a booking is confirmed to prevent unwanted contact beforehand.
              </div>
            </li>
          </ul>

          <div className="mt-4 flex gap-3">
            <a href="/how-it-works" className="text-[var(--color-cream)] underline">Read safety details</a>
            <a href="/signin?role=passenger" className="inline-block bg-[var(--color-cream)] text-[var(--color-irish-green)] font-semibold py-2 px-3 rounded">Find a safe ride</a>
          </div>
        </section>

        <article className="mt-8 bg-[rgba(255,255,255,0.03)] p-6 rounded max-w-3xl">
          <h2 className="text-2xl font-semibold text-[var(--color-cream)]">Why Bóthar</h2>
          <p className="mt-3 text-[var(--color-cream)]/90">
            Ireland's rural commuters face unreliable public transport, long, stressful drives, and safety risks from
            impaired driving. Bóthar reduces solo driving by matching drivers and passengers on shared routes. Drivers
            are rewarded and build on-chain reputation, while passengers gain safer, more reliable options.
          </p>

          <p className="mt-4 text-[var(--color-cream)]/90">
            Lack of reliable transport also affects personal safety — many women in rural areas report feeling unsafe
            travelling alone because there are no dependable options. Bóthar aims to expand safe, community-driven
            alternatives by connecting people on the same route and surfacing trusted, reputation-backed drivers.
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
