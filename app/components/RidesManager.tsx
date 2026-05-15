"use client";

import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import { usePrivy } from "@privy-io/react-auth";
import type { Ride } from "@/app/db/schema";

const EMPTY_FORM = {
  from: "",
  to: "",
  date: "",
  time: "",
  seats: 1,
  note: "",
};

type RideForm = typeof EMPTY_FORM;

async function parseError(response: Response) {
  try {
    const payload = (await response.json()) as { error?: string };
    return payload.error ?? "Something went wrong.";
  } catch {
    return "Something went wrong.";
  }
}

export default function RidesManager() {
  const { ready, authenticated, login, user, getAccessToken } = usePrivy();
  const [rides, setRides] = useState<Ride[] | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState<RideForm>(EMPTY_FORM);
  const [errors, setErrors] = useState<Partial<RideForm>>({});
  const [submitting, setSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);

  const displayName = user?.email?.address ?? user?.wallet?.address ?? "Driver";

  const getAuthorizationHeader = useCallback(async () => {
    const accessToken = await getAccessToken();

    if (!accessToken) {
      throw new Error("Sign in again to manage rides.");
    }

    return { Authorization: `Bearer ${accessToken}` };
  }, [getAccessToken]);

  const fetchRides = useCallback(async () => {
    try {
      setFeedback(null);
      const headers = await getAuthorizationHeader();
      const response = await fetch("/api/rides", { headers });

      if (!response.ok) {
        setFeedback(await parseError(response));
        setRides([]);
        return;
      }

      setRides((await response.json()) as Ride[]);
    } catch (error) {
      setFeedback(
        error instanceof Error ? error.message : "Unable to load your rides.",
      );
      setRides([]);
    }
  }, [getAuthorizationHeader]);

  useEffect(() => {
    if (!authenticated) return;
    void fetchRides();
  }, [authenticated, fetchRides]);

  function validate() {
    const nextErrors: Partial<RideForm> = {};

    if (!form.from.trim()) nextErrors.from = "Required";
    if (!form.to.trim()) nextErrors.to = "Required";
    if (!form.date) nextErrors.date = "Required";
    if (!form.time) nextErrors.time = "Required";

    return nextErrors;
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const nextErrors = validate();
    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors);
      return;
    }

    setSubmitting(true);
    setFeedback(null);

    try {
      const headers = await getAuthorizationHeader();
      const response = await fetch("/api/rides", {
        method: "POST",
        headers: {
          ...headers,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      if (!response.ok) {
        setFeedback(await parseError(response));
        return;
      }

      const newRide = (await response.json()) as Ride;
      setRides((previous) => [...(previous ?? []), newRide]);
      setForm(EMPTY_FORM);
      setErrors({});
      setShowForm(false);
    } catch (error) {
      setFeedback(
        error instanceof Error ? error.message : "Unable to save your ride.",
      );
    } finally {
      setSubmitting(false);
    }
  }

  async function handleRemove(id: string) {
    try {
      setFeedback(null);
      const headers = await getAuthorizationHeader();
      const response = await fetch(`/api/rides/${id}`, {
        method: "DELETE",
        headers,
      });

      if (!response.ok) {
        setFeedback(await parseError(response));
        return;
      }

      setRides((previous) => (previous ?? []).filter((ride) => ride.id !== id));
    } catch (error) {
      setFeedback(
        error instanceof Error ? error.message : "Unable to remove your ride.",
      );
    }
  }

  if (!ready) {
    return <p className="text-[var(--color-cream)]/70">Loading…</p>;
  }

  if (!authenticated) {
    return (
      <div className="flex flex-col items-center justify-center gap-6 px-4 py-12 text-center">
        <h1 className="font-display text-4xl tracking-[0.15em]">
          Manage Rides
        </h1>
        <p className="max-w-sm text-[var(--color-cream)]/80">
          Sign in as a driver to view and offer rides.
        </p>
        <button
          type="button"
          onClick={() => login()}
          className="inline-flex justify-center rounded bg-[var(--color-cream)] px-6 py-3 font-semibold text-[var(--color-irish-green)]"
        >
          Sign in
        </button>
        <Link
          href="/"
          className="text-sm text-[var(--color-cream)]/60 underline"
        >
          Back to home
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-8 py-10">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="font-display text-4xl tracking-[0.15em]">
            Manage Rides
          </h1>
          <p className="mt-1 text-sm text-[var(--color-cream)]/70">
            Signed in as {displayName}
          </p>
        </div>

        {!showForm ? (
          <button
            type="button"
            onClick={() => setShowForm(true)}
            className="inline-flex justify-center rounded bg-[var(--color-cream)] px-5 py-2 font-semibold text-[var(--color-irish-green)]"
          >
            + Offer a ride
          </button>
        ) : null}
      </div>

      {feedback ? (
        <div className="rounded border border-amber-200/20 bg-amber-100/10 p-4 text-sm text-[var(--color-cream)]">
          {feedback}
        </div>
      ) : null}

      {showForm ? (
        <section className="rounded border border-[rgba(255,255,255,0.1)] bg-[rgba(255,255,255,0.03)] p-6">
          <h2 className="mb-5 text-xl font-semibold text-[var(--color-cream)]">
            New ride
          </h2>
          <form
            onSubmit={handleSubmit}
            className="flex flex-col gap-4"
            noValidate
          >
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="flex flex-col gap-1">
                <label
                  htmlFor="ride-from"
                  className="text-sm text-[var(--color-cream)]/80"
                >
                  From
                </label>
                <input
                  id="ride-from"
                  type="text"
                  placeholder="e.g. Clifden"
                  value={form.from}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      from: event.target.value,
                    }))
                  }
                  className="rounded border border-[rgba(255,255,255,0.12)] bg-[rgba(255,255,255,0.05)] px-3 py-2 text-[var(--color-cream)] placeholder:text-[var(--color-cream)]/40 focus:border-[var(--color-cream)]/50 focus:outline-none"
                />
                {errors.from ? (
                  <p className="text-xs text-red-400">{errors.from}</p>
                ) : null}
              </div>

              <div className="flex flex-col gap-1">
                <label
                  htmlFor="ride-to"
                  className="text-sm text-[var(--color-cream)]/80"
                >
                  To
                </label>
                <input
                  id="ride-to"
                  type="text"
                  placeholder="e.g. Galway"
                  value={form.to}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      to: event.target.value,
                    }))
                  }
                  className="rounded border border-[rgba(255,255,255,0.12)] bg-[rgba(255,255,255,0.05)] px-3 py-2 text-[var(--color-cream)] placeholder:text-[var(--color-cream)]/40 focus:border-[var(--color-cream)]/50 focus:outline-none"
                />
                {errors.to ? (
                  <p className="text-xs text-red-400">{errors.to}</p>
                ) : null}
              </div>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="flex flex-col gap-1">
                <label
                  htmlFor="ride-date"
                  className="text-sm text-[var(--color-cream)]/80"
                >
                  Date
                </label>
                <input
                  id="ride-date"
                  type="date"
                  value={form.date}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      date: event.target.value,
                    }))
                  }
                  className="rounded border border-[rgba(255,255,255,0.12)] bg-[rgba(255,255,255,0.05)] px-3 py-2 text-[var(--color-cream)] focus:border-[var(--color-cream)]/50 focus:outline-none"
                />
                {errors.date ? (
                  <p className="text-xs text-red-400">{errors.date}</p>
                ) : null}
              </div>

              <div className="flex flex-col gap-1">
                <label
                  htmlFor="ride-time"
                  className="text-sm text-[var(--color-cream)]/80"
                >
                  Time
                </label>
                <input
                  id="ride-time"
                  type="time"
                  value={form.time}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      time: event.target.value,
                    }))
                  }
                  className="rounded border border-[rgba(255,255,255,0.12)] bg-[rgba(255,255,255,0.05)] px-3 py-2 text-[var(--color-cream)] focus:border-[var(--color-cream)]/50 focus:outline-none"
                />
                {errors.time ? (
                  <p className="text-xs text-red-400">{errors.time}</p>
                ) : null}
              </div>
            </div>

            <div className="max-w-[160px]">
              <label
                htmlFor="ride-seats"
                className="flex flex-col gap-1 text-sm text-[var(--color-cream)]/80"
              >
                <span>Seats available</span>
                <input
                  id="ride-seats"
                  type="number"
                  min={1}
                  max={8}
                  value={form.seats}
                  onChange={(event) =>
                    setForm((current) => ({
                      ...current,
                      seats: Number(event.target.value),
                    }))
                  }
                  className="rounded border border-[rgba(255,255,255,0.12)] bg-[rgba(255,255,255,0.05)] px-3 py-2 text-[var(--color-cream)] focus:border-[var(--color-cream)]/50 focus:outline-none"
                />
              </label>
            </div>

            <div className="flex flex-col gap-1">
              <label
                htmlFor="ride-note"
                className="text-sm text-[var(--color-cream)]/80"
              >
                Note{" "}
                <span className="text-[var(--color-cream)]/40">(optional)</span>
              </label>
              <textarea
                id="ride-note"
                rows={2}
                placeholder="e.g. Leaving at 8am sharp, can drop at bus station"
                value={form.note}
                onChange={(event) =>
                  setForm((current) => ({
                    ...current,
                    note: event.target.value,
                  }))
                }
                className="resize-none rounded border border-[rgba(255,255,255,0.12)] bg-[rgba(255,255,255,0.05)] px-3 py-2 text-[var(--color-cream)] placeholder:text-[var(--color-cream)]/40 focus:border-[var(--color-cream)]/50 focus:outline-none"
              />
            </div>

            <div className="flex flex-col gap-3 pt-2 sm:flex-row">
              <button
                type="submit"
                disabled={submitting}
                className="inline-flex justify-center rounded bg-[var(--color-cream)] px-5 py-2 font-semibold text-[var(--color-irish-green)] disabled:opacity-60"
              >
                {submitting ? "Saving…" : "Add ride"}
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowForm(false);
                  setForm(EMPTY_FORM);
                  setErrors({});
                  setFeedback(null);
                }}
                className="inline-flex justify-center rounded border border-[rgba(255,255,255,0.14)] px-5 py-2 text-[var(--color-cream)]/80 hover:bg-[rgba(255,255,255,0.04)]"
              >
                Cancel
              </button>
            </div>
          </form>
        </section>
      ) : null}

      {rides === null ? (
        <p className="text-sm text-[var(--color-cream)]/50">Loading rides…</p>
      ) : rides.length === 0 && !showForm ? (
        <div className="rounded border border-[rgba(255,255,255,0.08)] bg-[rgba(255,255,255,0.02)] p-8 text-center">
          <p className="text-[var(--color-cream)]/60">
            You haven&rsquo;t offered any rides yet.
          </p>
          <button
            type="button"
            onClick={() => setShowForm(true)}
            className="mt-4 inline-flex justify-center rounded bg-[var(--color-cream)] px-5 py-2 font-semibold text-[var(--color-irish-green)]"
          >
            Offer your first ride
          </button>
        </div>
      ) : (
        <ul className="flex flex-col gap-4">
          {rides.map((ride) => (
            <li
              key={ride.id}
              className="flex flex-col gap-4 rounded border border-[rgba(255,255,255,0.1)] bg-[rgba(255,255,255,0.03)] p-5 sm:flex-row sm:items-center sm:justify-between"
            >
              <div className="flex flex-col gap-1">
                <p className="text-lg font-semibold text-[var(--color-cream)]">
                  {ride.from} → {ride.to}
                </p>
                <p className="text-sm text-[var(--color-cream)]/70">
                  {new Date(ride.date).toLocaleDateString("en-IE", {
                    weekday: "short",
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })}{" "}
                  at {ride.time}
                </p>
                <p className="text-sm text-[var(--color-cream)]/70">
                  {ride.seats} seat{ride.seats !== 1 ? "s" : ""} available
                </p>
                {ride.note ? (
                  <p className="text-sm italic text-[var(--color-cream)]/60">
                    {ride.note}
                  </p>
                ) : null}
              </div>
              <button
                type="button"
                onClick={() => void handleRemove(ride.id)}
                className="self-start rounded border border-[rgba(255,255,255,0.1)] px-3 py-1 text-sm text-[var(--color-cream)]/50 hover:text-red-400 sm:self-center"
              >
                Remove
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
