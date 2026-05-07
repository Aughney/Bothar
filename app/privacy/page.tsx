import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy — Bóthar",
  description:
    "Draft Privacy Policy for Bóthar. Hackathon/devnet demo only — not production legal terms.",
};

export default function Privacy() {
  return (
    <main className="min-h-screen bg-[var(--background)] text-[var(--foreground)]">
      <article className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 text-[var(--color-cream)]/90">
        <header>
          <h1 className="font-display text-4xl mb-2">Privacy Policy</h1>
          <p className="text-sm text-[var(--color-cream)]/70">
            Draft — last updated 05-05-2026
          </p>
        </header>

        <p>
          This Privacy Policy describes how Bóthar (&ldquo;we&rdquo;,
          &ldquo;us&rdquo;) handles personal data in the v1 hackathon/devnet
          demo. It is a draft and must be reviewed by qualified counsel before
          any production launch.
        </p>

        <section>
          <h2 className="text-2xl font-semibold mt-4 mb-2">What we collect</h2>
          <ul className="list-disc pl-5 space-y-1">
            <li>
              <strong>Account data:</strong> email address (via Privy),
              embedded-wallet public key, optional display name and short bio.
            </li>
            <li>
              <strong>Trip data:</strong> origin/destination text, time, seats,
              and trip notes you publish.
            </li>
            <li>
              <strong>Driver verification:</strong> licence images and
              verification metadata, stored privately off-chain and only
              accessible to authorised admins via short-lived URLs.
            </li>
            <li>
              <strong>On-chain data:</strong> escrow state, ratings, and
              reputation badges. These are public and immutable on Solana.
            </li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mt-4 mb-2">How we use it</h2>
          <ul className="list-disc pl-5 space-y-1">
            <li>To match drivers and passengers travelling the same route.</li>
            <li>To process escrow funding and release on Solana devnet.</li>
            <li>
              To moderate content, investigate abuse, and resolve disputes.
            </li>
            <li>
              To improve the service via aggregate, non-identifying analytics.
            </li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mt-4 mb-2">
            What we do not do
          </h2>
          <ul className="list-disc pl-5 space-y-1">
            <li>We do not sell personal data.</li>
            <li>
              We do not write licence images, contact details, or other
              sensitive personal data on-chain.
            </li>
            <li>
              We do not share home addresses or phone numbers with other users
              before a booking is confirmed.
            </li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mt-4 mb-2">
            On-chain data is permanent
          </h2>
          <p>
            Ratings, reputation badges, and escrow records written to Solana are
            public and cannot be deleted. We minimise on-chain personal data and
            keep identifying details off-chain.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mt-4 mb-2">Your rights</h2>
          <p>
            You can request access to, correction of, or deletion of your
            off-chain personal data by contacting the project maintainers.
            On-chain data cannot be deleted but can be dissociated from new
            accounts.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mt-4 mb-2">Contact</h2>
          <p>
            For privacy questions or data requests, contact the project
            maintainers via the project repository.
          </p>
        </section>

        <section className="mt-8 p-4 bg-[rgba(255,255,255,0.03)] rounded text-sm">
          <p>
            See also the{" "}
            <a href="/terms" className="underline">
              Terms of Service
            </a>
            .
          </p>
        </section>
      </article>
    </main>
  );
}
