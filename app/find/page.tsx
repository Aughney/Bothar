"use client";

import { useState, useEffect, useCallback } from "react";
import { usePrivy } from "@privy-io/react-auth";
import Link from "next/link";
import type { Trip, SeatRequest, Ride } from "@/app/db/schema";
import EmailPromptBanner from "@/app/components/EmailPromptBanner";

const EMPTY_FORM = { from: "", to: "", date: "", time: "", note: "" };

export default function FindPage() {
  const { ready, authenticated, login, user } = usePrivy();
  const [trips, setTrips] = useState<Trip[]>([]);
  const [myRequests, setMyRequests] = useState<SeatRequest[]>([]);
  const [ridesMap, setRidesMap] = useState<Record<string, Ride>>({});
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);
  const [errors, setErrors] = useState<Partial<typeof EMPTY_FORM>>({});
  const [submitting, setSubmitting] = useState(false);
  const [confirmMessage, setConfirmMessage] = useState<string | null>(null);

  const walletAddress = user?.wallet?.address;

  const fetchAll = useCallback(async () => {
    if (!walletAddress) return;
    setLoading(true);
    try {
      const [tripsRes, requestsRes, allRidesRes] = await Promise.all([
        fetch(`/api/trips?wallet=${encodeURIComponent(walletAddress)}`),
        fetch(`/api/seat-requests?passengerWallet=${encodeURIComponent(walletAddress)}`),
        fetch(`/api/rides/all`),
      ]);
      if (tripsRes.ok) setTrips(await tripsRes.json());
      if (requestsRes.ok) setMyRequests(await requestsRes.json());
      if (allRidesRes.ok) {
        const allRides: Ride[] = await allRidesRes.json();
        setRidesMap(Object.fromEntries(allRides.map((r) => [r.id, r])));
      }
    } finally {
      setLoading(false);
    }
  }, [walletAddress]);

  useEffect(() => {
    if (authenticated && walletAddress) fetchAll();
  }, [authenticated, walletAddress, fetchAll]);

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
        <h1 className="font-display text-4xl tracking-[0.15em]">Find a Lift</h1>
        <p className="text-[var(--color-cream)]/80 text-center max-w-sm">
          Sign in to request a lift or browse available rides.
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
      const res = await fetch("/api/trips", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, passengerWallet: walletAddress }),
      });
      if (res.ok) {
        const newTrip: Trip = await res.json();
        setTrips((prev) => [newTrip, ...prev]);
        setForm(EMPTY_FORM);
        setErrors({});
        setShowForm(false);
        setConfirmMessage("Journey request posted. Drivers on your route will be able to see it.");
      }
    } finally {
      setSubmitting(false);
    }
  }

  async function handleRemove(id: string) {
    await fetch(`/api/trips/${id}`, { method: "DELETE" });
    setTrips((prev) => prev.filter((t) => t.id !== id));
  }

  const displayName =
    user?.email?.address ??
    (walletAddress ? walletAddress.slice(0, 8) + "…" : "Passenger");

  // Split requests into responded and pending
  const acceptedRequests = myRequests.filter((r) => r.status === "accepted");
  const declinedRequests = myRequests.filter((r) => r.status === "declined");
  const pendingRequests  = myRequests.filter((r) => r.status === "pending");

  return (
    <main className="min-h-screen bg-[var(--background)] text-[var(--foreground)]">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10 flex flex-col gap-8">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="font-display text-4xl tracking-[0.15em]">Find a Lift</h1>
            <p className="mt-1 text-[var(--color-cream)]/70 text-sm">Signed in as {displayName}</p>
          </div>
          <div className="flex gap-3">
            <Link
              href="/feed"
              className="inline-flex justify-center rounded border border-[var(--color-cream)] text-[var(--color-cream)] font-semibold py-2 px-4 hover:bg-[var(--color-irish-green-dark)]/20"
            >
              Browse rides
            </Link>
            {!showForm && (
              <button
                onClick={() => setShowForm(true)}
                className="inline-flex justify-center rounded bg-[var(--color-cream)] text-[var(--color-irish-green)] font-semibold py-2 px-4"
              >
                + Request a lift
              </button>
            )}
          </div>
        </div>

        <EmailPromptBanner />

        {/* Driver responses */}
        {(acceptedRequests.length > 0 || declinedRequests.length > 0) && (
          <section className="flex flex-col gap-3">
            <h2 className="text-lg font-semibold text-[var(--color-cream)]">Driver responses</h2>
            {acceptedRequests.map((req) => {
              const ride = ridesMap[req.rideId];
              return (
                <div key={req.id} className="rounded border border-green-700/40 bg-green-900/20 px-4 py-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                  <div>
                    <p className="text-sm font-semibold text-green-300">Your seat request was accepted</p>
                    {ride && (
                      <p className="text-sm text-[var(--color-cream)]/70 mt-0.5">
                        {ride.from} → {ride.to} on {new Date(ride.date).toLocaleDateString("en-IE", {
                          weekday: "short", day: "numeric", month: "short",
                        })} at {ride.time}
                      </p>
                    )}
                  </div>
                  <span className="text-xs rounded px-2 py-0.5 bg-green-900/40 text-green-300 self-start sm:self-center">Accepted</span>
                </div>
              );
            })}
            {declinedRequests.map((req) => {
              const ride = ridesMap[req.rideId];
              return (
                <div key={req.id} className="rounded border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.02)] px-4 py-3 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                  <div>
                    <p className="text-sm text-[var(--color-cream)]/60">Your seat request was not accepted this time.</p>
                    {ride && (
                      <p className="text-sm text-[var(--color-cream)]/50 mt-0.5">
                        {ride.from} → {ride.to} on {new Date(ride.date).toLocaleDateString("en-IE", {
                          weekday: "short", day: "numeric", month: "short",
                        })} at {ride.time}
                      </p>
                    )}
                    <Link href="/feed" className="text-sm text-[var(--color-cream)]/70 underline mt-1 inline-block">Browse other rides</Link>
                  </div>
                  <span className="text-xs rounded px-2 py-0.5 bg-[rgba(255,255,255,0.06)] text-[var(--color-cream)]/50 self-start sm:self-center">Declined</span>
                </div>
              );
            })}
            {pendingRequests.length > 0 && (
              <p className="text-sm text-[var(--color-cream)]/50">
                {pendingRequests.length} request{pendingRequests.length !== 1 ? "s" : ""} still awaiting a driver response.
              </p>
            )}
          </section>
        )}

        {/* Confirmation */}
        {confirmMessage && (
          <div className="rounded border border-[rgba(255,255,255,0.14)] bg-[rgba(0,0,0,0.12)] px-4 py-3 text-[var(--color-cream)]/90">
            {confirmMessage}
          </div>
        )}

        {/* Request form */}
        {showForm && (
          <section className="rounded border border-[rgba(255,255,255,0.1)] bg-[rgba(255,255,255,0.03)] p-6">
            <h2 className="text-xl font-semibold text-[var(--color-cream)] mb-5">Request a lift</h2>
            <form onSubmit={handleSubmit} className="flex flex-col gap-4" noValidate>
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
              <div className="flex flex-col gap-1">
                <label className="text-sm text-[var(--color-cream)]/80">
                  Note <span className="text-[var(--color-cream)]/40">(optional)</span>
                </label>
                <textarea rows={2} placeholder="e.g. I have a buggy, need space in the boot"
                  value={form.note}
                  onChange={(e) => setForm((f) => ({ ...f, note: e.target.value }))}
                  className="rounded border border-[rgba(255,255,255,0.12)] bg-[rgba(255,255,255,0.05)] px-3 py-2 text-[var(--color-cream)] placeholder:text-[var(--color-cream)]/40 focus:outline-none focus:border-[var(--color-cream)]/50 resize-none" />
              </div>
              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <button type="submit" disabled={submitting}
                  className="inline-flex justify-center rounded bg-[var(--color-cream)] text-[var(--color-irish-green)] font-semibold py-2 px-5 disabled:opacity-60">
                  {submitting ? "Posting…" : "Post request"}
                </button>
                <button type="button" onClick={() => { setShowForm(false); setForm(EMPTY_FORM); setErrors({}); }}
                  className="inline-flex justify-center rounded border border-[rgba(255,255,255,0.14)] text-[var(--color-cream)]/80 py-2 px-5 hover:bg-[rgba(255,255,255,0.04)]">
                  Cancel
                </button>
              </div>
            </form>
          </section>
        )}

        {/* My requests */}
        <div>
          <h2 className="text-lg font-semibold text-[var(--color-cream)] mb-4">My lift requests</h2>
          {loading ? (
            <p className="text-[var(--color-cream)]/50 text-sm">Loading…</p>
          ) : trips.length === 0 && !showForm ? (
            <div className="rounded border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.02)] p-8 text-center">
              <p className="text-[var(--color-cream)]/60">You haven&rsquo;t posted any lift requests yet.</p>
              <button onClick={() => setShowForm(true)}
                className="mt-4 inline-flex justify-center rounded bg-[var(--color-cream)] text-[var(--color-irish-green)] font-semibold py-2 px-5">
                Post your first request
              </button>
            </div>
          ) : (
            <ul className="flex flex-col gap-4">
              {trips.map((trip) => (
                <li key={trip.id}
                  className="rounded border border-[rgba(255,255,255,0.1)] bg-[rgba(255,255,255,0.03)] p-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div className="flex flex-col gap-1">
                    <p className="font-semibold text-[var(--color-cream)] text-lg">{trip.from} → {trip.to}</p>
                    <p className="text-sm text-[var(--color-cream)]/70">
                      {new Date(trip.date).toLocaleDateString("en-IE", {
                        weekday: "short", day: "numeric", month: "short", year: "numeric",
                      })} at {trip.time}
                    </p>
                    {trip.note && <p className="text-sm text-[var(--color-cream)]/60 italic">{trip.note}</p>}
                  </div>
                  <button onClick={() => handleRemove(trip.id)}
                    className="self-start sm:self-center text-sm text-[var(--color-cream)]/50 hover:text-red-400 border border-[rgba(255,255,255,0.1)] rounded px-3 py-1">
                    Remove
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </main>
  );
}
