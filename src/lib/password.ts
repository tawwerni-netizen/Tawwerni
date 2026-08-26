import { randomBytes, scrypt as scryptCb, timingSafeEqual } from "crypto";
import { promisify } from "util";

const scrypt = promisify(scryptCb) as (
  password: string,
  salt: Buffer,
  keylen: number
) => Promise<Buffer>;

/**
 * Password hashing.
 *
 * Uses scrypt from Node's own crypto — a real key-derivation function, no
 * dependency to keep patched. Passwords are hashed one-way with a per-user
 * salt: the stored value cannot be turned back into the password, not by us
 * and not by anyone who steals the database.
 *
 * Stored format:  scrypt$<saltHex>$<hashHex>
 */

const KEY_LENGTH = 64;

export async function hashPassword(password: string): Promise<string> {
  const salt = randomBytes(16);
  const derived = await scrypt(password, salt, KEY_LENGTH);
  return `scrypt$${salt.toString("hex")}$${derived.toString("hex")}`;
}

export async function verifyPassword(password: string, stored: string): Promise<boolean> {
  const parts = stored.split("$");
  if (parts.length !== 3 || parts[0] !== "scrypt") return false;

  const salt = Buffer.from(parts[1], "hex");
  const expected = Buffer.from(parts[2], "hex");
  if (salt.length === 0 || expected.length !== KEY_LENGTH) return false;

  const derived = await scrypt(password, salt, KEY_LENGTH);
  // Constant-time compare so response timing can't leak how much matched.
  return timingSafeEqual(derived, expected);
}

/** Rules kept deliberately light — length is what actually matters. */
/**
 * Takes `unknown` on purpose.
 *
 * Every caller receives this straight off a request body, where it could be a
 * number, an object, or missing entirely. Typing it as `string` meant the
 * check was doing runtime narrowing the compiler couldn't see, and callers
 * were free to pass unvalidated input into `hashPassword` right after.
 * Narrowing here makes the type system enforce what the code already assumed.
 */
export function passwordProblem(password: unknown): string | null {
  if (typeof password !== "string" || password.length < 8) {
    return "الباسورد لازم يكون ٨ حروف على الأقل";
  }
  if (password.length > 200) {
    return "الباسورد طويل أوي";
  }
  return null;
}

/** True once `passwordProblem` has cleared it — narrows for the compiler. */
export function isValidPassword(password: unknown): password is string {
  return passwordProblem(password) === null;
}

/** Readable temporary password for an operator-triggered reset. */
export function generateTempPassword(): string {
  const alphabet = "abcdefghjkmnpqrstuvwxyz23456789";
  const bytes = randomBytes(10);
  let out = "";
  for (let i = 0; i < 10; i++) out += alphabet[bytes[i] % alphabet.length];
  return out;
}
