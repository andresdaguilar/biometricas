import { SignJWT, jwtVerify } from "jose";
import bcrypt from "bcryptjs";
import { cookies } from "next/headers";

export const SESSION_COOKIE = "session";
// 10 años: efectivamente "no expira" para un usuario que revisita la app a diario.
const SESSION_DURATION_SECONDS = 60 * 60 * 24 * 365 * 10;

/** Vercel/UI often paste .env.local literally: quotes and `\$` escapes. */
function readEnv(name: string): string | undefined {
  const raw = process.env[name];
  if (raw === undefined) return undefined;
  let value = raw.trim();
  if (
    (value.startsWith('"') && value.endsWith('"')) ||
    (value.startsWith("'") && value.endsWith("'"))
  ) {
    value = value.slice(1, -1);
  }
  return value.replaceAll("\\$", "$");
}

function getSecret() {
  const secret = readEnv("AUTH_SECRET");
  if (!secret) throw new Error("AUTH_SECRET no está definida");
  return new TextEncoder().encode(secret);
}

export async function verifyCredentials(username: string, password: string) {
  const expectedUser = readEnv("AUTH_USERNAME");
  const expectedHash = readEnv("AUTH_PASSWORD_HASH");
  if (!expectedUser || !expectedHash) {
    throw new Error("AUTH_USERNAME o AUTH_PASSWORD_HASH no están definidas");
  }
  if (username.trim() !== expectedUser) return false;
  return bcrypt.compare(password, expectedHash);
}

export async function createSessionToken(username: string) {
  return new SignJWT({ sub: username })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(`${SESSION_DURATION_SECONDS}s`)
    .sign(getSecret());
}

export async function setSessionCookie(username: string) {
  const token = await createSessionToken(username);
  const store = await cookies();
  store.set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: SESSION_DURATION_SECONDS,
  });
}

export async function clearSessionCookie() {
  const store = await cookies();
  store.delete(SESSION_COOKIE);
}

export async function verifySessionToken(token: string) {
  try {
    const { payload } = await jwtVerify(token, getSecret());
    return payload;
  } catch {
    return null;
  }
}

export async function getSession() {
  const store = await cookies();
  const token = store.get(SESSION_COOKIE)?.value;
  if (!token) return null;
  return verifySessionToken(token);
}
