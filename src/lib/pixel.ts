/**
 * Meta Pixel events.
 *
 * The pixel only loads in production (see `components/MetaPixel.tsx`), so every
 * call here is a no-op while developing — which is the point. Firing test
 * events from a laptop teaches the ad algorithm that people who never buy look
 * like buyers, and that damage is slow and invisible.
 *
 * A pixel ID is public by design; it is visible in the page source of every
 * site that runs one. It is not a secret and does not belong in an env var.
 */
export const PIXEL_ID = "3725210437617519";

type Fbq = (...args: unknown[]) => void;

function fbq(): Fbq | null {
  if (typeof window === "undefined") return null;
  const w = window as unknown as { fbq?: Fbq };
  return typeof w.fbq === "function" ? w.fbq : null;
}

/** Someone gave us their email at the end of the quiz. */
export function trackLead() {
  fbq()?.("track", "Lead");
}

/** Someone reached the payment screen. */
export function trackInitiateCheckout(valueEgp: number) {
  fbq()?.("track", "InitiateCheckout", { value: valueEgp, currency: "EGP" });
}

/**
 * Someone actually paid and got access.
 *
 * Deliberately NOT fired when the order is placed. An order sits as `pending`
 * until a transfer is matched against it, so reporting a purchase at that
 * moment would count everyone who filled the form and never sent the money —
 * and Meta would then go looking for more people like them.
 *
 * `orderId` keeps it to once per purchase: the event fires on the first page
 * load after access opens, and the id is remembered so a refresh does not
 * report a second sale.
 */
export function trackPurchaseOnce(orderId: string, valueEgp: number) {
  const send = fbq();
  if (!send) return;

  const key = `tw_purchase_${orderId}`;
  try {
    if (localStorage.getItem(key)) return;
    localStorage.setItem(key, "1");
  } catch {
    // Private browsing blocks storage. Reporting twice is better than never.
  }

  send("track", "Purchase", { value: valueEgp, currency: "EGP" });
}
