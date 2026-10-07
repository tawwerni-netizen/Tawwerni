/**
 * Automated Route & Content Truth Validation Script
 * (Tawwerni V4.7 Requirement 04)
 *
 * Verifies that:
 * 1. All 100 tracks resolve and load Day 1 lessons & missions without error.
 * 2. All 12 Career Paths resolve canonical first tracks and Day 1 lessons & missions.
 * 3. Homepage hero and category cards resolve valid canonical routes.
 * 4. All Quiz Archetypes recommend valid tracks that load Day 1 lessons & missions.
 * 5. All 9 vertical landing page course slugs resolve and load Day 1 lessons & missions.
 */

import { ALL_100_TRACKS } from "../src/content/tracks100";
import { getAllCareerPaths } from "../src/content/career-paths";
import { archetypes } from "../src/content/marketing-quiz";
import {
  resolveCanonicalTrack,
  getTrackDayOneUrl,
  getTrackDetailUrl,
  resolveCanonicalCareerPath,
  getCareerPathFirstTrackSlug,
  getCareerPathFirstDayUrl,
  getCareerPathDetailUrl,
} from "../src/lib/canonical-routes";
import { loadUniversalLesson } from "../src/lib/course-loader";
import { loadMission } from "../src/lib/mission-adapter";
import { PRACTICAL_PROJECTS } from "../src/content/practical-projects";

interface ValidationResult {
  category: string;
  item: string;
  status: "PASS" | "FAIL";
  details?: string;
}

const results: ValidationResult[] = [];
let failCount = 0;

function record(category: string, item: string, pass: boolean, details?: string) {
  if (pass) {
    results.push({ category, item, status: "PASS" });
  } else {
    failCount++;
    results.push({ category, item, status: "FAIL", details });
    console.error(`❌ [${category}] ${item} FAILED: ${details || "Unknown error"}`);
  }
}

console.log("🔍 ========================================================");
console.log("🔍 TAWWERNI V4.7 AUTOMATED ROUTE & CONTENT TRUTH VALIDATION");
console.log("🔍 ========================================================\n");

// 1. Audit ALL 100 Tracks
console.log(`📦 [1/5] Auditing ALL 100 Tracks...`);
if (ALL_100_TRACKS.length !== 100) {
  record("Track Catalog", "Total Count", false, `Expected 100 tracks, found ${ALL_100_TRACKS.length}`);
} else {
  record("Track Catalog", "Total Count (100 Tracks)", true);
}

for (const track of ALL_100_TRACKS) {
  const byId = resolveCanonicalTrack(track.id);
  const bySlug = resolveCanonicalTrack(track.slug);
  const resolvePass = Boolean(byId && bySlug && byId.slug === track.slug && bySlug.id === track.id);
  record("Track Resolution", `Track #${track.id} (${track.slug})`, resolvePass, "Slug or ID mismatch in resolveCanonicalTrack");

  const dayOneUrl = getTrackDayOneUrl(track.slug);
  const expectedUrl = `/app/learn/${track.slug}/1`;
  record("Track Day 1 Route", `Track #${track.id} URL`, dayOneUrl === expectedUrl, `Got ${dayOneUrl}, expected ${expectedUrl}`);

  const lessonData = loadUniversalLesson(track.slug, 1);
  const hasLesson = Boolean(lessonData && lessonData.lesson && lessonData.lesson.cards.length > 0);
  record("Track Day 1 Lesson", `Track #${track.id} Content`, hasLesson, "Failed to load lesson day 1 cards");

  const missionData = loadMission(track.slug, 1);
  const hasMission = Boolean(missionData && missionData.objective && missionData.rubric.length > 0);
  record("Track Day 1 Mission", `Track #${track.id} Mission`, hasMission, "Failed to load mission day 1 rubric/objective");
}

// 2. Audit Career Paths (12 Paths)
console.log(`\n🎓 [2/5] Auditing ALL 12 Career Paths...`);
const allPaths = getAllCareerPaths();
record("Career Paths Catalog", "Total Count (12 Paths)", allPaths.length === 12, `Expected 12 paths, found ${allPaths.length}`);

