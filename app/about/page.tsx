export default function About() {
  return (
    <main className="min-h-screen bg-[var(--background)] text-[var(--foreground)]">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="font-display text-4xl mb-4">About Bóthar</h1>

        <p className="text-[var(--color-cream)]/90 mb-4">
          Bóthar is a community-first car-pooling platform for rural Ireland. We
          connect drivers and passengers on the same route to reduce solo
          driving, save money, and improve safety. Our approach is rooted in the
          idea that better connected rural commutes make Ireland more liveable
          and economically resilient.
        </p>

        <h2 className="text-2xl font-semibold mt-6 mb-2">The problem</h2>
        <p className="text-[var(--color-cream)]/90">
          Many rural areas have unreliable or no public transport. Parents
          shoulder school runs, commuters face long drives, and impaired driving
          remains a serious issue. 70% of drivers in Ireland drive alone —
          Bóthar helps reduce that number with reliable community rides.
        </p>

        <h2 className="text-2xl font-semibold mt-6 mb-2">How we help</h2>
        <ul className="list-disc pl-5 text-[var(--color-cream)]/90 space-y-2">
          <li>
            Match drivers and passengers travelling the same route in real-time.
          </li>
          <li>
            On-chain reputation on Solana to reward reliable, safe drivers.
          </li>
          <li>
            Designed for privacy and community use — not a commercial taxi
            service.
          </li>
        </ul>
      </div>
    </main>
  );
}
