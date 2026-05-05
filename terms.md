# Bóthar — Terms of Service (Draft)

Last updated: 2026-05-05

These Terms of Service ("Terms") govern your access to and use of Bóthar (the "Service"), a community cost-sharing lift-share application built for rural communities. The Service is provided by the project maintainers ("we", "us", "Bóthar"). By using the Service you agree to these Terms.

This is a draft Terms document prepared for the Bóthar v1 codebase and demo. It is intended for the hackathon/devnet demo and must be reviewed by qualified legal counsel before any production or mainnet deployment.

1. Acceptance; Eligibility

- Eligibility: You must be at least 18 years old (or the legal age of majority in your jurisdiction) to use the Service. By using the Service you represent that you meet this requirement.
- Acceptance: By creating an account, signing in, or using the Service you accept and agree to be bound by these Terms.

2. Service Description

- Bóthar is a mobile-first Progressive Web App that helps users post and accept shared rides. Fares are quoted in EUR and settled in USDC on Solana (devnet for v1). The Service provides off-chain trip listings and application workflows, and an on-chain Anchor program for escrow, reputation, and ratings in later stages.
- v1 Scope: The hackathon/demo targets Solana devnet, uses Privy for embedded wallets and sign-in, and implements a manual off-chain driver licence verification flow; it is not a production transport or payment service.

3. User Responsibilities and Conduct

- Independent Parties: Bóthar facilitates introductions between individuals. Drivers are independent participants — we do not employ, license, insure, vet, or direct drivers beyond the limited off-chain verification flow described in the product spec.
- Insurance & Licensing: It is each user's responsibility to ensure they are properly licensed and insured for carrying passengers. The Service does not provide insurance or guarantee that a driver is legally permitted to operate commercially. Drivers should confirm their insurance permits non-commercial cost-sharing.
- Prohibited Conduct: Users must not post illegal content, personal addresses/phone numbers in public trip notes, or harass other users. We may remove content and suspend accounts for violations.

4. Driver Verification

- Off-chain Review: In v1, driver licence verification is an off-chain, manual review process intended only as a trust indicator. Licence images are stored privately and are not written on-chain or publicly published.
- No Guarantee: Approval of a driver verification submission is not an endorsement that the driver is legally licensed, insured, or fit for any specific ride. Users rely on verification at their own risk.

5. Payments, Escrow, and Fees

- Escrow: When a passenger funds a trip, the agreed fare (USDC) is held via a Solana escrow program. Release conditions (passenger confirmation, auto-release after 24 hours, or dispute resolution) are described in the product specification.
- Currency & Network: Fares are quoted in EUR and settled in USDC. v1 operates on Solana devnet for demonstration; network behavior, token availability, and fees may differ on mainnet.
- Fees & Commission: For v1 we intend to operate with 0% platform commission. Network fees are paid by the transaction signer as dictated by the Solana network.

6. Disputes and Refunds

- Disputes: Either party may raise a dispute before escrow is released. v1 dispute handling is manual — platform administrators review the case and decide on release, refund, or split outcomes.
- Refunds: Refunds are only issued pursuant to admin resolution or programmatic rules of the escrow contract.

7. Content, Ratings, and Reputation

- Immutable On-chain Data: Ratings and certain reputation data may be recorded on-chain and are immutable. Off-chain trip listings, comments, and licence submissions may be edited or removed by administrators.
- Abuse & Moderation: We reserve the right to remove content and suspend or terminate accounts for abuse, fraud, or breaches of these Terms.

8. Privacy; Personal Data

- Privacy practices are described in the Service's Privacy Policy (see /privacy). Licence images and KYC-style documents are treated as sensitive personal data: in v1 they are stored privately off-chain and only accessible to authorised admins via short-lived URLs.

9. Intellectual Property

- Rights: We (or our licensors) own or control the Service's software, designs, logos, and documentation. You may not copy, modify, distribute, or create derivative works from the Service except as expressly permitted in writing.

10. Termination

- Suspension & Termination: We may suspend or terminate accounts for violations of these Terms or for operational reasons. Users may terminate their account by following the account settings flow; termination does not automatically cancel unresolved trips or escrowed funds.

11. Disclaimers; No Warranty

- AS-IS: THE SERVICE IS PROVIDED "AS IS" AND "AS AVAILABLE" WITHOUT WARRANTIES OF ANY KIND. TO THE MAXIMUM EXTENT PERMITTED BY LAW, WE DISCLAIM ALL IMPLIED WARRANTIES, INCLUDING MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, AND NON-INFRINGEMENT.
- NO GUARANTEE: We do not guarantee the conduct, safety, or legal compliance of other users, drivers, or passengers.

12. Limitation of Liability

- TO THE MAXIMUM EXTENT PERMITTED BY APPLICABLE LAW, IN NO EVENT WILL WE BE LIABLE FOR INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES ARISING OUT OF OR IN CONNECTION WITH THE SERVICE, INCLUDING LOSS OF PROFITS, DATA, OR GOODWILL.

13. Indemnification

- You agree to indemnify and hold harmless Bóthar, its maintainers, and affiliates from claims, liabilities, damages, losses, and expenses (including reasonable legal fees) arising from your breach of these Terms or your misuse of the Service.

14. Jurisdiction; Governing Law

- Governing Law: These Terms are governed by the laws of Ireland (subject to change before production). Disputes that cannot be resolved amicably will be subject to the exclusive jurisdiction of the courts of Ireland unless otherwise required by applicable law.

15. Changes to the Service and Terms

- Updates: We may modify or discontinue the Service (or any part) at any time. We will post changes to these Terms and indicate the "Last updated" date. Continued use after changes constitutes acceptance.

16. Contact and Feedback

- For questions about these Terms, legal inquiries, or to report abuse, contact the project maintainers via the project repository or the contact details in the README.

17. Final Notes

- This document is a draft tailored to the current Bothar v1 architecture (devnet, Privy, Supabase off-chain index, manual KYC). It is not legal advice. Before any production launch, engage qualified legal counsel to review and adapt these Terms for compliance with local laws (transport, payments, data protection, consumer rights, and insurance requirements).

---

Appendix: Quick summary for users

- Bóthar connects neighbours to share rides and hold small payments in on-chain escrow.
- Drivers must complete an off-chain licence review in v1; approval is a trust signal, not a guarantee.
- The Service does not provide insurance or licensing; users are responsible for their own compliance and safety.
