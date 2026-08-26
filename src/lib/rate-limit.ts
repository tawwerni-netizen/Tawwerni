/**
 * In-memory rate limiting.
 *
 * The app runs as a single Node process on shared hosting, so a Map is the
 * right tool — a Redis dependency here would add an outage mode without adding
 * protection. If this ever runs on more than one instance the limits become
 * per-instance, which is a weaker guarantee but never a wrong one.
 *
 * Keys are scoped by caller ("orders:1.2.3.4"), and the whole table is swept
 * periodically so a flood of unique keys can't grow it without bound.
 */

type Bucket = { count: number; resetAt: number };

const buckets = new Map<string, Bucket>();
let lastSweep = Date.now();

/** Drop expired buckets. Runs at most once a minute, on the request path. */
function sweep(now: number) {
  if (now - lastSweep < 60_000) return;
  lastSweep = now;
  for (const [key, b] of buckets) {
    if (b.resetAt <= now) buckets.delete(key);
  }
}

export type RateVerdict = { ok: true } | { ok: false; retryAfterSeconds: number };

export function rateLimit(key: string, limit: number, windowSeconds: number): RateVerdict {
  const now = Date.now();
  sweep(now);

  const existing = buckets.get(key);

  if (!existing || existing.resetAt <= now) {
    buckets.set(key, { count: 1, resetAt: now + windowSeconds * 1000 });
    return { ok: true };
  }

  if (existing.count >= limit) {
    return { ok: false, retryAfterSeconds: Math.ceil((existing.resetAt - now) / 1000) };
  }

  existing.count++;
  return { ok: true };
}

/**
 * Best-effort client address.
 *
 * Behind Hostinger's proxy the socket address is the proxy, so the forwarded
 * header is what identifies the caller. It is client-controlled and therefore
 * spoofable — which is why this is only ever used for rate limiting, never for
 * anything that grants access.
 */
export function clientIp(request: Request): string {
  const fwd = request.headers.get("x-forwarded-for");
  if (fwd) return fwd.split(",")[0].trim();
  return request.headers.get("x-real-ip")?.trim() || "unknown";
}

/** Standard 429 with a Retry-After header. */
export function tooMany(verdict: Extract<RateVerdict, { ok: false }>, message: string): Response {
  return new Response(JSON.stringify({ error: message }), {
    status: 429,
    headers: {
      "Content-Type": "application/json",
      "Retry-After": String(verdict.retryAfterSeconds),
    },
  });
}
