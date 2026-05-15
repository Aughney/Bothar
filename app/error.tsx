"use client";

export default function GlobalError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <main className="flex min-h-[60vh] flex-col items-center justify-center gap-6 px-4 text-center">
      <h1 className="font-display text-3xl tracking-[0.15em]">
        Something went wrong
      </h1>
      <p className="max-w-sm text-sm text-[var(--color-cream)]/70">
        An unexpected error occurred. Try again, or go back home.
      </p>
      <button
        type="button"
        onClick={reset}
        className="rounded bg-[var(--color-cream)] px-6 py-3 font-semibold text-[var(--color-irish-green)]"
      >
        Try again
      </button>
    </main>
  );
}
