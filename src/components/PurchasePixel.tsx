"use client";

import { useEffect } from "react";
import { trackPurchaseOnce } from "@/lib/analytics";

/**
 * Reports a sale once, on the first visit after access opens.
 *
 * The obvious place to fire this would be the checkout screen — but an order
 * there is only `pending`. The money arrives separately, by bank transfer, and
 * some people never send it. Reporting a purchase at that moment would tell
 * the ad platforms to find more people who fill in forms and disappear — the
 * expensive kind of wrong: the algorithm believes it and spends accordingly.
 *
 * So it fires here instead, where the server has already confirmed the learner
 * has paid access, and only once per order.
 */
export default function PurchasePixel({
  orderId,
  amountEgp,
}: {
  orderId: string;
  amountEgp: number;
}) {
  useEffect(() => {
    trackPurchaseOnce(orderId, amountEgp);
  }, [orderId, amountEgp]);

  return null;
}
