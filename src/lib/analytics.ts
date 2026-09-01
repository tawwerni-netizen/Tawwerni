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
export const META_PIXEL_ID = "1639099564495968";
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

/*
 * Everything below is GA-only, on purpose.
 *
 * These are internal funnel/engagement signals — useful for finding where
 * people actually drop off, not useful for Meta's ad optimizer. Sending it
 * dozens of custom events per user (one per lesson, one per article) dilutes
 * the handful of signals that actually matter to it (Lead, InitiateCheckout,
 * Purchase, already above). GA can hold the detail; Meta gets the moments
 * that predict a sale.
 */

export function trackQuizStarted() {
  google()?.("event", "quiz_started");
}

export function trackArticleView(slug: string, pillar: string) {
  google()?.("event", "article_view", { article_slug: slug, article_pillar: pillar });
}

export function trackLessonCompleted(courseSlug: string, day: number) {
  google()?.("event", "lesson_completed", { course_slug: courseSlug, day });
}

/** Once per course — the same `orderId`-style dedupe as `trackPurchaseOnce`. */
export function trackCertificateEarned(courseSlug: string) {
  const ga = google();
  if (!ga) return;
  const key = `tw_cert_${courseSlug}`;
  try {
    if (localStorage.getItem(key)) return;
    localStorage.setItem(key, "1");
  } catch {
    // Private browsing — reporting twice beats never reporting.
  }
  ga("event", "certificate_earned", { course_slug: courseSlug });
}

export function trackReferralShared(channel: "whatsapp" | "native" | "copy") {
  google()?.("event", "referral_shared", { channel });
}
