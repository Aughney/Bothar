export default function Team() {
  return (
    <main className="min-h-screen bg-[var(--background)] text-[var(--foreground)] flex items-center justify-center">
      <div className="max-w-3xl mx-auto p-8">
        <h1 className="font-display text-4xl mb-4">Team</h1>

        <p className="text-[var(--color-cream)]/90 mb-6">Co-founders and core team behind Bóthar.</p>

        <section className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <div className="p-4 bg-[rgba(255,255,255,0.03)] rounded">
            <h2 className="text-xl font-semibold">Niamh Aughney</h2>
            <p className="text-[var(--color-cream)]/90 mt-2">Co-founder — product and community lead. Focuses on rural outreach and user research.</p>
          </div>

          <div className="p-4 bg-[rgba(255,255,255,0.03)] rounded">
            <h2 className="text-xl font-semibold">Frank Poncelet</h2>
            <p className="text-[var(--color-cream)]/90 mt-2">Co-founder — engineering lead. Builds on-chain reputation and matching systems.</p>
          </div>
        </section>
      </div>
    </main>
  );
}
