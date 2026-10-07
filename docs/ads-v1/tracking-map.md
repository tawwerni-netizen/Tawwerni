# CONVERSION EVENT TRACKING & MEASUREMENT MAP

## 1. Pixel & Analytics IDs
* **Meta Pixel ID**: `1639099564495968` (Active in `src/lib/analytics.ts` and `src/components/Analytics.tsx`)
* **Google Analytics 4 Measurement ID**: `G-JRGJ9BR8YC`
* **Default Currency**: `EGP` (Egyptian Pound)
* **Environment Guard**: Analytics only dispatch in production mode (`NODE_ENV === "production"`) to prevent contaminating ad learning with development traffic.

---

## 2. Event Catalog & Funnel Mapping

Every conversion touchpoint is mapped uniformly to Meta Pixel and Google Analytics:

| Funnel Step | Trigger Action | Meta Pixel Event | GA4 Event Name | Key Payload Parameters |
| :--- | :--- | :--- | :--- | :--- |
| **0. Page View** | Landing page or track view loads | `PageView` | `page_view` | `page_location`, `page_title` |
| **1. Product View** | User visits `/tracks/[slug]` or `/ai` | `ViewContent` | `view_item` | `content_name: slug`, `value: 59`, `currency: EGP` |
| **2. Free Day Start**| Learner opens Day 1 player | *Internal Signal* | `free_day_started` | `course_slug`, `day: 1` |
| **3. Quiz Start** | User clicks "ابدأ الاختبار" | *Internal Signal* | `quiz_started` | `source: quiz_home` |
| **4. Quiz Finish** | User completes quiz & inputs email | `Lead` | `generate_lead` | `currency: EGP` |
| **5. Registration** | Account created (email or Google) | `CompleteRegistration` | `sign_up` | `method: email | google` |
| **6. Checkout Start**| User lands on `/quiz/checkout` | `InitiateCheckout` | `begin_checkout`| `value: 59 | 149 | 399`, `currency: EGP` |
| **7. Method Chosen** | User toggles Vodafone Cash / InstaPay | *Internal Signal* | `payment_method_selected` | `method: vodafone_cash | instapay` |
| **8. Instructions** | User copies wallet number or handle | *Internal Signal* | `payment_instructions_viewed`| `method`, `value` |
| **9. Order Placed** | Order submitted to DB (awaiting cash)| *Internal Signal* | `payment_initiated` | `method`, `value`, `order_id`, `product_type` |
| **10. WhatsApp Help**| User clicks WhatsApp to send receipt | *Internal Signal* | `whatsapp_support_clicked` | `order_id`, `source: checkout` |
| **11. PURCHASE** | **Payment verified & access unlocked** | **`Purchase`** | **`purchase`** | **`transaction_id: orderId`**, **`value: amountEgp`**, **`currency: EGP`** |
| **12. Lesson Done** | Learner finishes lesson card/mission | *Internal Signal* | `lesson_completed` | `course_slug`, `day` |
| **13. Certificate** | Learner earns final completion cert | *Internal Signal* | `certificate_earned` | `course_slug` |
| **14. Second Buy** | Existing paid learner buys 2nd product| **`Purchase`** | **`purchase`** | `is_repeat: true`, `transaction_id`, `value` |

---

## 3. The Strict Purchase Deduplication Protocol

A major pitfall in manual bank/wallet transfer checkouts is counting an order placement as a "Purchase". Doing so trains Meta algorithms on users who submit a form but never transfer funds.

### The Tawwerni 2-Stage Gate:
1. **Stage 1 (Checkout Form)**:
   * Fires `InitiateCheckout` on page load.
   * Fires `payment_initiated` when the order is saved as `status: "pending"`.
   * **Never fires `Purchase` at this stage.**
2. **Stage 2 (Operator Activation & First Authenticated Visit)**:
   * Operator verifies the Vodafone Cash SMS or InstaPay notification in `/admin`.
   * Operator updates order status to `"approved"`, triggering user entitlement in the database.
   * On the learner's next visit to the course player or dashboard, `PurchasePixel` mounts:

```typescript
// src/components/PurchasePixel.tsx & src/lib/analytics.ts
export function trackPurchaseOnce(orderId: string, valueEgp: number) {
  const key = `tw_purchase_${orderId}`;
  try {
    if (localStorage.getItem(key)) return; // Strictly deduplicated in browser
    localStorage.setItem(key, "1");
  } catch {}

  meta()?.("track", "Purchase", { value: valueEgp, currency: "EGP" });
  google()?.("event", "purchase", {
    transaction_id: orderId, // Deduplicated in Google Analytics
    value: valueEgp,
    currency: "EGP",
  });
}
```

---

## 4. Privacy & Data Protection Safeguards
* **Zero PII in Ad Pixels**: User passwords, national IDs, and raw payment wallet balances are never dispatched to Meta or Google.
* **Sanitized Phone Numbers**: Customer telephone numbers used for wallet transfer matching are retained securely in the internal PostgreSQL database only.
* **First-Touch & Last-Touch Integrity**: Cookies `tawwerni_utm` and `tawwerni_utm_first` operate with `SameSite=Lax` and standard 30-day expiration, preserving privacy compliance while maintaining attribution accuracy.
