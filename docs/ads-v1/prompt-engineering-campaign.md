# CAMPAIGN BRIEF: TAWWERNI ADS V1 — PROMPT ENGINEERING MASTERY

## 1. Campaign Architecture Overview

* **Campaign Name**: `TW_V1_AI_PE`
* **Objective Category**: **Sales (Conversions)**
* **Optimization Goal**:
  * *Primary Conversion Event*: **Purchase** (Value: 59 EGP / Currency: EGP).
  * *Learning Phase Attribution*: **InitiateCheckout** (Secondary signal to accelerate algorithmic calibration).
* **Target Territory**: Egypt (جمهورية مصر العربية).
* **Primary Language**: Arabic (اللغة العربية).
* **Pricing & Offer**: **اليوم الأول مجانًا · ثم 59 ج.م لسنة كاملة بدون تجديد تلقائي**.

---

## 2. Ad Set Segmentation Strategy

We maintain a disciplined 2-Ad-Set cold structure plus 1 retargeting ad set to prevent audience fragmentation and auction self-cannibalization.

```
Campaign: TW_V1_AI_PE (Budget: CBO or ABO Controlled)
│
├── Ad Set 01: [BROAD] Egypt · 18–40 · All Genders · Advantage+ Placements
│   ├── Creative 01: Problem Angle A (Video: "كل مرة النتيجة مختلفة")
│   ├── Creative 02: Mistake Angle B (Video: "ChatGPT مش Google")
│   ├── Creative 03: Transformation Angle C (Video: "بدل السؤال صمم النتيجة")
│   ├── Creative 04: Static Contrast (Before vs After)
│   └── Creative 05: Carousel Workflow (Problem → Mechanism → Free Day)
│
├── Ad Set 02: [INTERESTS] Egypt · 18–40 · Tech & Knowledge Work Context
│   └── (Same 5 Creative assets to isolate audience response)
│
└── Ad Set 03: [RETARGETING] Custom Audiences (Excluding Paid Customers)
    ├── Segment A: Free Day Starters & Lesson Viewers
    └── Segment B: Checkout Starters (Non-Purchased)
```

---

## 3. Detailed Ad Set Specifications

### Ad Set 01: [BROAD]
* **Name**: `TW_V1_AI_PE_AS01_BROAD`
* **Geography**: Egypt (All Governorates).
* **Age Range**: 18 – 40.
* **Gender**: All.
* **Detailed Targeting**: None (Clean Broad). Let Meta's machine learning algorithm find consumers reacting to the video hook.
* **Placements**: Advantage+ Placements (Mobile optimized: Reels, Stories, Feeds).
* **Device**: Mobile Only (Primary) / All Devices.
* **Daily Budget**: 250 EGP / day.

### Ad Set 02: [INTERESTS & CONTEXT]
* **Name**: `TW_V1_AI_PE_AS02_INTERESTS`
* **Geography**: Egypt.
* **Age Range**: 20 – 38.
* **Gender**: All.
* **Targeting Stack (OR combination)**:
  * Artificial intelligence OR ChatGPT OR OpenAI
  * Productivity software OR Remote work OR Freelancer
  * Coursera OR Udemy OR Digital marketing OR Software engineering
* **Placements**: Advantage+ Placements.
* **Daily Budget**: 250 EGP / day.

### Ad Set 03: [RETARGETING]
* **Name**: `TW_V1_AI_PE_AS03_RETARGETING`
* **Custom Audiences Included**:
  * Website Visitors (Last 14 Days)
  * Free Day 1 Starters / Quiz Completers (Last 30 Days)
  * Checkout Initiated (`InitiateCheckout`) (Last 7 Days)
* **Custom Audiences Excluded (Mandatory)**:
  * Confirmed Purchasers (`Purchase` / `UserEntitlement` active)
* **Placements**: Mobile Feed, Reels & Stories.
* **Daily Budget**: 100 EGP / day.

---

## 4. Controlled Testing Rules & Scaling Criteria

### Phase 1: Exploration Baseline (Days 1 to 5)
* **Total Daily Spend**: 500 – 600 EGP.
* **Minimum Data Threshold**: Do not touch or pause any ad before accumulating at least **1,500 impressions** and **50 link clicks**.
* **Primary Observation**:
  * Hook Thumbstop Rate (3-sec Video Views / Impressions $\ge 25\%$).
  * Outbound CTR ($\ge 1.5\%$).
  * Landing Page View Rate (LPV / Clicks $\ge 75\%$).
  * Free Day 1 Start Rate.

### Phase 2: Creative Trimming (Day 6 onwards)
* **Kill Rule**:
  * If a creative receives $> 50$ clicks with $0$ Free Day starts or $0$ Checkouts, pause that creative.
  * If a creative has $\text{CPA} > 75\text{ EGP}$ with $\ge 3$ spend cycles, rotate to creative angle backup.
* **Keep & Scale Rule**:
  * When a creative produces confirmed purchases at $\text{CPA} \le 40\text{ EGP}$, increase daily ad set budget by $20\%$ every 48 hours.
  * Never duplicate ad sets prematurely; keep auction history consolidated.

---

## 5. UTM Tracking String Templates

### Ad Set 01 (Broad) Creatives:
* **Video Problem 1**:
  `https://tawwerni.com/ai?utm_source=meta&utm_medium=paid_social&utm_campaign=tw_ads_v1_ai&utm_adset=broad&utm_content=vid_problem_p01`
* **Video Mistake 1**:
  `https://tawwerni.com/ai?utm_source=meta&utm_medium=paid_social&utm_campaign=tw_ads_v1_ai&utm_adset=broad&utm_content=vid_mistake_m01`
* **Video Transformation 1**:
  `https://tawwerni.com/ai?utm_source=meta&utm_medium=paid_social&utm_campaign=tw_ads_v1_ai&utm_adset=broad&utm_content=vid_transform_t01`
* **Static Contrast**:
  `https://tawwerni.com/ai?utm_source=meta&utm_medium=paid_social&utm_campaign=tw_ads_v1_ai&utm_adset=broad&utm_content=sta_contrast_s01`
* **Carousel Workflow**:
  `https://tawwerni.com/ai?utm_source=meta&utm_medium=paid_social&utm_campaign=tw_ads_v1_ai&utm_adset=broad&utm_content=car_workflow_c01`

### A/B Destination Variant:
For direct product page testing against `/ai`:
`https://tawwerni.com/tracks/prompt-engineering-mastery?utm_source=meta&utm_medium=paid_social&utm_campaign=tw_ads_v1_ai&utm_adset=broad&utm_content=vid_problem_p01_direct`
