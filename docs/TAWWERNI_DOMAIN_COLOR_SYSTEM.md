# Tawwerni Global Domain Color & Visual Identity System
## Master Architecture & Design System Specification

---

### 1. Vision & Core Philosophy

**"One Learning Universe · 10 Distinct Visual Worlds"**

Tawwerni is not a random collection of disconnected courses, nor is it a monotonous, single-color text library. Tawwerni is an enterprise-grade **Learning Operating System (LOS)** designed around high learner engagement, immediate motivation (dopamine-aligned progression), and verifiable skill mastery.

To fulfill this vision without falling into visual chaos or turning the platform into a distracting rainbow, we establish a strict **3-Tier Visual Hierarchy**:

```
┌────────────────────────────────────────────────────────────────────────┐
│ LEVEL 1: BRAND IDENTITY (Tawwerni Signature Emerald / Deep Obsidian)   │
│ Navigation bar, platform background, global cockpit chrome, primary CTA│
├────────────────────────────────────────────────────────────────────────┤
│ LEVEL 2: DOMAIN VISUAL WORLDS (10 Strict Chromatic Identifiers)        │
│ Card borders, ambient radial glows, node outlines, domain badges, tags │
├────────────────────────────────────────────────────────────────────────┤
│ LEVEL 3: SEMANTIC ENGINE & REWARDS (Immutable System States)           │
│ Mastered ⭐ (Gold), Success ✓ (Green), Error (Red), Warning (Amber)   │
└────────────────────────────────────────────────────────────────────────┘
```

---

### 2. The 10 Learning Pillars: DNA & Visual Registries

Each pillar possesses its own complete chromatic scale (50–950), designated semantic surface washes, and custom SVG visual geometry:

| # | Domain (Arabic / English) | Primary | Secondary | Accent | Visual Motif |
|---|---|---|---|---|---|
| **1** | **الذكاء الاصطناعي وهندسة الأوامر**<br>`AI & Prompt Engineering` | `#10B981`<br>Emerald | `#064E3B`<br>Deep Forest | `#34D399`<br>Cyber Mint | Neural nodes, synaptic pulses & algorithmic vectors |
| **2** | **البرمجة وتطوير البرمجيات**<br>`Software & Web Development` | `#6366F1`<br>Electric Indigo | `#312E81`<br>Midnight Cobalt | `#818CF8`<br>Light Indigo | Code brackets `< / >`, terminal cursors & syntax flow |
| **3** | **تحليل البيانات والذكاء التجاري**<br>`Data Analytics & BI` | `#06B6D4`<br>Electric Cyan | `#164E63`<br>Deep Sea | `#38BDF8`<br>Sky Blue | Histograms, analytical trends & metric scatter plots |
| **4** | **العمل الحر وبناء الوكالات**<br>`Freelancing & Micro-Agencies` | `#F59E0B`<br>Warm Amber | `#78350F`<br>Burnt Gold | `#FBBF24`<br>Radiant Amber | Contract seals, deal-closing loops & client scale |
| **5** | **التسويق الرقمي ونمو المبيعات**<br>`Digital Marketing & Growth` | `#F43F5E`<br>Crimson Rose | `#881337`<br>Wine Ruby | `#FB7185`<br>Electric Coral | Rocket trajectory, viral propagation & growth curves |
| **6** | **التصميم والوسائط الإبداعية**<br>`UI/UX & Creative Media` | `#8B5CF6`<br>Purple Royale | `#4C1D95`<br>Imperial Violet | `#A78BFA`<br>Lavender | Bézier anchor points, chromatic wheels & layers |
| **7** | **ريادة الأعمال وبناء المشاريع**<br>`Entrepreneurship & Startups` | `#EA580C`<br>Burnt Ochre | `#7C2D12`<br>Terracotta | `#FB923C`<br>Sun Bronze | Architectural foundations, enterprise pillars & scale |
| **8** | **الأمن السيبراني وحماية الخصوصية**<br>`Cybersecurity & Privacy` | `#EF4444`<br>Crimson Red | `#7F1D1D`<br>Deep Burgundy | `#F87171`<br>Shield Coral | Cryptographic shield, lock cipher & perimeter walls |
| **9** | **المهارات الناعمة والقيادة**<br>`Soft Skills & Leadership` | `#EAB308`<br>Topaz Gold | `#713F12`<br>Warm Umber | `#FDE047`<br>Sun Yellow | Dialogue bridges, resonance curves & shared speech |
| **10** | **الإنتاجية وإدارة الذات والصحة**<br>`Productivity & Mindset` | `#14B8A6`<br>Zen Teal | `#134E4A`<br>Deep Pine | `#2DD4BF`<br>Aquamarine | Concentric focus orbits, equilibrium & flow rings |

