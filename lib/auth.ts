import "server-only";
import crypto from "crypto";

export const SESSION_COOKIE = "roa_session";

function secret(): string {
  // En producción define ADMIN_SECRET (una cadena larga y aleatoria).
  return (
    process.env.ADMIN_SECRET ||
    process.env.ADMIN_PASSWORD ||
    "roa-dev-secret-cambiar-en-produccion"
  );
}

/** Genera un token de sesión firmado (HMAC) con expiración. */
export function createSessionToken(ttlHours = 8): string {
  const exp = Date.now() + ttlHours * 3600 * 1000;
  const payload = String(exp);
  const sig = crypto.createHmac("sha256", secret()).update(payload).digest("base64url");
  return `${payload}.${sig}`;
}

/** Verifica firma y expiración del token. No se puede falsificar sin el secreto. */
export function verifySessionToken(token?: string): boolean {
  if (!token) return false;
  const parts = token.split(".");
  if (parts.length !== 2) return false;
  const [payload, sig] = parts;
  const expected = crypto.createHmac("sha256", secret()).update(payload).digest("base64url");
  const a = Buffer.from(sig);
  const b = Buffer.from(expected);
  if (a.length !== b.length) return false;
  if (!crypto.timingSafeEqual(a, b)) return false;
  const exp = Number(payload);
  return Number.isFinite(exp) && Date.now() < exp;
}

/** Compara la contraseña en tiempo constante (evita ataques de temporización). */
export function verifyPassword(input: string): boolean {
  const expected = process.env.ADMIN_PASSWORD || "";
  if (!expected) return false;
  const a = Buffer.from(input);
  const b = Buffer.from(expected);
  if (a.length !== b.length) return false;
  return crypto.timingSafeEqual(a, b);
}
