import { beforeEach, describe, expect, it, vi } from "vitest";
import { NextRequest } from "next/server";
import { GET, POST } from "@/app/api/rides/route";

vi.mock("@/app/lib/privy-auth", () => ({
  PrivyAuthError: class PrivyAuthError extends Error {
    constructor(
      message: string,
      readonly status: 401 | 503 = 401,
    ) {
      super(message);
    }
  },
  requirePrivyUserId: vi.fn(),
}));

const orderBy = vi.fn();
const where = vi.fn();
const from = vi.fn();
const select = vi.fn();
const returning = vi.fn();
const values = vi.fn();
const insert = vi.fn();

vi.mock("@/app/db", () => ({
  getDb: () => ({
    select,
    insert,
  }),
}));

describe("/api/rides route auth", () => {
  beforeEach(() => {
    orderBy.mockReset();
    where.mockReset();
    from.mockReset();
    select.mockReset();
    returning.mockReset();
    values.mockReset();
    insert.mockReset();

    orderBy.mockResolvedValue([]);
    where.mockReturnValue({ orderBy });
    from.mockReturnValue({ where });
    select.mockReturnValue({ from });

    returning.mockResolvedValue([
      {
        id: "ride-1",
        driverWallet: "did:privy:test-user",
        from: "Clifden",
        to: "Galway",
        date: "2026-05-20",
        time: "09:00",
        seats: 3,
        note: "Morning run",
      },
    ]);
    values.mockReturnValue({ returning });
    insert.mockReturnValue({ values });

    vi.mocked(requirePrivyUserIdMock).mockReset();
    vi.mocked(requirePrivyUserIdMock).mockImplementation(() => {
      throw new PrivyAuthErrorMock("unauthorized");
    });
  });

  it("rejects unauthenticated ride reads", async () => {
    const request = new NextRequest(
      "http://localhost:3000/api/rides?wallet=fake-wallet",
    );

    const response = await GET(request);

    expect(response.status).toBe(401);
    expect(select).not.toHaveBeenCalled();
  });

  it("rejects unauthenticated ride creation", async () => {
    const request = new NextRequest("http://localhost:3000/api/rides", {
      method: "POST",
      body: JSON.stringify({
        driverWallet: "fake-wallet",
        from: "Clifden",
        to: "Galway",
        date: "2026-05-20",
        time: "09:00",
        seats: 3,
        note: "Morning run",
      }),
      headers: {
        "Content-Type": "application/json",
      },
    });

    const response = await POST(request);

    expect(response.status).toBe(401);
    expect(insert).not.toHaveBeenCalled();
  });

  it("creates a ride for the verified Privy user", async () => {
    vi.mocked(requirePrivyUserIdMock).mockReturnValue("did:privy:test-user");

    const request = new NextRequest("http://localhost:3000/api/rides", {
      method: "POST",
      body: JSON.stringify({
        from: "Clifden",
        to: "Galway",
        date: "2026-05-20",
        time: "09:00",
        seats: 3,
        note: "Morning run",
      }),
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer test-token",
      },
    });

    const response = await POST(request);

    expect(response.status).toBe(201);
    expect(values).toHaveBeenCalledWith(
      expect.objectContaining({ driverWallet: "did:privy:test-user" }),
    );
  });
});

const { requirePrivyUserId: requirePrivyUserIdMock } =
  await import("@/app/lib/privy-auth");
const { PrivyAuthError: PrivyAuthErrorMock } =
  await import("@/app/lib/privy-auth");