---

### 3. Tonal Scales (50–950) & Mathematical Balance

Every domain defines an 11-step mathematical tone ladder from `50` (faintest atmospheric tint) up to `950` (deep contrast core):

```ts
export interface DomainScale {
  50: string;   // Faint atmospheric background wash
  100: string;  // Light mode chip background
  200: string;  // Light mode subtle border
  300: string;  // Prominent border in light mode
  400: string;  // Bright accent on dark surfaces
  500: string;  // Primary chromatic anchor
  600: string;  // High-contrast interactive button / icon
  700: string;  // WCAG AA compliant text on light grounds (>= 4.5:1)
  800: string;  // Deep brand shade
  900: string;  // Dark mode surface border / atmospheric container
  950: string;  // Deepest dark mode card floor tint
}
```

---

### 4. Accessibility & Contrast Verification (WCAG 2.1 AA)

To prevent visual fatigue and ensure complete readability for every student:
1. **Light Mode Contrast**:
   - Primary text in domain badges: Tone `700` or `900` over Tone `100` (`>= 5.2:1` contrast ratio).
   - Domain borders: Minimum `20%` alpha on light surfaces (`>= 3:1` non-text contrast).
2. **Dark Mode Contrast**:
   - Primary text in domain badges: Tone `300` or `400` over Tone `950/900` (`>= 7.8:1` contrast ratio).
   - Ambient glow: Limited to radial blurs of `15%–25%` opacity, preventing screen glare.
3. **No Meaning Exclusively Conveyed by Color**:
   - Every domain badge pairs its color with an explicit emoji icon and bilingual text label (e.g. `💻 Software & Web Development` / `💻 البرمجة وتطوير البرمجيات`).
   - Order badges display explicit track numbers (e.g. `#01`, `#15`).

---

### 5. Architectural Implementation Points

The system is centralized in `src/lib/design-system/domain-themes.ts` and wired into all key learning surfaces:

1. **`resolveDomainTheme({ pillarId, trackSlug, category, title })`**:
   Universal deterministic resolver. Safely returns the domain theme for any of the 100 tracks, 10 pillars, or custom modules.
2. **`StudentTrackCatalog.tsx`**:
   The 10 pillar filter tabs illuminate with their specific domain gradient and ambient shadow when selected.
3. **`TrackCardVisual.tsx`**:
   Displays domain-tinted badge pills, dynamic ambient corner glows, custom SVG illustration themes, and colored XP reward badges.
4. **`CourseTile.tsx`**:
   Shows active course highlight borders, progress bars, and category dots matching the exact domain palette.
5. **`SkillTreeView.tsx`**:
   In-progress skill nodes and graph legends glow with the domain accent while completed nodes retain universal gold mastery (`⭐`).
6. **`MissionPlayer.tsx`**:
   Atmospheric stage glows and target skill pills adapt instantly to the active track's domain identity.
7. **`ChatWidget.tsx` (FHEEM AI Coach)**:
   Displays active domain context strip when learners ask questions inside any course.

---

### 6. Interactive Design System Showcase

A dedicated inspection and auditing playground is available live at:
`/design-system`

This page allows designers and developers to:
- Toggle between Light Mode and Dark Mode.
- Inspect all 10 domain tonal ramps side-by-side.
- Test contrast scores and component variations in real time.
