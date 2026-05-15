import { createPublicKey, verify } from "node:crypto";
import { NextRequest } from "next/server";

type JwtHeader = {
  alg?: string;
  typ?: string;
};

type JwtPayload = {
  sub?: string;
  aud?: string | string[];
  iss?: string;
  exp?: number;
  nbf?: number;
};

export class PrivyAuthError extends Error {
  constructor(
    message: string,
    readonly status: number = 401,
  ) {
    super(message);
    this.name = "PrivyAuthError";
  }
}

function decodeJwtPart<T>(value: string): T {
  try {
    return JSON.parse(Buffer.from(value, "base64url").toString("utf8")) as T;
  } catch {
    throw new PrivyAuthError("invalid token payload");
  }
}

function getBearerToken(request: NextRequest) {
  const authorization = request.headers.get("authorization");

  if (!authorization?.startsWith("Bearer ")) {
    throw new PrivyAuthError("missing bearer token");
  }

  return authorization.slice("Bearer ".length).trim();
}

function validatePayload(payload: JwtPayload, appId: string) {
  if (!payload.sub) {
    throw new PrivyAuthError("missing subject");
  }

  if (payload.iss !== "privy.io") {
    throw new PrivyAuthError("invalid issuer");
  }

  const audiences = Array.isArray(payload.aud) ? payload.aud : [payload.aud];
  if (!audiences.includes(appId)) {
    throw new PrivyAuthError("invalid audience");
  }

  const now = Math.floor(Date.now() / 1000);

  if (typeof payload.nbf === "number" && payload.nbf > now) {
    throw new PrivyAuthError("token not active yet");
  }

  if (typeof payload.exp !== "number" || payload.exp <= now) {
    throw new PrivyAuthError("token expired");
  }

  return payload.sub;
}

export function verifyPrivyAccessToken(accessToken: string) {
  const verificationKey = process.env.PRIVY_VERIFICATION_KEY;
  const appId = process.env.NEXT_PUBLIC_PRIVY_APP_ID;

  if (!verificationKey || !appId) {
    throw new PrivyAuthError("privy auth is not configured", 503);
  }

  const parts = accessToken.split(".");
  if (parts.length !== 3) {
    throw new PrivyAuthError("invalid token format");
  }

  try {
    const [encodedHeader, encodedPayload, encodedSignature] = parts;
    const header = decodeJwtPart<JwtHeader>(encodedHeader);

    if (header.alg !== "ES256") {
      throw new PrivyAuthError("unsupported token algorithm");
    }

    const signingInput = `${encodedHeader}.${encodedPayload}`;
    const signature = Buffer.from(encodedSignature, "base64url");
    const publicKey = createPublicKey(verificationKey);

    const isValid = verify(
      "sha256",
      Buffer.from(signingInput),
      { key: publicKey, dsaEncoding: "ieee-p1363" },
      signature,
    );

    if (!isValid) {
      throw new PrivyAuthError("invalid signature");
    }

    const payload = decodeJwtPart<JwtPayload>(encodedPayload);
    return validatePayload(payload, appId);
  } catch (error) {
    if (error instanceof PrivyAuthError) {
      throw error;
    }

    throw new PrivyAuthError("invalid access token");
  }
}

export function requirePrivyUserId(request: NextRequest) {
  return verifyPrivyAccessToken(getBearerToken(request));
}