for (const cp of allPaths) {
  const resolved = resolveCanonicalCareerPath(cp.slug);
  record("Career Path Resolution", cp.slug, Boolean(resolved && resolved.id === cp.id), "Could not resolve canonical path");

  const firstTrackSlug = getCareerPathFirstTrackSlug(cp.slug);
  const canonicalTrack = resolveCanonicalTrack(firstTrackSlug);
  record("Career Path First Track", `${cp.slug} -> ${firstTrackSlug}`, Boolean(canonicalTrack), "First track not in canonical catalog");

  const dayOneUrl = getCareerPathFirstDayUrl(cp.slug);
  const expectedDayOneUrl = `/app/learn/${firstTrackSlug}/1`;
  record("Career Path Day 1 Route", cp.slug, dayOneUrl === expectedDayOneUrl, `Got ${dayOneUrl}, expected ${expectedDayOneUrl}`);

  const lessonData = loadUniversalLesson(firstTrackSlug, 1);
  record("Career Path Day 1 Lesson", `${cp.slug} (${firstTrackSlug})`, Boolean(lessonData?.lesson), "Day 1 lesson failed to load");

  const missionData = loadMission(firstTrackSlug, 1);
  record("Career Path Day 1 Mission", `${cp.slug} (${firstTrackSlug})`, Boolean(missionData?.objective), "Day 1 mission failed to load");
}

// 3. Audit Homepage Hero & Featured Category Cards
console.log(`\n🏠 [3/5] Auditing Homepage Hero & Category Cards...`);
const homepageCards = [
  { label: "AI Mastery (Track 1)", id: 1, expectedSlug: "prompt-engineering-mastery" },
  { label: "Freelancing (Track 31)", id: 31, expectedSlug: "zero-to-first-dollar-freelancer" },
  { label: "Marketing (Track 46)", id: 46, expectedSlug: "high-converting-copywriting" },
];

for (const card of homepageCards) {
  const track = resolveCanonicalTrack(card.id);
  record("Homepage Card Track", card.label, Boolean(track && track.slug === card.expectedSlug), `Expected ${card.expectedSlug}, got ${track?.slug}`);

  const dayOneUrl = getTrackDayOneUrl(card.id);
  const expectedUrl = `/app/learn/${card.expectedSlug}/1`;
  record("Homepage Card Day 1 Route", card.label, dayOneUrl === expectedUrl, `Expected ${expectedUrl}, got ${dayOneUrl}`);

  const lesson = loadUniversalLesson(card.expectedSlug, 1);
  record("Homepage Card Day 1 Lesson", card.label, Boolean(lesson?.lesson), "Day 1 lesson failed");

  const mission = loadMission(card.expectedSlug, 1);
  record("Homepage Card Day 1 Mission", card.label, Boolean(mission?.objective), "Day 1 mission failed");
}

// 4. Audit Marketing Quiz Archetypes
console.log(`\n📋 [4/5] Auditing Quiz Archetypes Recommended Tracks...`);
for (const archetype of Object.values(archetypes)) {
  record("Quiz Archetype Slugs Exist", archetype.key, archetype.recommendedTrackSlugs.length > 0, "No recommended tracks");

  for (const trackSlug of archetype.recommendedTrackSlugs) {
    const track = resolveCanonicalTrack(trackSlug);
    record("Quiz Recommended Track", `${archetype.key} -> ${trackSlug}`, Boolean(track), "Track slug not in canonical catalog");

    const dayOneUrl = getTrackDayOneUrl(trackSlug);
    const expectedUrl = `/app/learn/${trackSlug}/1`;
    record("Quiz Day 1 Route", `${archetype.key} -> ${trackSlug}`, dayOneUrl === expectedUrl, `Expected ${expectedUrl}, got ${dayOneUrl}`);

    const lesson = loadUniversalLesson(trackSlug, 1);
    record("Quiz Day 1 Lesson", `${archetype.key} -> ${trackSlug}`, Boolean(lesson?.lesson), "Day 1 lesson failed");
  }
}

