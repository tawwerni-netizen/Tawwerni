/**
 * Conversion events, sent to Meta and Google together.
 *
 * One function per thing that actually happens, firing both platforms from the
 * same call. Wiring them separately is how the two dashboards end up
 * disagreeing about the same day — and then neither number gets trusted.
 *
 * Nothing here runs outside production (see `components/Analytics.tsx`), so
 * these are no-ops while developing. That is the point: test traffic from a
 * laptop teaches the ad algorithms that people who never buy look like buyers,
 * and that damage is slow and invisible.
 *
 * Both IDs are public by design — they are visible in the page source of every
 * site that runs them. They are not secrets and do not belong in env vars.
 */
export const META_PIXEL_ID = "3725210437617519";
export const GA_MEASUREMENT_ID = "G-JRGJ9BR8YC";

const CURRENCY = "EGP";

type Fn = (...args: unknown[]) => void;

function meta(): Fn | null {
  if (typeof window === "undefined") return null;
  const w = window as unknown as { fbq?: Fn };
  return typeof w.fbq === "function" ? w.fbq : null;
}

function google(): Fn | null {
  if (typeof window === "undefined") return null;
  const w = window as unknown as { gtag?: Fn };
  return typeof w.gtag === "function" ? w.gtag : null;
}

/** Someone gave us their email at the end of the quiz. */
export function trackLead() {
  meta()?.("track", "Lead");
  google()?.("event", "generate_lead", { currency: CURRENCY });
}

/** Someone reached the payment screen. */
export function trackInitiateCheckout(valueEgp: number) {
  meta()?.("track", "InitiateCheckout", { value: valueEgp, currency: CURRENCY });
  google()?.("event", "begin_checkout", { value: valueEgp, currency: CURRENCY });
}

/**
 * Someone actually paid and got access.
 *
 * Deliberately NOT fired when the order is placed. An order sits as `pending`
 * until a transfer is matched against it, so reporting a purchase at that
 * moment would count everyone who filled the form and never sent the money —
 * and the algorithms would then go looking for more people like them.
 *
 * `orderId` keeps it to once per purchase. Google would also dedupe on
 * `transaction_id` by itself, but Meta would not, so the guard covers both.
 */
export function trackPurchaseOnce(orderId: string, valueEgp: number) {
  const fb = meta();
  const ga = google();
  if (!fb && !ga) return;

  const key = `tw_purchase_${orderId}`;
  try {
    if (localStorage.getItem(key)) return;
    localStorage.setItem(key, "1");
  } catch {
    // Private browsing blocks storage. Reporting twice beats never reporting.
  }

  fb?.("track", "Purchase", { value: valueEgp, currency: CURRENCY });
  ga?.("event", "purchase", {
    transaction_id: orderId,
    value: valueEgp,
    currency: CURRENCY,
  });
}
