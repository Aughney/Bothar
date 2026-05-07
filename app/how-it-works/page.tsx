export default function HowItWorks() {
  return (
    <main className="min-h-screen bg-[var(--background)] text-[var(--foreground)]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="font-display text-4xl mb-4">How it works</h1>

        <p className="text-[var(--color-cream)]/90 mb-6">
          Bóthar connects drivers and passengers travelling similar routes in
          rural Ireland. The platform balances simplicity and safety with
          on-chain reputation and off-chain convenience so communities can share
          rides without becoming a commercial taxi service.
        </p>

        <section className="space-y-6">
          <div>
            <h2 className="text-2xl font-semibold">1. Post a trip (Driver)</h2>
            <p className="mt-2 text-[var(--color-cream)]/90">
              Drivers post a trip with origin, destination, date/time, seats
              available, and an optional short bio. Posting creates an off-chain
              trip listing (fast and searchable) and an on-chain escrow account
              is prepared only when a passenger accepts and payment is required.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-semibold">
              2. Find and request a ride (Passenger)
            </h2>
            <p className="mt-2 text-[var(--color-cream)]/90">
              Passengers search by route and time, then send a request to a
              driver. The driver reviews requests and accepts matching
              passengers. Location-based matching prioritises minimal detours
              and shared routes.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-semibold">
              3. Secure payment with on-chain escrow
            </h2>
            <p className="mt-2 text-[var(--color-cream)]/90">
              Fares are quoted in EUR and settled in USDC on Solana. When a
              passenger and driver agree, the required USDC is moved into an
              on-chain escrow account. Funds are held until the trip completes
              and both parties confirm — then the driver receives payment. This
              ensures fairness and reduces no-shows.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-semibold">
              4. Reputation and rewards (On-chain)
            </h2>
            <p className="mt-2 text-[var(--color-cream)]/90">
              After each completed trip, both driver and passenger can rate each
              other. Ratings are recorded as lightweight on-chain reputation
              badges on Solana, creating an auditable trust signal that is fast
              and low-cost to update. Good behaviour can earn small rewards or
              priority in future matches.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-semibold">
              5. Privacy and community-first design
            </h2>
            <p className="mt-2 text-[var(--color-cream)]/90">
              Bóthar is designed for community use, not commercial dispatch.
              Profiles include a short bio and public reputation score; personal
              contact details are only shared after a booking is confirmed. We
              minimise on-chain data to avoid leaking sensitive information.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-semibold">Quick example flow</h2>
            <ol className="list-decimal pl-5 mt-2 text-[var(--color-cream)]/90 space-y-2">
              <li>
                Driver posts: &ldquo;Kilkenny → Dublin, 08:00, 3 seats&rdquo;.
              </li>
              <li>
                Passenger finds the trip and requests a seat; driver accepts.
              </li>
              <li>
                Passenger authorises USDC payment; funds are placed in escrow on
                Solana.
              </li>
              <li>
                After the ride, passenger confirms arrival; escrow releases
                funds to driver.
              </li>
              <li>Both parties leave ratings; reputation updates on-chain.</li>
            </ol>
          </div>
        </section>
      </div>
    </main>
  );
}
