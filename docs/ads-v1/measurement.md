# PERFORMANCE MEASUREMENT, UNIT ECONOMICS & KPI SCORECARDS

## 1. Measurement Philosophy: Deep Conversion Over Superficial CTR
Superficial vanity metrics (likes, video views, high CTR with high bounce rates) kill early-stage growth experiments. A cheap click that drops off in 2 seconds is more expensive than a targeted 3-EGP click that finishes Day 1 and pays 59 EGP.

We evaluate campaign performance across four distinct tiers:
1. **Engagement Metrics (Creative Top of Funnel)**
2. **On-Site Friction & Intent Metrics (Middle of Funnel)**
3. **Commercial & Cash Velocity Metrics (Bottom of Funnel)**
4. **Unit Economics & Contribution Margin (Financial Truth)**

---

## 2. Core Metrics & Mathematical Formulas

| Metric | Code / Shorthand | Formula | Healthy Benchmark Target |
| :--- | :---: | :--- | :---: |
| **Thumbstop Rate** | `TSR` | $\frac{\text{3-Second Video Views}}{\text{Total Impressions}} \times 100$ | $\ge 25\%$ |
| **Outbound Click-Through** | `CTR` | $\frac{\text{Outbound Clicks}}{\text{Total Impressions}} \times 100$ | $\ge 1.5\%$ |
| **Cost Per Click (Outbound)** | `CPC` | $\frac{\text{Total Ad Spend}}{\text{Outbound Clicks}}$ | $\le 2.50\text{ EGP}$ |
| **Landing View Rate** | `LVR` | $\frac{\text{Landing Page Views}}{\text{Outbound Clicks}} \times 100$ | $\ge 75\%$ |
| **Free Day Start Rate** | `D1_CVR`| $\frac{\text{Day 1 Starts}}{\text{Landing Page Views}} \times 100$ | $\ge 18\%$ |
| **Checkout Initiation Rate** | `IC_CVR`| $\frac{\text{Initiate Checkout}}{\text{Landing Page Views}} \times 100$ | $\ge 4.5\%$ |
| **Payment Order Rate** | `POR` | $\frac{\text{Orders Created}}{\text{Initiate Checkout}} \times 100$ | $\ge 40\%$ |
| **Payment Confirmation Rate**| `PCR` | $\frac{\text{Approved Purchases}}{\text{Orders Created}} \times 100$ | $\ge 65\%$ |
| **Cost Per Acquisition** | `CPA` | $\frac{\text{Total Ad Spend}}{\text{Approved Purchases}}$ | $\le 35.00\text{ EGP}$ |
| **Average Order Value** | `AOV` | $\frac{\text{Gross Revenue}}{\text{Approved Purchases}}$ | $\ge 75.00\text{ EGP}$ |
| **Order Bump Take Rate** | `BUMP` | $\frac{\text{Prompt Vault (+199) Upgrades}}{\text{Total Orders}} \times 100$ | $\ge 15\%$ |
| **Return on Ad Spend** | `ROAS` | $\frac{\text{Gross Realized Revenue}}{\text{Total Ad Spend}}$ | $\ge 2.2\times$ |
| **Second Purchase Rate** | `RPT` | $\frac{\text{Users with } \ge 2\text{ Purchases}}{\text{Total Customers}} \times 100$ | $\ge 12\%$ |
| **Refund Request Rate** | `RFR` | $\frac{\text{Refund Requests}}{\text{Approved Purchases}} \times 100$ | $\le 4\%$ |

---

## 3. Financial Contribution Margin Model

Gross Revenue is not profit. Every paid cohort must be reconciled against operating liabilities:

$$\text{Net Contribution} = \text{Gross Cash Revenue} - \text{Ad Spend} - \text{Refunds Settled} - \text{Referral Payouts} - \text{Direct COGS}$$

### Cohort Scenario Example (100 Paid Track Orders):
* **Base Track Revenue ($100 \times 59\text{ EGP}$)**: $5,900\text{ EGP}$
* **Prompt Vault Bumps ($15 \times 199\text{ EGP}$)**: $2,985\text{ EGP}$
* **Total Gross Realized Revenue**: $8,885\text{ EGP}$ ($\text{AOV} = 88.85\text{ EGP}$)
* **Ad Spend (Target CPA 35 EGP $\times 100$)**: $-3,500\text{ EGP}$
* **Refund Requests (2 approved @ 59 EGP)**: $-118\text{ EGP}$
* **Referral Payouts (4 qualified @ 25 EGP)**: $-100\text{ EGP}$
* **Direct Server / DB / LLM COGS ($100 \times 6.50\text{ EGP}$)**: $-650\text{ EGP}$
* **Net Contribution Profit**: **$+4,517\text{ EGP}$** ($50.8\%$ Net Margin)

---

## 4. Creative Leaderboard Evaluation Protocol

When comparing creative assets in `TW_V1_AI_PE`, rank them strictly according to this decision matrix:

```
Tier 1 (Ultimate Rank): Confirmed Paid Purchases (Volume)
Tier 2 (Efficiency Rank): Cost Per Acquisition (CPA)
Tier 3 (Intent Rank): Cost Per Checkout Initiated
Tier 4 (Diagnostic Rank): Outbound CTR & Landing Page CVR
```

> **RULE**: A creative with $1.2\%$ CTR that produces 10 purchases at 30 EGP CPA **wins** over a creative with $3.8\%$ CTR that produces 2 purchases at 70 EGP CPA.

---

## 5. Daily Operator Reporting Ledger Template

| Date | Spend (EGP) | Impressions | Clicks | CTR % | Free Days | Checkouts | Orders | Paid | CPA (EGP) | Revenue (EGP) | Net Contribution |
| :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: | :---: |
| Day 1 | 500.00 | 22,400 | 380 | 1.70% | 68 | 18 | 8 | 5 | 100.00 | 494.00 | -6.00 |
| Day 2 | 500.00 | 24,100 | 420 | 1.74% | 82 | 24 | 14 | 9 | 55.55 | 730.00 | +230.00 |
| Day 3 | 500.00 | 25,600 | 490 | 1.91% | 104 | 31 | 19 | 14 | 35.71 | 1,285.00 | +785.00 |
| **Total**| **1,500.00** | **72,100** | **1,290** | **1.79%** | **254** | **73** | **41** | **28** | **53.57** | **2,509.00** | **+1,009.00** |
