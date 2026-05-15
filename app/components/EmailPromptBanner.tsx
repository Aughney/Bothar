"use client";

import { useState } from "react";
import { usePrivy } from "@privy-io/react-auth";

const DISMISSED_KEY = "bothar_email_banner_dismissed";

export default function EmailPromptBanner() {
  const { user, linkEmail } = usePrivy();
  const [dismissed, setDismissed] = useState(
    () =>
      typeof window !== "undefined" &&
      localStorage.getItem(DISMISSED_KEY) === "1",
  );

  const hasEmail = !!user?.email?.address;

  if (hasEmail || dismissed) return null;

  function handleDismiss() {
    localStorage.setItem(DISMISSED_KEY, "1");
    setDismissed(true);
  }

  return (
    <div className="rounded border border-[var(--color-irish-green-dark)]/40 bg-[var(--color-irish-green-dark)]/10 px-4 py-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
      <p className="text-sm text-[var(--color-cream)]/90">
        <span className="font-semibold text-[var(--color-cream)]">
          Add your email
        </span>{" "}
        — get notified when your ride is confirmed or your request is accepted.
      </p>
      <div className="flex items-center gap-2 shrink-0">
        <button
          type="button"
          onClick={linkEmail}
          className="inline-flex justify-center rounded bg-[var(--color-cream)] text-[var(--color-irish-green)] font-semibold py-1.5 px-4 text-sm"
        >
          Add email
        </button>
        <button
          type="button"
          onClick={handleDismiss}
          className="text-sm text-[var(--color-cream)]/50 hover:text-[var(--color-cream)]/80 px-2 py-1.5"
        >
          Dismiss
        </button>
      </div>
    </div>
  );
}
