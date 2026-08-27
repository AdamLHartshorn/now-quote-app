export type SessionRole = "staff" | "admin";

const SESSION_SECONDS = 60 * 60 * 24 * 90;
const encoder = new TextEncoder();

function toBase64Url(bytes: Uint8Array) {
  let binary = "";
  for (const byte of bytes) binary += String.fromCharCode(byte);
  return btoa(binary).replaceAll("+", "-").replaceAll("/", "_").replace(/=+$/, "");
}

function fromBase64Url(value: string) {
  const padded = value.replaceAll("-", "+").replaceAll("_", "/").padEnd(Math.ceil(value.length / 4) * 4, "=");
  const binary = atob(padded);
  return Uint8Array.from(binary, (character) => character.charCodeAt(0));
}

async function signingKey(secret: string, usage: KeyUsage[]) {
  return crypto.subtle.importKey(
    "raw",
    encoder.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    usage
  );
}

export async function createSessionToken(role: SessionRole) {
  const secret = process.env.AUTH_SECRET;
  if (!secret) throw new Error("AUTH_SECRET is not configured");

  const payload = toBase64Url(encoder.encode(JSON.stringify({ role, expiresAt: Date.now() + SESSION_SECONDS * 1000 })));
  const signature = await crypto.subtle.sign("HMAC", await signingKey(secret, ["sign"]), encoder.encode(payload));
  return `${payload}.${toBase64Url(new Uint8Array(signature))}`;
}

export async function verifySessionToken(token?: string): Promise<SessionRole | null> {
  const secret = process.env.AUTH_SECRET;
  if (!secret || !token) return null;

  const [payload, signature, extra] = token.split(".");
  if (!payload || !signature || extra) return null;

  try {
    const valid = await crypto.subtle.verify(
      "HMAC",
      await signingKey(secret, ["verify"]),
      fromBase64Url(signature),
      encoder.encode(payload)
    );
    if (!valid) return null;

    const session = JSON.parse(new TextDecoder().decode(fromBase64Url(payload))) as {
      role?: string;
      expiresAt?: number;
    };
    if ((session.role !== "staff" && session.role !== "admin") || !session.expiresAt || session.expiresAt <= Date.now()) {
      return null;
    }
    return session.role;
  } catch {
    return null;
  }
}

export const sessionMaxAge = SESSION_SECONDS;
