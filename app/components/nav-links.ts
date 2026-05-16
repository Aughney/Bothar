export const navLinks = [
  { href: "/about", label: "About" },
  { href: "/how-it-works", label: "How it works" },
] as const;

export const navCtas = [
  {
    href: "/signin?role=passenger",
    label: "Find a lift",
    className:
      "inline-flex items-center gap-2 py-2 px-3 rounded bg-[var(--color-cream)] text-[var(--color-irish-green)] font-semibold",
    mobileClassName:
      "inline-flex items-center justify-center gap-2 py-3 px-4 rounded bg-[var(--color-cream)] text-[var(--color-irish-green)] font-semibold",
  },
  {
    href: "/signin?role=driver",
    label: "Offer a lift",
    className:
      "inline-flex items-center gap-2 py-2 px-3 rounded border border-[var(--color-cream)] text-[var(--color-cream)] hover:bg-[var(--color-irish-green-dark)]/20",
    mobileClassName:
      "inline-flex items-center justify-center gap-2 py-3 px-4 rounded border border-[var(--color-cream)] text-[var(--color-cream)] hover:bg-[var(--color-irish-green-dark)]/20",
  },
] as const;
