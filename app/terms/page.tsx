import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service — Bóthar",
  description:
    "Draft Terms of Service for Bóthar. Hackathon/devnet demo only — not production legal terms.",
};

export default function Terms() {
  return (
    <main className="min-h-screen bg-[var(--background)] text-[var(--foreground)]">
      <article className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6 text-[var(--color-cream)]/90">
        <header>
          <h1 className="font-display text-4xl mb-2">Terms of Service</h1>
          <p className="text-sm text-[var(--color-cream)]/70">
            Draft — last updated 05-05-2026
          </p>
        </header>

        <p>
          These Terms of Service (&ldquo;Terms&rdquo;) govern your access to and
          use of Bóthar (the &ldquo;Service&rdquo;), a community cost-sharing
          lift-share application built for rural communities. The Service is
          provided by the project maintainers (&ldquo;we&rdquo;,
          &ldquo;us&rdquo;, &ldquo;Bóthar&rdquo;). By using the Service you
          agree to these Terms.
        </p>
        <p>
          This is a draft Terms document prepared for the Bóthar v1 codebase and
          demo. It is intended for the hackathon/devnet demo and must be
          reviewed by qualified legal counsel before any production or mainnet
          deployment.
        </p>

        <section>
          <h2 className="text-2xl font-semibold mt-4 mb-2">
            1. Acceptance; Eligibility
          </h2>
          <ul className="list-disc pl-5 space-y-1">
            <li>
              <strong>Eligibility:</strong> You must be at least 18 years old
              (or the legal age of majority in your jurisdiction) to use the
              Service.
            </li>
            <li>
              <strong>Acceptance:</strong> By creating an account, signing in,
              or using the Service you accept and agree to be bound by these
              Terms.
            </li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mt-4 mb-2">
            2. Service Description
          </h2>
          <p>
            Bóthar is a mobile-first Progressive Web App that helps users post
            and accept shared rides. Fares are quoted in EUR and settled in USDC
            on Solana (devnet for v1). The v1 hackathon/demo targets Solana
            devnet, uses Privy for embedded wallets and sign-in, and implements
            a manual off-chain driver licence verification flow; it is not a
            production transport or payment service.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mt-4 mb-2">
            3. User Responsibilities and Conduct
          </h2>
          <ul className="list-disc pl-5 space-y-1">
            <li>
              <strong>Independent Parties:</strong> Bóthar facilitates
              introductions between individuals. Drivers are independent
              participants — we do not employ, license, insure, vet, or direct
              drivers beyond the limited off-chain verification flow described
              in the product spec.
            </li>
            <li>
              <strong>Insurance &amp; Licensing:</strong> It is each
              user&rsquo;s responsibility to ensure they are properly licensed
              and insured for carrying passengers. Drivers should confirm their
              insurance permits non-commercial cost-sharing.
            </li>
            <li>
              <strong>Prohibited Conduct:</strong> Users must not post illegal
              content, personal addresses or phone numbers in public trip notes,
              or harass other users. We may remove content and suspend accounts
              for violations.
            </li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mt-4 mb-2">
            4. Driver Verification
          </h2>
          <p>
            In v1, driver licence verification is an off-chain, manual review
            process intended only as a trust indicator. Licence images are
            stored privately and are not written on-chain or publicly published.
            Approval of a verification submission is not an endorsement that the
            driver is legally licensed, insured, or fit for any specific ride.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mt-4 mb-2">
            5. Payments, Escrow, and Fees
          </h2>
          <ul className="list-disc pl-5 space-y-1">
            <li>
              <strong>Escrow:</strong> When a passenger funds a trip, the agreed
              fare (USDC) is held via a Solana escrow program. Release
              conditions are described in the product specification.
            </li>
            <li>
              <strong>Currency &amp; Network:</strong> Fares are quoted in EUR
              and settled in USDC. v1 operates on Solana devnet.
            </li>
            <li>
              <strong>Fees &amp; Commission:</strong> v1 operates with 0%
              platform commission. Network fees are paid by the transaction
              signer.
            </li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mt-4 mb-2">
            6. Disputes and Refunds
          </h2>
          <p>
            Either party may raise a dispute before escrow is released. v1
            dispute handling is manual — platform administrators review the case
            and decide on release, refund, or split outcomes. Refunds are only
            issued pursuant to admin resolution or programmatic rules of the
            escrow contract.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mt-4 mb-2">
            7. Content, Ratings, and Reputation
          </h2>
          <p>
            Ratings and certain reputation data may be recorded on-chain and are
            immutable. Off-chain trip listings, comments, and licence
            submissions may be edited or removed by administrators. We reserve
            the right to remove content and suspend or terminate accounts for
            abuse, fraud, or breaches of these Terms.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mt-4 mb-2">
            8. Privacy; Personal Data
          </h2>
          <p>
            Privacy practices are described in the Service&rsquo;s{" "}
            <a href="/privacy" className="underline">
              Privacy Policy
            </a>
            . Licence images and KYC-style documents are treated as sensitive
            personal data: in v1 they are stored privately off-chain and only
            accessible to authorised admins via short-lived URLs.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mt-4 mb-2">
            9. Intellectual Property
          </h2>
          <p>
            We (or our licensors) own or control the Service&rsquo;s software,
            designs, logos, and documentation. You may not copy, modify,
            distribute, or create derivative works from the Service except as
            expressly permitted in writing.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mt-4 mb-2">10. Termination</h2>
          <p>
            We may suspend or terminate accounts for violations of these Terms
            or for operational reasons. Users may terminate their account by
            following the account settings flow; termination does not
            automatically cancel unresolved trips or escrowed funds.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mt-4 mb-2">
            11. Disclaimers; No Warranty
          </h2>
          <p>
            THE SERVICE IS PROVIDED &ldquo;AS IS&rdquo; AND &ldquo;AS
            AVAILABLE&rdquo; WITHOUT WARRANTIES OF ANY KIND. TO THE MAXIMUM
            EXTENT PERMITTED BY LAW, WE DISCLAIM ALL IMPLIED WARRANTIES,
            INCLUDING MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, AND
            NON-INFRINGEMENT. We do not guarantee the conduct, safety, or legal
            compliance of other users.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mt-4 mb-2">
            12. Limitation of Liability
          </h2>
          <p>
            TO THE MAXIMUM EXTENT PERMITTED BY APPLICABLE LAW, IN NO EVENT WILL
            WE BE LIABLE FOR INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR
            CONSEQUENTIAL DAMAGES ARISING OUT OF OR IN CONNECTION WITH THE
            SERVICE.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mt-4 mb-2">
            13. Indemnification
          </h2>
          <p>
            You agree to indemnify and hold harmless Bóthar, its maintainers,
            and affiliates from claims, liabilities, damages, losses, and
            expenses (including reasonable legal fees) arising from your breach
            of these Terms or your misuse of the Service.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mt-4 mb-2">
            14. Jurisdiction; Governing Law
          </h2>
          <p>
            These Terms are governed by the laws of Ireland (subject to change
            before production). Disputes that cannot be resolved amicably will
            be subject to the exclusive jurisdiction of the courts of Ireland
            unless otherwise required by applicable law.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mt-4 mb-2">
            15. Changes to the Service and Terms
          </h2>
          <p>
            We may modify or discontinue the Service at any time. We will post
            changes to these Terms and indicate the &ldquo;Last updated&rdquo;
            date. Continued use after changes constitutes acceptance.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold mt-4 mb-2">
            16. Contact and Feedback
          </h2>
          <p>
            For questions about these Terms, legal inquiries, or to report
            abuse, contact the project maintainers via the project repository.
          </p>
        </section>

        <section className="mt-8 p-4 bg-[rgba(255,255,255,0.03)] rounded text-sm">
          <h3 className="font-semibold mb-2">At a glance</h3>
          <ul className="list-disc pl-5 space-y-1">
            <li>
              Bóthar connects neighbours to share rides and hold small payments
              in on-chain escrow.
            </li>
            <li>
              Drivers must complete an off-chain licence review in v1; approval
              is a trust signal, not a guarantee.
            </li>
            <li>
              The Service does not provide insurance or licensing; users are
              responsible for their own compliance and safety.
            </li>
            <li>
              This is a draft tailored to the v1 architecture (devnet, Privy,
              off-chain index, manual KYC). It is not legal advice.
            </li>
          </ul>
        </section>
      </article>
    </main>
  );
}
