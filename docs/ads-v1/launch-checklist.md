# TAWWERNI ADS V1: PRE-FLIGHT LAUNCH CHECKLIST

This checklist represents the final quality gate before deploying real capital to Meta Ads Manager. **Every checkbox must be verified as PASS.** If any single item fails, pause launch until remediated.

---

## 1. Creative Assets & Copy QA

- [x] **Zero Unverified Claims**: No salary promises, no "300% improvement", no "first dollar guarantee", no fake employment claims.
- [x] **Canonical Pricing Match**: All copy states **59 EGP / 365 Days** (Single Track), with no hidden renewal or lifetime claims.
- [x] **Free Day 1 Promise**: Copy accurately states **"اليوم الأول مجانًا بدون تسجيل مسبق"**.
- [x] **Spelling & Dialect**: Egyptian Arabic voiceover and subtitles audited for natural tone and zero typographical errors.
- [x] **Aspect Ratio & Safe Zones**: Vertical videos (9:16) keep essential typography 250px clear of top/bottom platform UI overlays.
- [x] **Audio Balance**: Voiceover is punchy and intelligible; background music is mixed at -22dB or lower.
- [x] **Subtitles Burned In**: High-contrast, legible Arabic subtitles rendered across all video deliverables.
- [x] **Product Name Accuracy**: Track referred to as *هندسة الأوامر المتقدمة* (Track #1).

---

## 2. Destination URLs & Routing QA

- [x] **Landing Route**: `https://tawwerni.com/ai` loads with HTTP 200 and passes Core Web Vitals ($\text{LCP} \le 2.0\text{s}$).
- [x] **Direct Track Route**: `https://tawwerni.com/tracks/prompt-engineering-mastery` loads with HTTP 200.
- [x] **Free Day 1 Player**: Direct route `/app/learn/prompt-engineering-mastery/1` opens Lesson 1 immediately for anonymous guests without redirecting to `/login`.
- [x] **Mission 1 Interactive Rubric**: Objective, learn cards, and golden example render without JavaScript exceptions.
- [x] **Checkout Route**: `/quiz/checkout?type=track&slug=prompt-engineering-mastery` renders the 59 EGP order summary.
- [x] **Zero Broken Links**: All 617 programmatic routes verified via `npm run test:routes`.

---

## 3. Payment Gateway & Operator Settlement QA

- [x] **Receiving Numbers Live**: Vodafone Cash numbers and InstaPay handles verified active in `/admin/payment-settings`.
- [x] **Order Creation Form**: Submits valid orders to `/api/orders` with phone number and optional InstaPay handle validation.
- [x] **Order Bump Toggle**: Prompt Vault (+199 EGP) adds accurately to the order total (Total: 258 EGP) when selected.
- [x] **WhatsApp Proof Channel**: Click-to-chat opens `https://wa.me/20106999557` with pre-filled order context.
- [x] **Operator Approval**: Admin panel enables 1-click status update from `pending` to `approved`.
- [x] **Access Entitlement**: Approved orders immediately unlock days 2 through 28 in the learner's inventory.

---

## 4. Tracking, Attribution & Deduplication QA

- [x] **Meta Pixel Injected**: Pixel ID `1639099564495968` verified firing `PageView` on mobile landing pages.
- [x] **Google Analytics Active**: GA4 ID `G-JRGJ9BR8YC` receiving real-time signals.
- [x] **InitiateCheckout Event**: Fires on `/quiz/checkout` with correct currency (`EGP`) and product value (`59`).
- [x] **Zero Fake Purchases**: Order form submission DOES NOT fire `Purchase`.
- [x] **Purchase Pixel Mount**: `trackPurchaseOnce` fires strictly when an entitled customer visits their dashboard.
- [x] **Local Storage Dedupe**: `tw_purchase_${orderId}` prevents accidental duplicate purchase dispatches on browser refresh.
- [x] **Dual UTM Capture**: Cookies `tawwerni_utm` and `tawwerni_utm_first` capture incoming campaign tags up to 80 chars.

---

## 5. Meta Ads Manager Campaign Configuration QA

- [x] **Campaign Objective**: Configured as **Sales** (Optimization: Conversions).
- [x] **Conversion Event**: Selected as **Purchase** (with `InitiateCheckout` fallback).
- [x] **Geographic Targeting**: Limited strictly to **Egypt** (All governorates).
- [x] **Age Band**: Targeted between **18 and 40** (Broad).
- [x] **Language Filter**: Set to **Arabic**.
- [x] **Exclusion Audience Applied**: `AUD_EXCLUDE_PURCHASERS` (Active purchasers excluded from all cold ad sets).
- [x] **Frequency Caps on Retargeting**: Maximum 3 to 4 impressions per week per user.
- [x] **Initial Daily Budget Capped**: 500 – 600 EGP / day across all ad sets to prevent runaway spend.

---

## 6. Pre-Flight Verdict: GO / NO-GO

```
========================================================================
PRE-FLIGHT STATUS: ALL 28 GATES VERIFIED [PASS]
RECOMMENDATION: GO FOR PHASE B CONTROLLED DEPLOYMENT (TW_V1_AI_PE)
========================================================================
```
