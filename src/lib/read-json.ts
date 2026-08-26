/**
 * Reads a JSON request body without throwing.
 *
 * `await request.json()` throws on anything that isn't valid JSON — a truncated
 * upload, a bot probing with garbage, a client that forgot the body entirely.
 * Unhandled, that becomes a 500: the server reporting its own fault for what is
 * really a bad request, and filling the logs with noise that hides real errors.
 *
 * Returns an empty object instead, so every route's own validation runs and
 * produces its proper 400 with a message the caller can act on.
 */
export async function readJson(request: Request): Promise<Record<string, unknown>> {
  try {
    const value = await request.json();
    // `null`, an array, or a bare string are all valid JSON but not a body
    // shape any route here understands.
    if (value && typeof value === "object" && !Array.isArray(value)) {
      return value as Record<string, unknown>;
    }
    return {};
  } catch {
    return {};
  }
}

/**
 * Narrows an unknown body field to one of a fixed set.
 *
 * `list.includes(value)` reads as a check but leaves the value `unknown` to the
 * compiler, so routes were passing unvalidated input straight into typed calls
 * right after "validating" it. This makes the narrowing real.
 */
export function isOneOf<const T extends readonly string[]>(
  value: unknown,
  allowed: T
): value is T[number] {
  return typeof value === "string" && (allowed as readonly string[]).includes(value);
}

/** A non-empty string, trimmed and capped. Returns null when it isn't one. */
export function asText(value: unknown, maxLength = 200): string | null {
  if (typeof value !== "string") return null;
  const trimmed = value.trim();
  return trimmed ? trimmed.slice(0, maxLength) : null;
}
