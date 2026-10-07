# CANONICAL UTM TAXONOMY & ATTRIBUTION MAP

## 1. UTM Parameter Naming Conventions
All paid marketing URLs must strictly adhere to this lowercase, underscore-delimited taxonomy to ensure clean aggregation in Google Analytics and internal operator dashboards:

| Parameter | Purpose | Permitted Values | Example |
| :--- | :--- | :--- | :--- |
| **`utm_source`** | Advertising platform / channel | `meta`, `instagram`, `facebook`, `whatsapp` | `meta` |
| **`utm_medium`** | Commercial distribution type | `paid_social`, `retargeting`, `referral` | `paid_social` |
| **`utm_campaign`**| Campaign master identifier | `tw_ads_v1_[vertical]` | `tw_ads_v1_ai` |
| **`utm_term`** | Ad set or audience segment | `broad`, `interests`, `rtg_checkout` | `broad` |
| **`utm_content`** | Angle + Creative asset code | `[angle]_[creative_code]` | `problem_vid01` |

---

## 2. First-Touch vs Last-Touch Attribution Architecture

In `src/app/layout.tsx`, Tawwerni preserves **both** attribution models automatically on the client:

```javascript
// Captures both first and last touch in cookies & storage
var utmKeys = ['utm_source','utm_medium','utm_campaign','utm_content','utm_term','fbclid','gclid'];
// 1. Last Touch stored in 'tawwerni_utm' (updated on every campaign visit)
// 2. First Touch stored in 'tawwerni_utm_first' (never overwritten once set)
```

* **First-Touch (`tawwerni_utm_first`)**: Identifies which creative angle or hook brought the cold user to Tawwerni for the very first time. Essential for creative discovery.
* **Last-Touch (`tawwerni_utm`)**: Identifies which retargeting or organic touchpoint closed the sale at checkout. Essential for conversion rate optimization.

---

## 3. Ready-to-Use Tracking URLs: Campaign 1 (Prompt Engineering)

### Ad Set 01: [BROAD] (Advantage+ Placements)
1. **Video 01 (Problem: "كل مرة النتيجة مختلفة")**:
   `https://tawwerni.com/ai?utm_source=meta&utm_medium=paid_social&utm_campaign=tw_ads_v1_ai&utm_term=broad&utm_content=problem_vid01`
2. **Video 02 (Mistake: "ChatGPT مش Google")**:
   `https://tawwerni.com/ai?utm_source=meta&utm_medium=paid_social&utm_campaign=tw_ads_v1_ai&utm_term=broad&utm_content=mistake_vid02`
3. **Video 03 (Transformation: "بدل السؤال صمم النتيجة")**:
   `https://tawwerni.com/ai?utm_source=meta&utm_medium=paid_social&utm_campaign=tw_ads_v1_ai&utm_term=broad&utm_content=transform_vid03`
4. **Video 04 (Friction: "بتعدل ورا الذكاء الاصطناعي؟")**:
   `https://tawwerni.com/ai?utm_source=meta&utm_medium=paid_social&utm_campaign=tw_ads_v1_ai&utm_term=broad&utm_content=friction_vid04`
5. **Video 05 (Direct Trial: "جرب أول مهمة مجانًا")**:
   `https://tawwerni.com/ai?utm_source=meta&utm_medium=paid_social&utm_campaign=tw_ads_v1_ai&utm_term=broad&utm_content=trial_vid05`
6. **Static 01 (Split Contrast ก่อน vs بعد)**:
   `https://tawwerni.com/ai?utm_source=meta&utm_medium=paid_social&utm_campaign=tw_ads_v1_ai&utm_term=broad&utm_content=contrast_sta01`
7. **Static 04 (Proof-First UI Screenshot)**:
   `https://tawwerni.com/ai?utm_source=meta&utm_medium=paid_social&utm_campaign=tw_ads_v1_ai&utm_term=broad&utm_content=proof_sta04`
8. **Carousel 01 (Workflow Problem $\rightarrow$ Mechanism)**:
   `https://tawwerni.com/ai?utm_source=meta&utm_medium=paid_social&utm_campaign=tw_ads_v1_ai&utm_term=broad&utm_content=workflow_car01`

### Ad Set 02: [INTERESTS] (Tech / Knowledge Work Stack)
*(Replace `utm_term=broad` with `utm_term=interests` across all URLs above)*
* Example:
  `https://tawwerni.com/ai?utm_source=meta&utm_medium=paid_social&utm_campaign=tw_ads_v1_ai&utm_term=interests&utm_content=problem_vid01`

### Ad Set 03: [RETARGETING]
* **Retargeting Quiz Completers**:
  `https://tawwerni.com/ai?utm_source=meta&utm_medium=retargeting&utm_campaign=tw_ads_v1_ai&utm_term=rtg_quiz&utm_content=quiz_reminder01`
* **Retargeting Free Day Starters**:
  `https://tawwerni.com/tracks/prompt-engineering-mastery?utm_source=meta&utm_medium=retargeting&utm_campaign=tw_ads_v1_ai&utm_term=rtg_freeday&utm_content=freeday_complete02`
* **Retargeting Checkout Abandoners**:
  `https://tawwerni.com/quiz/checkout?type=track&slug=prompt-engineering-mastery&utm_source=meta&utm_medium=retargeting&utm_campaign=tw_ads_v1_ai&utm_term=rtg_checkout&utm_content=cart_saved03`

---

## 4. Platform Safety Constraints
* **Max Length**: All parameter values are capped at 80 characters in JavaScript to prevent cookie bloat.
* **No Special Characters**: Avoid spaces, quotes, Arabic characters, or uppercase letters in UTM tags.
* **Auto-Sanitization**: If query parameters arrive with encoded entities, the frontend cleans and parses them cleanly.
