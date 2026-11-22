import crypto from "crypto";
import { cookies } from "next/headers";
import { readDatabase, toSafeUser } from "./db";
import {
  ALL_SCOPES,
  type ContentScope,
  type PortalUser,
  type SafePortalUser,
} from "./types";

export const SESSION_COOKIE_NAME = "ingeula_session";
const SESSION_MAX_AGE_SECONDS = 60 * 60 * 24 * 7; // 7 days

function getSessionSecret(): string {
  return (
    process.env.INGEULA_SESSION_SECRET ||
    "ingeula-dev-secret-change-in-production-fi-ula-2026"
  );
}

interface SessionPayload {
  userId: string;
  exp: number;
}

function signPayload(encodedPayload: string): string {
  return crypto
    .createHmac("sha256", getSessionSecret())
    .update(encodedPayload)
    .digest("base64url");
}

export function createSessionToken(userId: string): string {
  const payload: SessionPayload = {
    userId,
    exp: Math.floor(Date.now() / 1000) + SESSION_MAX_AGE_SECONDS,
  };
  const encoded = Buffer.from(JSON.stringify(payload), "utf-8").toString(
    "base64url"
  );
  const signature = signPayload(encoded);
  return `${encoded}.${signature}`;
}

export function verifySessionToken(token: string): SessionPayload | null {
  const parts = token.split(".");
  if (parts.length !== 2) return null;

  const [encoded, signature] = parts;
  const expectedSig = signPayload(encoded);

  const sigBuf = Buffer.from(signature);
  const expBuf = Buffer.from(expectedSig);
  if (sigBuf.length !== expBuf.length) return null;
  if (!crypto.timingSafeEqual(sigBuf, expBuf)) return null;

  try {
    const payload = JSON.parse(
      Buffer.from(encoded, "base64url").toString("utf-8")
    ) as SessionPayload;
    if (!payload.userId || typeof payload.exp !== "number") return null;
    if (payload.exp < Math.floor(Date.now() / 1000)) return null;
    return payload;
  } catch {
    return null;
  }
}

export async function getCurrentUser(): Promise<SafePortalUser | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;
  if (!token) return null;

  const payload = verifySessionToken(token);
  if (!payload) return null;

  const db = readDatabase();
  const user = db.users.find((u) => u.id === payload.userId && u.active);
  if (!user) return null;

  return toSafeUser(user);
}

export function canManageUsers(user: SafePortalUser | PortalUser): boolean {
  return user.role === "super_admin";
}

export function getAllowedScopes(
  user: SafePortalUser | PortalUser
): ContentScope[] {
  if (user.role === "super_admin") {
    return [...ALL_SCOPES];
  }
  return user.assignedScopes;
}

export function canManageScope(
  user: SafePortalUser | PortalUser,
  scope: ContentScope
): boolean {
  if (user.role === "super_admin") return true;
  return user.assignedScopes.includes(scope);
}

export function getSessionCookieOptions() {
  return {
    httpOnly: true,
    sameSite: "lax" as const,
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: SESSION_MAX_AGE_SECONDS,
  };
}
