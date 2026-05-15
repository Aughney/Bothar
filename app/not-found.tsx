import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex min-h-[60vh] flex-col items-center justify-center gap-6 px-4 text-center">
      <h1 className="font-display text-4xl tracking-[0.15em]">
        Page not found
      </h1>
      <p className="max-w-sm text-sm text-[var(--color-cream)]/70">
        The page you are looking for does not exist or has been moved.
      </p>
      <Link
        href="/"
        className="rounded bg-[var(--color-cream)] px-6 py-3 font-semibold text-[var(--color-irish-green)]"
      >
        Back to home
      </Link>
    </main>
  );
}
