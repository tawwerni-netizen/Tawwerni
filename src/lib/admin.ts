import { createHash, timingSafeEqual } from "crypto";
import { cookies } from "next/headers";

const ADMIN_COOKIE = "tawwerni_admin";

function tokenFor(password: string) {
  return createHash("sha256").update(`tawwerni-admin::${password}`).digest("hex");
}

export function verifyAdminPassword(input: string) {
  const expected = process.env.ADMIN_PASSWORD;
  if (!expected) return false;
  const a = Buffer.from(tokenFor(input));
  const b = Buffer.from(tokenFor(expected));
  return a.length === b.length && timingSafeEqual(a, b);
}

export async function setAdminCookie() {
  const expected = process.env.ADMIN_PASSWORD;
  if (!expected) throw new Error("ADMIN_PASSWORD is not set");
  const cookieStore = await cookies();
  cookieStore.set(ADMIN_COOKIE, tokenFor(expected), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 12 * 60 * 60,
  });
}

export async function isAdmin() {
  const expected = process.env.ADMIN_PASSWORD;
  if (!expected) return false;
  const cookieStore = await cookies();
  const token = cookieStore.get(ADMIN_COOKIE)?.value;
  if (!token) return false;
  const a = Buffer.from(token);
  const b = Buffer.from(tokenFor(expected));
  return a.length === b.length && timingSafeEqual(a, b);
}

export async function clearAdminCookie() {
  const cookieStore = await cookies();
  cookieStore.delete(ADMIN_COOKIE);
}
