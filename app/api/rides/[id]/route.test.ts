import { beforeEach, describe, expect, it, vi } from "vitest";
import { NextRequest } from "next/server";
import { DELETE } from "@/app/api/rides/[id]/route";

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

const deleteWhere = vi.fn();
const deleteFn = vi.fn();

vi.mock("@/app/db", () => ({
  getDb: () => ({
    delete: deleteFn,
  }),
}));

describe("/api/rides/[id] route auth", () => {
  beforeEach(() => {
    deleteWhere.mockReset();
    deleteFn.mockReset();
    vi.mocked(requirePrivyUserIdMock).mockReset();

    vi.mocked(requirePrivyUserIdMock).mockImplementation(() => {
      throw new PrivyAuthErrorMock("unauthorized");
    });

    deleteWhere.mockResolvedValue(undefined);
    deleteFn.mockReturnValue({ where: deleteWhere });
  });

  it("rejects unauthenticated ride deletion", async () => {
    const request = new NextRequest("http://localhost:3000/api/rides/ride-1", {
      method: "DELETE",
    });

    const response = await DELETE(request, {
      params: Promise.resolve({ id: "ride-1" }),
    });

    expect(response.status).toBe(401);
    expect(deleteFn).not.toHaveBeenCalled();
  });

  it("deletes rides for the verified Privy user only", async () => {
    vi.mocked(requirePrivyUserIdMock).mockReturnValue("did:privy:test-user");

    const request = new NextRequest("http://localhost:3000/api/rides/ride-1", {
      method: "DELETE",
      headers: {
        Authorization: "Bearer test-token",
      },
    });

    const response = await DELETE(request, {
      params: Promise.resolve({ id: "ride-1" }),
    });

    expect(response.status).toBe(200);
    expect(deleteFn).toHaveBeenCalled();
  });
});

const { requirePrivyUserId: requirePrivyUserIdMock } =
  await import("@/app/lib/privy-auth");
const { PrivyAuthError: PrivyAuthErrorMock } =
  await import("@/app/lib/privy-auth");