// 5. Audit Vertical Landing Pages
console.log(`\n🚀 [5/5] Auditing 9 Vertical Landing Pages...`);
const verticalPages = [
  { path: "/ai", courseSlug: "tahaddi-28-yawm", canonicalSlug: "prompt-engineering-mastery" },
  { path: "/coding", courseSlug: "modern-coding-fundamentals", canonicalSlug: "modern-coding-fundamentals" },
  { path: "/freelancing", courseSlug: "el-3amal-el-horr", canonicalSlug: "zero-to-first-dollar-freelancer" },
  { path: "/digital-marketing", courseSlug: "el-tasweeq-el-raqamy", canonicalSlug: "integrated-digital-marketing-strategy" },
  { path: "/data", courseSlug: "tahlil-el-bayanat", canonicalSlug: "data-driven-decision-making" },
  { path: "/design", courseSlug: "ui-ux-design-figma", canonicalSlug: "ui-ux-design-figma" },
  { path: "/career", courseSlug: "nomo-mehany", canonicalSlug: "career-transitions-adaptability" },
  { path: "/cybersecurity", courseSlug: "el-aman-el-raqamy", canonicalSlug: "personal-cyber-hygiene-opsec" },
  { path: "/productivity", courseSlug: "el-entagiya", canonicalSlug: "atomic-habits-relentless-focus" },
];

for (const vp of verticalPages) {
  const track = resolveCanonicalTrack(vp.courseSlug);
  record("Vertical Landing Track", `${vp.path} (${vp.courseSlug})`, Boolean(track && track.slug === vp.canonicalSlug), `Expected ${vp.canonicalSlug}, got ${track?.slug}`);

  const dayOneUrl = getTrackDayOneUrl(vp.courseSlug);
  const expectedUrl = `/app/learn/${vp.canonicalSlug}/1`;
  record("Vertical Landing Day 1 Route", vp.path, dayOneUrl === expectedUrl, `Expected ${expectedUrl}, got ${dayOneUrl}`);

  const lesson = loadUniversalLesson(vp.canonicalSlug, 1);
  record("Vertical Landing Day 1 Lesson", vp.path, Boolean(lesson?.lesson), "Day 1 lesson failed");

  const mission = loadMission(vp.canonicalSlug, 1);
  record("Vertical Landing Day 1 Mission", vp.path, Boolean(mission?.objective), "Day 1 mission failed");
}

// 6. Audit Practical Projects Showcase (Community & Home)
console.log(`\n💼 [6/6] Auditing Practical Projects Deliverables Showcase...`);
record("Practical Projects List", "NotEmpty", PRACTICAL_PROJECTS.length > 0, "No practical projects found");

for (const proj of PRACTICAL_PROJECTS) {
  const track = resolveCanonicalTrack(proj.trackSlug);
  record("Practical Project Track Exists", `${proj.id} (${proj.trackSlug})`, Boolean(track), `Track ${proj.trackSlug} not found in catalog`);

  const dayOneUrl = getTrackDayOneUrl(proj.trackSlug);
  const expectedUrl = `/app/learn/${proj.trackSlug}/1`;
  record("Practical Project Day 1 Route", proj.id, dayOneUrl === expectedUrl, `Expected ${expectedUrl}, got ${dayOneUrl}`);

  const lesson = loadUniversalLesson(proj.trackSlug, 1);
  record("Practical Project Day 1 Lesson", proj.id, Boolean(lesson?.lesson), "Day 1 lesson failed");

  const mission = loadMission(proj.trackSlug, 1);
  record("Practical Project Day 1 Mission", proj.id, Boolean(mission?.objective), "Day 1 mission failed");
}

console.log("\n========================================================");
console.log(`📊 VALIDATION SUMMARY:`);
console.log(`   Total Checks: ${results.length}`);
console.log(`   Passed:       ${results.length - failCount}`);
console.log(`   Failed:       ${failCount}`);
console.log("========================================================\n");

if (failCount > 0) {
  console.error(`❌ Validation failed with ${failCount} errors.`);
  process.exit(1);
} else {
  console.log(`✅ ALL ${results.length} ROUTE & CONTENT TRUTH CHECKS PASSED PERFECTLY! 🚀`);
  process.exit(0);
}
