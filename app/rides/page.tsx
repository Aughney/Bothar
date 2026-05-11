"use client";

import { useState, useEffect, useCallback } from "react";
import { usePrivy } from "@privy-io/react-auth";
import Link from "next/link";
import type { Ride, SeatRequest } from "@/app/db/schema";
import EmailPromptBanner from "@/app/components/EmailPromptBanner";

const EMPTY_FORM = {
  driverName: "",
  from: "",
  to: "",
  date: "",
  time: "",
  seats: 1,
  note: "",
};

export default function RidesPage() {
  const { ready, authenticated, login, user } = usePrivy();
  const [rides, setRides] = useState<Ride[]>([]);
  const [requests, setRequests] = useState<Record<string, SeatRequest[]>>({});
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);
  const [errors, setErrors] = useState<Partial<typeof EMPTY_FORM>>({});
  const [submitting, setSubmitting] = useState(false);
  const [confirmMessage, setConfirmMessage] = useState<string | null>(null);

  const walletAddress = user?.wallet?.address;
  const driverEmail = user?.email?.address ?? "";

  const fetchRides = useCallback(async () => {
    if (!walletAddress) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/rides?wallet=${encodeURIComponent(walletAddress)}`);
      if (!res.ok) return;
      const rows: Ride[] = await res.json();
      setRides(rows);

      // Fetch seat requests for each ride in parallel
      const entries = await Promise.all(
        rows.map(async (ride) => {
          const r = await fetch(`/api/seat-requests?rideId=${ride.id}`);
          const reqs: SeatRequest[] = r.ok ? await r.json() : [];
          return [ride.id, reqs] as [string, SeatRequest[]];
        })
      );
      setRequests(Object.fromEntries(entries));
    } finally {
      setLoading(false);
    }
  }, [walletAddress]);

  useEffect(() => {
    if (authenticated && walletAddress) fetchRides();
  }, [authenticated, walletAddress, fetchRides]);

  async function handleDecision(requestId: string, rideId: string, status: "accepted" | "declined") {
    const res = await fetch(`/api/seat-requests/${requestId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    if (res.ok) {
      const updated: SeatRequest = await res.json();
      setRequests((prev) => ({
        ...prev,
        [rideId]: prev[rideId].map((r) => (r.id === requestId ? updated : r)),
      }));
    }
  }

  /* ── auth gate ── */
  if (!ready) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-[var(--background)] text-[var(--foreground)]">
        <p className="text-[var(--color-cream)]/70">Loading…</p>
      </main>
    );
  }

  if (!authenticated) {
    return (
      <main className="min-h-screen flex flex-col items-center justify-center gap-6 bg-[var(--background)] text-[var(--foreground)] px-4">
        <h1 className="font-display text-4xl tracking-[0.15em]">Manage Rides</h1>
        <p className="text-[var(--color-cream)]/80 text-center max-w-sm">
          Sign in as a driver to view and offer rides.
        </p>
        <button
          onClick={() => login()}
          className="inline-flex justify-center rounded bg-[var(--color-cream)] text-[var(--color-irish-green)] font-semibold py-3 px-6"
        >
          Sign in
        </button>
        <Link href="/" className="text-sm text-[var(--color-cream)]/60 underline">Back to home</Link>
      </main>
    );
  }

  function validate() {
    const e: Partial<typeof EMPTY_FORM> = {};
    if (!form.from.trim()) e.from = "Required";
    if (!form.to.trim()) e.to = "Required";
    if (!form.date) e.date = "Required";
    if (!form.time) e.time = "Required";
    return e;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }
    setSubmitting(true);
    try {
      const res = await fetch("/api/rides", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, driverWallet: walletAddress, driverEmail }),
      });
      if (res.ok) {
        const newRide: Ride = await res.json();
        setRides((prev) => [...prev, newRide]);
        setRequests((prev) => ({ ...prev, [newRide.id]: [] }));
        setForm(EMPTY_FORM);
        setErrors({});
        setShowForm(false);
        setConfirmMessage("Journey added. You can view it in your list.");
      }
    } finally {
      setSubmitting(false);
    }
  }

  async function handleRemove(id: string) {
    await fetch(`/api/rides/${id}`, { method: "DELETE" });
    setRides((prev) => prev.filter((r) => r.id !== id));
    setRequests((prev) => { const next = { ...prev }; delete next[id]; return next; });
  }

  const displayName =
    user?.email?.address ??
    (walletAddress ? walletAddress.slice(0, 8) + "…" : "Driver");

  const statusBadge = (status: string) => {
    if (status === "accepted") return <span className="text-xs rounded px-2 py-0.5 bg-green-900/40 text-green-300">Accepted</span>;
    if (status === "declined") return <span className="text-xs rounded px-2 py-0.5 bg-red-900/40 text-red-300">Declined</span>;
    return <span className="text-xs rounded px-2 py-0.5 bg-[rgba(255,255,255,0.08)] text-[var(--color-cream)]/60">Pending</span>;
  };

  return (
    <main className="min-h-screen bg-[var(--background)] text-[var(--foreground)]">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10 flex flex-col gap-8">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="font-display text-4xl tracking-[0.15em]">Manage Rides</h1>
            <p className="mt-1 text-[var(--color-cream)]/70 text-sm">Signed in as {displayName}</p>
          </div>
          {!showForm && (
            <button
              onClick={() => setShowForm(true)}
              className="inline-flex justify-center rounded bg-[var(--color-cream)] text-[var(--color-irish-green)] font-semibold py-2 px-5"
            >
              + Offer a ride
            </button>
          )}
        </div>

        <EmailPromptBanner />

        {/* Confirmation */}
        {confirmMessage && (
          <div className="rounded border border-[rgba(255,255,255,0.14)] bg-[rgba(0,0,0,0.12)] px-4 py-3 text-[var(--color-cream)]/90">
            {confirmMessage}
          </div>
        )}

        {/* Add ride form */}
        {showForm && (
          <section className="rounded border border-[rgba(255,255,255,0.1)] bg-[rgba(255,255,255,0.03)] p-6">
            <h2 className="text-xl font-semibold text-[var(--color-cream)] mb-5">New ride</h2>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4" noValidate>
              <div className="flex flex-col gap-1">
                <label className="text-sm text-[var(--color-cream)]/80">Your name</label>
                <input type="text" placeholder="e.g. Mary" value={form.driverName}
                  onChange={(e) => setForm((f) => ({ ...f, driverName: e.target.value }))}
                  className="rounded border border-[rgba(255,255,255,0.12)] bg-[rgba(255,255,255,0.05)] px-3 py-2 text-[var(--color-cream)] placeholder:text-[var(--color-cream)]/40 focus:outline-none focus:border-[var(--color-cream)]/50" />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1">
                  <label className="text-sm text-[var(--color-cream)]/80">From</label>
                  <input type="text" placeholder="e.g. Clifden" value={form.from}
                    onChange={(e) => setForm((f) => ({ ...f, from: e.target.value }))}
                    className="rounded border border-[rgba(255,255,255,0.12)] bg-[rgba(255,255,255,0.05)] px-3 py-2 text-[var(--color-cream)] placeholder:text-[var(--color-cream)]/40 focus:outline-none focus:border-[var(--color-cream)]/50" />
                  {errors.from && <p className="text-red-400 text-xs">{errors.from}</p>}
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-sm text-[var(--color-cream)]/80">To</label>
                  <input type="text" placeholder="e.g. Galway" value={form.to}
                    onChange={(e) => setForm((f) => ({ ...f, to: e.target.value }))}
                    className="rounded border border-[rgba(255,255,255,0.12)] bg-[rgba(255,255,255,0.05)] px-3 py-2 text-[var(--color-cream)] placeholder:text-[var(--color-cream)]/40 focus:outline-none focus:border-[var(--color-cream)]/50" />
                  {errors.to && <p className="text-red-400 text-xs">{errors.to}</p>}
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1">
                  <label className="text-sm text-[var(--color-cream)]/80">Date</label>
                  <input type="date" value={form.date}
                    onChange={(e) => setForm((f) => ({ ...f, date: e.target.value }))}
                    className="rounded border border-[rgba(255,255,255,0.12)] bg-[rgba(255,255,255,0.05)] px-3 py-2 text-[var(--color-cream)] focus:outline-none focus:border-[var(--color-cream)]/50" />
                  {errors.date && <p className="text-red-400 text-xs">{errors.date}</p>}
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-sm text-[var(--color-cream)]/80">Time</label>
                  <input type="time" value={form.time}
                    onChange={(e) => setForm((f) => ({ ...f, time: e.target.value }))}
                    className="rounded border border-[rgba(255,255,255,0.12)] bg-[rgba(255,255,255,0.05)] px-3 py-2 text-[var(--color-cream)] focus:outline-none focus:border-[var(--color-cream)]/50" />
                  {errors.time && <p className="text-red-400 text-xs">{errors.time}</p>}
                </div>
              </div>
              <div className="flex flex-col gap-1 max-w-[160px]">
                <label className="text-sm text-[var(--color-cream)]/80">Seats available</label>
                <input type="number" min={1} max={8} value={form.seats}
                  onChange={(e) => setForm((f) => ({ ...f, seats: Number(e.target.value) }))}
                  className="rounded border border-[rgba(255,255,255,0.12)] bg-[rgba(255,255,255,0.05)] px-3 py-2 text-[var(--color-cream)] focus:outline-none focus:border-[var(--color-cream)]/50" />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-sm text-[var(--color-cream)]/80">Note <span className="text-[var(--color-cream)]/40">(optional)</span></label>
                <textarea rows={2} placeholder="e.g. Leaving at 8am sharp, can drop at bus station" value={form.note}
                  onChange={(e) => setForm((f) => ({ ...f, note: e.target.value }))}
                  className="rounded border border-[rgba(255,255,255,0.12)] bg-[rgba(255,255,255,0.05)] px-3 py-2 text-[var(--color-cream)] placeholder:text-[var(--color-cream)]/40 focus:outline-none focus:border-[var(--color-cream)]/50 resize-none" />
              </div>
              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <button type="submit" disabled={submitting}
                  className="inline-flex justify-center rounded bg-[var(--color-cream)] text-[var(--color-irish-green)] font-semibold py-2 px-5 disabled:opacity-60">
                  {submitting ? "Saving…" : "Add ride"}
                </button>
                <button type="button" onClick={() => { setShowForm(false); setForm(EMPTY_FORM); setErrors({}); }}
                  className="inline-flex justify-center rounded border border-[rgba(255,255,255,0.14)] text-[var(--color-cream)]/80 py-2 px-5 hover:bg-[rgba(255,255,255,0.04)]">
                  Cancel
                </button>
              </div>
            </form>
          </section>
        )}

        {/* Ride list */}
        {loading ? (
          <p className="text-[var(--color-cream)]/50 text-sm">Loading rides…</p>
        ) : rides.length === 0 && !showForm ? (
          <div className="rounded border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.02)] p-8 text-center">
            <p className="text-[var(--color-cream)]/60">You haven&rsquo;t offered any rides yet.</p>
            <button onClick={() => setShowForm(true)}
              className="mt-4 inline-flex justify-center rounded bg-[var(--color-cream)] text-[var(--color-irish-green)] font-semibold py-2 px-5">
              Offer your first ride
            </button>
          </div>
        ) : (
          <ul className="flex flex-col gap-6">
            {rides.map((ride) => {
              const rideRequests = requests[ride.id] ?? [];
              const pendingCount = rideRequests.filter((r) => r.status === "pending").length;
              return (
                <li key={ride.id} className="rounded border border-[rgba(255,255,255,0.1)] bg-[rgba(255,255,255,0.03)] overflow-hidden">

                  {/* Ride summary */}
                  <div className="p-5 flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                    <div className="flex flex-col gap-1">
                      <p className="font-semibold text-[var(--color-cream)] text-lg">{ride.from} → {ride.to}</p>
                      {ride.driverName && (
                        <p className="text-sm text-[var(--color-cream)]/70">
                          {ride.driverName} · <span className="text-amber-400">★★★★★</span> <span className="text-[var(--color-cream)]/40 text-xs">New driver</span>
                        </p>
                      )}
                      <p className="text-sm text-[var(--color-cream)]/70">
                        {new Date(ride.date).toLocaleDateString("en-IE", {
                          weekday: "short", day: "numeric", month: "short", year: "numeric",
                        })} at {ride.time}
                      </p>
                      <p className="text-sm text-[var(--color-cream)]/70">{ride.seats} seat{ride.seats !== 1 ? "s" : ""} available</p>
                      {ride.note && <p className="text-sm text-[var(--color-cream)]/60 italic">{ride.note}</p>}
                      {pendingCount > 0 && (
                        <p className="text-sm text-[var(--color-cream)] font-semibold mt-1">
                          {pendingCount} pending request{pendingCount !== 1 ? "s" : ""}
                        </p>
                      )}
                    </div>
                    <button onClick={() => handleRemove(ride.id)}
                      className="self-start sm:self-center text-sm text-[var(--color-cream)]/50 hover:text-red-400 border border-[rgba(255,255,255,0.1)] rounded px-3 py-1">
                      Remove
                    </button>
                  </div>

                  {/* Seat requests */}
                  {rideRequests.length > 0 && (
                    <div className="border-t border-[rgba(255,255,255,0.07)] px-5 py-4 flex flex-col gap-3">
                      <p className="text-xs text-[var(--color-cream)]/50 uppercase tracking-wide">Seat requests</p>
                      {rideRequests.map((req) => (
                        <div key={req.id} className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 rounded border border-[rgba(255,255,255,0.07)] bg-[rgba(0,0,0,0.08)] px-4 py-3">
                          <div className="flex flex-col gap-1">
                            <p className="text-sm text-[var(--color-cream)]/90 font-mono">
                              {req.passengerWallet.slice(0, 12)}…
                            </p>
                            {req.message && (
                              <p className="text-sm text-[var(--color-cream)]/70 italic">&ldquo;{req.message}&rdquo;</p>
                            )}
                            <div className="mt-1">{statusBadge(req.status)}</div>
                          </div>
                          {req.status === "pending" && (
                            <div className="flex gap-2 self-start sm:self-center">
                              <button
                                onClick={() => handleDecision(req.id, ride.id, "accepted")}
                                className="text-sm rounded bg-[var(--color-cream)] text-[var(--color-irish-green)] font-semibold px-3 py-1.5"
                              >
                                Accept
                              </button>
                              <button
                                onClick={() => handleDecision(req.id, ride.id, "declined")}
                                className="text-sm rounded border border-[rgba(255,255,255,0.14)] text-[var(--color-cream)]/70 px-3 py-1.5 hover:bg-[rgba(255,255,255,0.04)]"
                              >
                                Decline
                              </button>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </main>
  );
}
