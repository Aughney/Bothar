"use client";

import { useState, useEffect } from "react";
import { usePrivy } from "@privy-io/react-auth";
import Link from "next/link";
import type { Ride } from "@/app/db/schema";

export default function FeedPage() {
  const { ready, authenticated, login } = usePrivy();
  const [rides, setRides] = useState<Ride[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const res = await fetch("/api/rides/all");
        if (res.ok) setRides(await res.json());
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  if (!ready) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-[var(--background)] text-[var(--foreground)]">
        <p className="text-[var(--color-cream)]/70">Loading…</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[var(--background)] text-[var(--foreground)]">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10 flex flex-col gap-8">

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="font-display text-4xl tracking-[0.15em]">Available Rides</h1>
            <p className="mt-1 text-[var(--color-cream)]/70 text-sm">Drivers currently offering lifts</p>
          </div>
          <Link
            href="/find"
            className="inline-flex justify-center rounded border border-[var(--color-cream)] text-[var(--color-cream)] font-semibold py-2 px-4 hover:bg-[var(--color-irish-green-dark)]/20"
          >
            My requests
          </Link>
        </div>

        {loading ? (
          <p className="text-[var(--color-cream)]/50 text-sm">Loading rides…</p>
        ) : rides.length === 0 ? (
          <div className="rounded border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.02)] p-8 text-center">
            <p className="text-[var(--color-cream)]/60">No rides available right now.</p>
            <p className="mt-2 text-[var(--color-cream)]/40 text-sm">Check back soon or post a lift request.</p>
            <Link
              href="/find"
              className="mt-4 inline-flex justify-center rounded bg-[var(--color-cream)] text-[var(--color-irish-green)] font-semibold py-2 px-5"
            >
              Post a request
            </Link>
          </div>
        ) : (
          <ul className="flex flex-col gap-4">
            {rides.map((ride) => (
              <li
                key={ride.id}
                className="rounded border border-[rgba(255,255,255,0.1)] bg-[rgba(255,255,255,0.03)] p-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
              >
                <div className="flex flex-col gap-1">
                  <p className="font-semibold text-[var(--color-cream)] text-lg">
                    {ride.from} → {ride.to}
                  </p>
                  <p className="text-sm text-[var(--color-cream)]/70">
                    {new Date(ride.date).toLocaleDateString("en-IE", {
                      weekday: "short", day: "numeric", month: "short", year: "numeric",
                    })} at {ride.time}
                  </p>
                  <p className="text-sm text-[var(--color-cream)]/70">
                    {ride.seats} seat{ride.seats !== 1 ? "s" : ""} available
                  </p>
                  {ride.note && (
                    <p className="text-sm text-[var(--color-cream)]/60 italic">{ride.note}</p>
                  )}
                </div>
                {authenticated ? (
                  <button className="self-start sm:self-center inline-flex justify-center rounded bg-[var(--color-cream)] text-[var(--color-irish-green)] font-semibold py-2 px-4 text-sm">
                    Request seat
                  </button>
                ) : (
                  <button
                    onClick={() => login()}
                    className="self-start sm:self-center inline-flex justify-center rounded bg-[var(--color-cream)] text-[var(--color-irish-green)] font-semibold py-2 px-4 text-sm"
                  >
                    Sign in to request
                  </button>
                )}
              </li>
            ))}
          </ul>
        )}
      </div>
    </main>
  );
}
