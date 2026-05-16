export default function Loading() {
  return (
    <div className="flex min-h-[50vh] items-center justify-center">
      <span className="sr-only">Loading…</span>
      <div className="h-6 w-6 animate-spin rounded-full border-2 border-[var(--color-cream)]/30 border-t-[var(--color-cream)]" />
    </div>
  );
}
