import { describe, expect, it } from "vitest";
import { generateKeyPairSync, sign } from "node:crypto";
import { verifyPrivyAccessToken } from "./privy-auth";

function encodeBase64Url(value: string | Buffer) {
  return Buffer.from(value).toString("base64url");
}

function createToken(payload: Record<string, unknown>, privateKey: string) {
  const header = { alg: "ES256", typ: "JWT" };
  const encodedHeader = encodeBase64Url(JSON.stringify(header));
  const encodedPayload = encodeBase64Url(JSON.stringify(payload));
  const signingInput = `${encodedHeader}.${encodedPayload}`;
  const signature = sign("sha256", Buffer.from(signingInput), {
    key: privateKey,
    dsaEncoding: "ieee-p1363",
  });

  return `${signingInput}.${encodeBase64Url(signature)}`;
}

describe("verifyPrivyAccessToken", () => {
  it("returns the Privy subject for a valid access token", () => {
    const { privateKey, publicKey } = generateKeyPairSync("ec", {
      namedCurve: "prime256v1",
      publicKeyEncoding: { type: "spki", format: "pem" },
      privateKeyEncoding: { type: "pkcs8", format: "pem" },
    });

    process.env.NEXT_PUBLIC_PRIVY_APP_ID = "app-id";
    process.env.PRIVY_VERIFICATION_KEY = publicKey;

    const token = createToken(
      {
        sub: "did:privy:test-user",
        aud: "app-id",
        iss: "privy.io",
        exp: Math.floor(Date.now() / 1000) + 60,
      },
      privateKey,
    );

    expect(verifyPrivyAccessToken(token)).toBe("did:privy:test-user");
  });

  it("rejects expired access tokens", () => {
    const { privateKey, publicKey } = generateKeyPairSync("ec", {
      namedCurve: "prime256v1",
      publicKeyEncoding: { type: "spki", format: "pem" },
      privateKeyEncoding: { type: "pkcs8", format: "pem" },
    });

    process.env.NEXT_PUBLIC_PRIVY_APP_ID = "app-id";
    process.env.PRIVY_VERIFICATION_KEY = publicKey;

    const token = createToken(
      {
        sub: "did:privy:test-user",
        aud: "app-id",
        iss: "privy.io",
        exp: Math.floor(Date.now() / 1000) - 60,
      },
      privateKey,
    );

    expect(() => verifyPrivyAccessToken(token)).toThrow(/expired/i);
  });
});
