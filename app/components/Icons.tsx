export function ConnectionIcon({
  className = "h-8 w-8",
}: {
  className?: string;
}) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden
    >
      <circle cx="7" cy="12" r="3" stroke="currentColor" strokeWidth="1.2" />
      <circle cx="17" cy="7" r="2.5" stroke="currentColor" strokeWidth="1.2" />
      <circle cx="17" cy="17" r="2.5" stroke="currentColor" strokeWidth="1.2" />
      <path
        d="M9.2 12c2-1 3.6-1.4 5.6-5"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
      />
      <path
        d="M9.2 12c2 1 3.6 1.4 5.6 5"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function SolanaLogo({
  className = "h-8 w-auto",
}: {
  className?: string;
}) {
  // simplified Solana mark using three slanted parallelograms
  return (
    <svg
      viewBox="0 0 256 256"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <defs>
        <linearGradient id="g" x1="0" x2="1">
          <stop offset="0" stopColor="#00FFA3" />
          <stop offset="1" stopColor="#DC1FFF" />
        </linearGradient>
      </defs>
      <g fill="url(#g)">
        <path d="M10 60 L210 10 L240 40 L40 90 Z" />
        <path d="M10 110 L210 60 L240 90 L40 140 Z" opacity="0.9" />
        <path d="M10 160 L210 110 L240 140 L40 190 Z" opacity="0.8" />
      </g>
    </svg>
  );
}

export function SuperteamLogo({
  className = "h-8 w-auto",
}: {
  className?: string;
}) {
  // stylised shamrock mark for Superteam Ireland (simple, recognisable)
  return (
    <svg
      viewBox="0 0 64 64"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <g fill="none" stroke="currentColor" strokeWidth="1.5">
        <path
          d="M32 36c-6-6-12-6-12-12a6 6 0 1 1 12 0c0 4-2 4 0 12z"
          fill="currentColor"
        />
        <path
          d="M32 36c6-6 12-6 12-12a6 6 0 1 0-12 0c0 4 2 4 0 12z"
          fill="currentColor"
        />
        <path
          d="M32 36c-6 6-6 12-12 12a6 6 0 1 0 12 0c0-4 2-4 0-12z"
          fill="currentColor"
        />
        <path
          d="M32 36c6 6 6 12 12 12a6 6 0 1 1-12 0c0-4-2-4 0-12z"
          fill="currentColor"
        />
        <circle cx="32" cy="28" r="3" fill="rgba(0,0,0,0)" />
      </g>
    </svg>
  );
}
